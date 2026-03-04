import asyncio
import atexit
import base64
import json
import logging
import os
import re
import subprocess
import tempfile
import threading
from datetime import datetime
from pathlib import Path
import pytz

from dotenv import load_dotenv
load_dotenv()

import pytz
import anthropic
from apscheduler.schedulers.background import BackgroundScheduler
from telegram import Update
from telegram.constants import ParseMode
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes, MessageHandler, filters

from connections import github, supabase, voice
from connections import discord as discord_conn
from connections import google as google_conn
from connections import telegram as telegram_conn
from connections.personal import finances
from connections import memory as memory_conn
from connections import twitter as twitter_conn
from connections import instagram as instagram_conn
from schedules.discord import daily_poll_check, potd_check
from schedules.telegram import daily_recap, member_check
from schedules.uptime import log_event as log_uptime
from schedules.recovery import check_and_recover
from connections.discord.voice_listen import start_discord_voice_thread, request_call, request_end
from logger import log_turn
from session_store import init_db, get_or_create_session, save_history, end_session, update_session_topic, infer_topic

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

# --- Config ---
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
ALLOWED_USER_IDS = set(
    int(x) for x in os.getenv("ALLOWED_TELEGRAM_USER_IDS", "").split(",") if x.strip()
)
PA_CONTEXT_PATH = os.getenv("PA_CONTEXT_PATH", "")

# Models: Haiku by default, Sonnet when writing files
MODEL_DEFAULT = "claude-haiku-4-5-20251001"
MODEL_WRITE = "claude-sonnet-4-6"
WRITE_TOOLS = {"create_github_file", "update_github_file"}

MAX_TOKENS = 4096

# --- Load system prompt ---
SYSTEM_PROMPT_PATH = Path(__file__).parent / "system_prompt.md"
_base_prompt = SYSTEM_PROMPT_PATH.read_text(encoding="utf-8") if SYSTEM_PROMPT_PATH.exists() else ""

# --- Optionally fetch PA context README from GitHub ---
def _load_pa_context() -> str:
    if not PA_CONTEXT_PATH:
        return ""
    result = github.read_github_file(PA_CONTEXT_PATH)
    if "error" in result:
        log.warning(f"Could not load PA context from GitHub ({PA_CONTEXT_PATH}): {result['error']}")
        return ""
    log.info(f"Loaded PA context from GitHub: {PA_CONTEXT_PATH}")
    return result["content"]

_github_context = _load_pa_context()
SYSTEM_PROMPT = _base_prompt + (f"\n\n---\n\n{_github_context}" if _github_context else "")

# --- Tools ---
ALL_TOOLS = github.TOOL_DEFINITIONS + supabase.TOOL_DEFINITIONS + discord_conn.TOOL_DEFINITIONS + finances.TOOL_DEFINITIONS + google_conn.TOOL_DEFINITIONS + telegram_conn.TOOL_DEFINITIONS + memory_conn.TOOL_DEFINITIONS + twitter_conn.TOOL_DEFINITIONS + instagram_conn.TOOL_DEFINITIONS

# --- Conversation history (in-memory, per chat_id) ---
conversation_histories: dict[int, list] = {}
current_session_ids: dict[int, int] = {}

# --- Voice call mode (per chat_id) ---
# Only active when user explicitly starts with /call. Voice notes → voice replies only in this mode.
voice_call_active: dict[int, bool] = {}
non_voice_streak: dict[int, int] = {}  # consecutive text messages during a call

client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)


def fmt(text: str) -> str:
    """Convert Claude's markdown to Telegram Markdown format."""
    # Strip language tags from code blocks (```sql -> ```)
    text = re.sub(r'```[a-zA-Z]+\n', '```\n', text)
    # Convert **bold** to *bold*
    text = re.sub(r'\*\*(.+?)\*\*', r'*\1*', text, flags=re.DOTALL)
    return text


