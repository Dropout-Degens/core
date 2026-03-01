import json
import logging
import os
from pathlib import Path

import anthropic
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes, MessageHandler, filters

from tools import github_tools, supabase_tools

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

# --- Config ---
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
ALLOWED_USER_IDS = set(
    int(x) for x in os.getenv("ALLOWED_TELEGRAM_USER_IDS", "").split(",") if x.strip()
)
MODEL = "claude-sonnet-4-6"
MAX_TOKENS = 4096

# --- Load system prompt ---
SYSTEM_PROMPT_PATH = Path(__file__).parent / "system_prompt.md"
SYSTEM_PROMPT = SYSTEM_PROMPT_PATH.read_text(encoding="utf-8") if SYSTEM_PROMPT_PATH.exists() else ""

# --- Tools ---
ALL_TOOLS = github_tools.TOOL_DEFINITIONS + supabase_tools.TOOL_DEFINITIONS

# --- Conversation history (in-memory, per chat_id) ---
conversation_histories: dict[int, list] = {}

client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)


def is_authorized(user_id: int) -> bool:
    if not ALLOWED_USER_IDS:
        return True  # No restriction if env var not set
    return user_id in ALLOWED_USER_IDS


def handle_tool(tool_name: str, tool_input: dict) -> str:
    """Route tool calls to the right handler."""
    github_tool_names = {t["name"] for t in github_tools.TOOL_DEFINITIONS}
    supabase_tool_names = {t["name"] for t in supabase_tools.TOOL_DEFINITIONS}

    if tool_name in github_tool_names:
        return github_tools.handle_tool_call(tool_name, tool_input)
    elif tool_name in supabase_tool_names:
        return supabase_tools.handle_tool_call(tool_name, tool_input)
    return json.dumps({"error": f"Unknown tool: {tool_name}"})


def run_agent(chat_id: int, user_message: str) -> str:
    """Run the agentic loop: send message, handle tool calls, return final response."""
    history = conversation_histories.setdefault(chat_id, [])
    history.append({"role": "user", "content": user_message})

    while True:
        response = client.messages.create(
            model=MODEL,
            max_tokens=MAX_TOKENS,
            system=SYSTEM_PROMPT,
            tools=ALL_TOOLS,
            messages=history,
        )

        # Add assistant response to history
        history.append({"role": "assistant", "content": response.content})

        if response.stop_reason == "end_turn":
            # Extract text from response
            text_blocks = [b.text for b in response.content if hasattr(b, "text")]
            return "\n".join(text_blocks) or "(no response)"

        if response.stop_reason == "tool_use":
            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    log.info(f"Tool call: {block.name} | input: {block.input}")
                    result = handle_tool(block.name, block.input)
                    log.info(f"Tool result: {result[:200]}")
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result,
                    })

            history.append({"role": "user", "content": tool_results})
            continue

        # Unexpected stop reason
        return f"(stopped: {response.stop_reason})"


# --- Telegram handlers ---

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_authorized(update.effective_user.id):
        return
    await update.message.reply_text("Hey! I'm your PA. Ask me anything or tell me to create/update files in the repo.")


async def clear(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_authorized(update.effective_user.id):
        return
    conversation_histories.pop(update.effective_chat.id, None)
    await update.message.reply_text("Conversation cleared.")


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_authorized(update.effective_user.id):
        await update.message.reply_text("Not authorized.")
        return

    user_text = update.message.text
    chat_id = update.effective_chat.id

    # Show typing indicator
    await context.bot.send_chat_action(chat_id=chat_id, action="typing")

    try:
        reply = run_agent(chat_id, user_text)
    except Exception as e:
        log.exception("Error in agent loop")
        reply = f"Error: {e}"

    # Telegram message limit is 4096 chars — split if needed
    for i in range(0, len(reply), 4096):
        await update.message.reply_text(reply[i:i+4096])


def main():
    app = ApplicationBuilder().token(TELEGRAM_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("clear", clear))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    log.info("Bot started.")
    app.run_polling()


if __name__ == "__main__":
    main()