async def _keep_typing(bot, chat_id: int):
    """Refresh the typing indicator every 4s until cancelled."""
    try:
        while True:
            await bot.send_chat_action(chat_id=chat_id, action="typing")
            await asyncio.sleep(4)
    except asyncio.CancelledError:
        pass


async def _send_voice_note(bot, chat_id: int, text: str):
    """Convert text → ElevenLabs MP3 → OGG via ffmpeg → send as Telegram voice note."""
    from connections.voice.elevenlabs import text_to_speech

    loop = asyncio.get_event_loop()
    mp3_bytes = await loop.run_in_executor(None, text_to_speech, text)
    if not mp3_bytes:
        raise RuntimeError("ElevenLabs returned no audio")

    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as f:
        f.write(mp3_bytes)
        mp3_path = f.name

    ogg_path = mp3_path[:-4] + ".ogg"
    try:
        result = subprocess.run(
            ["ffmpeg", "-y", "-i", mp3_path, "-c:a", "libopus", "-b:a", "64k", ogg_path],
            capture_output=True,
            timeout=30,
        )
        if result.returncode != 0:
            raise RuntimeError(f"ffmpeg failed: {result.stderr.decode()[:200]}")
        with open(ogg_path, "rb") as f:
            await bot.send_voice(chat_id=chat_id, voice=f)
    finally:
        for p in (mp3_path, ogg_path):
            try:
                os.unlink(p)
            except Exception:
                pass


def _transcript_branch() -> str:
    """Returns today's yodai branch: yodai/YYYY-MM-DD."""
    return f"yodai/{datetime.now().strftime('%Y-%m-%d')}"


def _save_voice_transcript(subfolder: str, user_text: str, bot_text: str):
    """Append a voice exchange to core/context/yodai/calls/{subfolder}/YYYY-MM-DD.txt on GitHub."""
    date_str = datetime.now().strftime("%Y-%m-%d")
    now_str = datetime.now().strftime("%H:%M:%S")
    branch = _transcript_branch()
    path = f"core/context/yodai/calls/{subfolder}/{date_str}.txt"
    entry = f"[{now_str}] USER: {user_text}\nBOT:  {bot_text}\n\n"

    existing = github.read_github_file(path, branch=branch)
    if "error" in existing:
        result = github.create_github_file(path, entry, f"voice transcript {date_str}", branch=branch)
    else:
        result = github.update_github_file(path, existing["content"] + entry, f"voice transcript {date_str}", branch=branch)

    if "error" in result:
        log.warning(f"Failed to save voice transcript to GitHub: {result['error']}")


async def send(update: Update, text: str):
    """Send a reply with Markdown formatting, chunked if needed."""
    formatted = fmt(text)
    for i in range(0, len(formatted), 4096):
        chunk = formatted[i:i+4096]
        try:
            await update.message.reply_text(chunk, parse_mode=ParseMode.MARKDOWN)
        except Exception:
            # Fall back to plain text if markdown parse fails
            await update.message.reply_text(chunk)


_TOOL_LABELS = {
    # GitHub
    "read_github_file":       "📄",
    "list_github_directory":  "📂",
    "create_github_branch":   "🌿",
    "merge_github_branch":    "🔀",
    "create_github_file":     "✍️",
    "update_github_file":     "✍️",
    # Supabase
    "query_private":          "🗄️",
    "query_personal":         "🗄️",
    "query_manual":           "🗄️",
    "update_manual":          "💾",
    # Discord
    "read_discord_channel":   "💬",
    "send_discord_message":   "📤",
    # Google Calendar
    "calendar_list_events":   "📅",
    "calendar_create_event":  "📅",
    "calendar_update_event":  "📅",
    "calendar_delete_event":  "📅",
    "calendar_list_calendars":"📅",
    # Gmail
    "gmail_list_emails":      "📧",
    "gmail_get_email":        "📧",
    "gmail_create_draft":     "📝",
    # Finances
    "fina_get_accounts":      "💰",
    "fina_get_transactions":  "💰",
    # Telegram
    "react_to_message":       "👍",
    # Memory
    "load_past_context":      "🧠",
}

def _progress_bar(step: int) -> str:
    """Rolling progress bar — fills as steps increase, caps at 90% until done."""
    pct = min(90, step * 20)  # 20% per step, max 90 until finished
    filled = pct // 10
    bar = "=" * filled + "-" * (10 - filled)
    return f"|{bar}| {pct}%"


def is_authorized(user_id: int) -> bool:
    if not ALLOWED_USER_IDS:
        return True  # No restriction if env var not set
    return user_id in ALLOWED_USER_IDS


def handle_tool(tool_name: str, tool_input: dict, chat_id: int = None, message_id: int = None) -> str:
    """Route tool calls to the right handler."""
    github_tool_names = {t["name"] for t in github.TOOL_DEFINITIONS}
    supabase_tool_names = {t["name"] for t in supabase.TOOL_DEFINITIONS}
    discord_tool_names = {t["name"] for t in discord_conn.TOOL_DEFINITIONS}
    finances_tool_names = {t["name"] for t in finances.TOOL_DEFINITIONS}
    google_tool_names = {t["name"] for t in google_conn.TOOL_DEFINITIONS}
    telegram_tool_names = {t["name"] for t in telegram_conn.TOOL_DEFINITIONS}
    memory_tool_names = {t["name"] for t in memory_conn.TOOL_DEFINITIONS}
    twitter_tool_names = {t["name"] for t in twitter_conn.TOOL_DEFINITIONS}
    instagram_tool_names = {t["name"] for t in instagram_conn.TOOL_DEFINITIONS}

    if tool_name in github_tool_names:
        return github.handle_tool_call(tool_name, tool_input)
    elif tool_name in supabase_tool_names:
        return supabase.handle_tool_call(tool_name, tool_input)
    elif tool_name in discord_tool_names:
        return discord_conn.handle_tool_call(tool_name, tool_input)
    elif tool_name in finances_tool_names:
        return finances.handle_tool_call(tool_name, tool_input)
    elif tool_name in google_tool_names:
        return google_conn.handle_tool_call(tool_name, tool_input)
    elif tool_name in telegram_tool_names:
        return telegram_conn.handle_tool_call(tool_name, tool_input, chat_id=chat_id, message_id=message_id)
    elif tool_name in memory_tool_names:
        return memory_conn.handle_tool_call(tool_name, tool_input)
    elif tool_name in twitter_tool_names:
        return twitter_conn.handle_tool_call(tool_name, tool_input)
    elif tool_name in instagram_tool_names:
        return instagram_conn.handle_tool_call(tool_name, tool_input)
    return json.dumps({"error": f"Unknown tool: {tool_name}"})


def run_agent(chat_id: int, user_message: str | list, message_id: int = None, on_tool_start=None) -> str:
    """Run the agentic loop: send message, handle tool calls, return final response."""
    history = conversation_histories.setdefault(chat_id, [])

    # Heal corrupted history: if the last assistant message has tool_use blocks
    # with no following tool_result, every subsequent API call will 400.
    # Blocks may be Anthropic SDK objects (in-memory) or plain dicts (loaded from DB).
    def _block_type(b):
        return b.get("type") if isinstance(b, dict) else getattr(b, "type", None)

    def _block_id(b):
        return b.get("id") if isinstance(b, dict) else getattr(b, "id", None)

    if history and history[-1].get("role") == "assistant":
        orphaned = [b for b in history[-1].get("content", []) if _block_type(b) == "tool_use"]
        if orphaned:
            log.warning(f"Auto-repairing {len(orphaned)} orphaned tool_use block(s) in history for chat {chat_id}")
            history.append({
                "role": "user",
                "content": [
                    {"type": "tool_result", "tool_use_id": _block_id(b), "content": "(previous response was truncated)"}
                    for b in orphaned
                ],
            })

    history.append({"role": "user", "content": user_message})
    run_agent._tool_step = 0

    # Start each user turn with the cheap model; escalate if a write tool fires
    model = MODEL_DEFAULT

    now = datetime.now(pytz.timezone("America/New_York"))
    system = SYSTEM_PROMPT + f"\n\nCurrent date and time: {now.strftime('%A, %B %d, %Y %I:%M %p')} EST"

    while True:
        # Sliding window — trim to avoid hitting token limits
        if len(history) > 80:
            history = history[-80:]
            conversation_histories[chat_id] = history

        response = client.messages.create(
            model=model,
            max_tokens=MAX_TOKENS,
            system=system,
            tools=ALL_TOOLS,
            messages=history,
        )

        history.append({"role": "assistant", "content": response.content})

        if response.stop_reason == "end_turn":
            text_blocks = [b.text for b in response.content if hasattr(b, "text")]
            return "\n".join(text_blocks).strip() or "__reacted__"

        if response.stop_reason == "tool_use":
            tool_results = []
            used_write_tool = False
            tool_step = getattr(run_agent, "_tool_step", 0)

            for block in response.content:
                if block.type == "tool_use":
                    tool_step += 1
                    run_agent._tool_step = tool_step
                    log.info(f"Tool call: {block.name} | input: {block.input}")
                    if on_tool_start:
                        on_tool_start(block.name, tool_step)
                    if block.name in WRITE_TOOLS:
                        used_write_tool = True
                    result = handle_tool(block.name, block.input, chat_id=chat_id, message_id=message_id)
                    log.info(f"Tool result: {result[:200]}")
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result,
                    })

            # Escalate to Sonnet for the turn that processes write tool results
            if used_write_tool:
                log.info("Write tool used — switching to Sonnet for this turn")
                model = MODEL_WRITE

            history.append({"role": "user", "content": tool_results})
            continue

        # If history ends with an assistant tool_use that has no tool_result,
        # the next API call will 400. Add synthetic results to keep history valid.
        orphaned = [b for b in response.content if getattr(b, "type", None) == "tool_use"]
        if orphaned:
            history.append({
                "role": "user",
                "content": [
                    {"type": "tool_result", "tool_use_id": b.id, "content": f"(response truncated: {response.stop_reason})"}
                    for b in orphaned
                ],
            })
        return f"(stopped: {response.stop_reason})"


# --- Telegram handlers ---

async def discord_call(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_authorized(update.effective_user.id):
        return
    request_call()
    await update.message.reply_text("Calling Discord voice channel...")


async def discord_end(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_authorized(update.effective_user.id):
        return
    request_end()
    await update.message.reply_text("Ending Discord voice session...")


async def call(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Start a Telegram voice call session — voice notes get voice note replies."""
    if not is_authorized(update.effective_user.id):
        return
    chat_id = update.effective_chat.id
    voice_call_active[chat_id] = True
    non_voice_streak[chat_id] = 0
    log.info(f"Voice call started for chat {chat_id}")
    typing_task = asyncio.create_task(_keep_typing(context.bot, chat_id))
    try:
        await _send_voice_note(context.bot, chat_id, "Hey, what's up? How can I help?")
    except Exception as e:
        log.warning(f"Call greeting voice note failed: {e}")
        await update.message.reply_text("Voice call started. Send me a voice note!")
    finally:
        typing_task.cancel()


async def end(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """End the Telegram voice call session."""
    if not is_authorized(update.effective_user.id):
        return
    chat_id = update.effective_chat.id
    voice_call_active[chat_id] = False
    non_voice_streak[chat_id] = 0
    log.info(f"Voice call ended for chat {chat_id}")
    await update.message.reply_text("Call ended. Back to text mode.")


async def myid(update: Update, context: ContextTypes.DEFAULT_TYPE):
    uid = update.effective_user.id
    await update.message.reply_text(f"Your Telegram user ID: `{uid}`\nChat ID: `{update.effective_chat.id}`", parse_mode=ParseMode.MARKDOWN)


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_authorized(update.effective_user.id):
        return
    await update.message.reply_text("Hey! I'm your PA. Ask me anything or tell me to create/update files in the repo.")


async def clear(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_authorized(update.effective_user.id):
        return
    chat_id = update.effective_chat.id
    conversation_histories.pop(chat_id, None)
    end_session(chat_id)
    current_session_ids.pop(chat_id, None)
    await update.message.reply_text("Conversation cleared.")


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_authorized(update.effective_user.id):
        await update.message.reply_text("Not authorized.")
        return

    user_text = update.message.text
    chat_id = update.effective_chat.id
    message_id = update.message.message_id

    # Session — load from DB if not in memory (e.g. after restart)
    session_id, loaded = get_or_create_session(chat_id)
    current_session_ids[chat_id] = session_id
    if chat_id not in conversation_histories and loaded:
        conversation_histories[chat_id] = loaded

    progress_msg = None
    tools_used = []
    event_loop = asyncio.get_event_loop()

    async def _edit_progress(text: str):
        nonlocal progress_msg
        try:
            if progress_msg is None:
                progress_msg = await context.bot.send_message(chat_id=chat_id, text=text)
            else:
                await progress_msg.edit_text(text)
        except Exception:
            pass

    def on_tool_start(tool_name: str, step: int):
        tools_used.append(tool_name)
        emoji = _TOOL_LABELS.get(tool_name, "⚙️")
        bar = _progress_bar(step)
        text = f"{bar} {emoji}"
        asyncio.run_coroutine_threadsafe(_edit_progress(text), event_loop).result(timeout=5)

    typing_task = asyncio.create_task(_keep_typing(context.bot, chat_id))
    try:
        loop = asyncio.get_event_loop()
        reply = await loop.run_in_executor(None, lambda: run_agent(chat_id, user_text, message_id=message_id, on_tool_start=on_tool_start))
    except Exception as e:
        log.exception("Error in agent loop")
        reply = f"Error: {e}"
    finally:
        typing_task.cancel()
        if progress_msg:
            try:
                await progress_msg.delete()
            except Exception:
                pass

    if reply and reply.strip() not in ("", "__reacted__"):
        await send(update, reply)

    # Voice call: track consecutive text messages; auto-end after 3
    if voice_call_active.get(chat_id):
        streak = non_voice_streak.get(chat_id, 0) + 1
        non_voice_streak[chat_id] = streak
        if streak >= 3:
            voice_call_active[chat_id] = False
            non_voice_streak[chat_id] = 0
            log.info(f"Voice call auto-ended for chat {chat_id} (3 text messages)")
            await context.bot.send_message(chat_id=chat_id, text="Call ended — switched back to text mode.")

    # Background: log turn + update session topic + persist history
    event_loop.run_in_executor(None, lambda: log_turn(user_text, tools_used))
    sid = current_session_ids.get(chat_id)
    if sid:
        if tools_used:
            update_session_topic(sid, infer_topic(tools_used))
        hist = list(conversation_histories.get(chat_id, []))
        event_loop.run_in_executor(None, lambda: save_history(sid, hist))


async def handle_photo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_authorized(update.effective_user.id):
        await update.message.reply_text("Not authorized.")
        return

    chat_id = update.effective_chat.id
    message_id = update.message.message_id
    caption = update.message.caption or ""

    typing_task = asyncio.create_task(_keep_typing(context.bot, chat_id))
    try:
        photo = update.message.photo[-1]  # highest resolution
        file = await context.bot.get_file(photo.file_id)
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
            await file.download_to_drive(tmp.name)
            tmp_path = tmp.name

        with open(tmp_path, "rb") as f:
            image_data = base64.b64encode(f.read()).decode("utf-8")
        os.unlink(tmp_path)

        content = [
            {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": image_data}},
            {"type": "text", "text": caption or "What's in this image?"},
        ]

        loop = asyncio.get_event_loop()
        reply = await loop.run_in_executor(None, lambda: run_agent(chat_id, content, message_id=message_id))
        await send(update, reply)

    except Exception as e:
        log.exception("Error processing image")
        await update.message.reply_text(f"Error processing image: {e}")
    finally:
        typing_task.cancel()


async def handle_voice(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_authorized(update.effective_user.id):
        await update.message.reply_text("Not authorized.")
        return

    chat_id = update.effective_chat.id
    message_id = update.message.message_id

    typing_task = asyncio.create_task(_keep_typing(context.bot, chat_id))
    try:
        file = await context.bot.get_file(update.message.voice.file_id)
        with tempfile.NamedTemporaryFile(suffix=".ogg", delete=False) as tmp:
            await file.download_to_drive(tmp.name)
            tmp_path = tmp.name

        transcript = voice.transcribe(tmp_path)
        os.unlink(tmp_path)

        log.info(f"Voice transcript: {transcript}")
        loop = asyncio.get_event_loop()
        reply = await loop.run_in_executor(None, lambda: run_agent(chat_id, transcript, message_id=message_id))

        if voice_call_active.get(chat_id):
            # In call mode: reply with a voice note, save transcript, reset text streak
            non_voice_streak[chat_id] = 0
            loop.run_in_executor(None, lambda: _save_voice_transcript("telegram", transcript, reply))
            try:
                await _send_voice_note(context.bot, chat_id, reply)
            except Exception as e:
                log.warning(f"Voice note failed, sending text: {e}")
                await send(update, reply)
        else:
            # Not in call mode: normal text reply
            await send(update, reply)

    except Exception as e:
        log.exception("Error processing voice message")
        await update.message.reply_text(f"Error processing voice: {e}")
    finally:
        typing_task.cancel()


# Daily jobs eligible for missed-schedule recovery (hour/minute/second must be ints).
# member_check runs every 2h and is excluded — it's routine and recovers naturally.
SCHEDULE_REGISTRY = [
    {"name": "daily_poll_check", "hour": 11, "minute": 29, "second": 30, "fn": daily_poll_check.run},
    {"name": "potd_check",       "hour": 13, "minute": 29, "second": 30, "fn": potd_check.run},
    {"name": "daily_recap",      "hour": 23, "minute": 29, "second": 30, "fn": daily_recap.run},
]


def main():
    init_db()

    # --- Uptime logging ---
    log_uptime("START")
    atexit.register(lambda: log_uptime("STOP"))

    # --- Scheduler ---
    scheduler = BackgroundScheduler(timezone=pytz.timezone("America/New_York"))
    for job in SCHEDULE_REGISTRY:
        scheduler.add_job(job["fn"], "cron", hour=job["hour"], minute=job["minute"], second=job["second"])
    scheduler.add_job(member_check.run, "cron", hour="*/2", minute=0, second=0)
    scheduler.start()
    log.info("Scheduler started. Jobs: %s", [str(j) for j in scheduler.get_jobs()])

    # --- Missed schedule recovery ---
    check_and_recover(SCHEDULE_REGISTRY)

    # --- Discord voice listener (daemon thread) ---
    threading.Thread(
        target=lambda: start_discord_voice_thread(run_agent_callback=run_agent),
        daemon=True,
        name="discord-voice",
    ).start()
    log.info("Discord voice listener thread started.")

    # --- Telegram ---
    app = ApplicationBuilder().token(TELEGRAM_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("clear", clear))
    app.add_handler(CommandHandler("myid", myid))
    app.add_handler(CommandHandler("call", call))
    app.add_handler(CommandHandler("end", end))
    app.add_handler(CommandHandler("discord_call", discord_call))
    app.add_handler(CommandHandler("discord_end", discord_end))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    app.add_handler(MessageHandler(filters.VOICE, handle_voice))
    app.add_handler(MessageHandler(filters.PHOTO, handle_photo))

    log.info("Bot started.")
    app.run_polling()


if __name__ == "__main__":
    main()
