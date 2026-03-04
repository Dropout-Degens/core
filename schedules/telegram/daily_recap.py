"""
Daily recap — runs at 11:29:30 PM ET.

Lists all files committed to today's yodai/{YYYY-MM-DD} branch,
plus a summary of what was worked on today, then sends a Telegram message
to the owner for review. Once confirmed, say "merge" to push to main.
"""
import json
import logging
import os
import time
from datetime import date, datetime, timezone
from pathlib import Path

import pytz
import requests

from schedules.uptime import log_schedule_run

LOGS_DIR = Path(__file__).parent.parent.parent / "logs" / "daily"
RECAP_LOGS_DIR = Path(__file__).parent.parent.parent / "logs" / "recap"


def _log_recap(event: str, detail: str = ""):
    """Write a structured recap log line to logs/recap/YYYY-MM-DD.log."""
    try:
        RECAP_LOGS_DIR.mkdir(parents=True, exist_ok=True)
        now = datetime.now(pytz.timezone("America/New_York"))
        line = f"[{now.strftime('%Y-%m-%d %H:%M:%S')} EST] {event:<20} | {detail}\n"
        log_file = RECAP_LOGS_DIR / f"{now.strftime('%Y-%m-%d')}.log"
        with open(log_file, "a", encoding="utf-8") as f:
            f.write(line)
    except Exception as e:
        log.warning(f"_log_recap failed: {e}")

_TOPIC_LABELS = {
    "supabase":  "🗄️",
    "discord":   "💬",
    "calendar":  "📅",
    "github":    "📁",
    "finances":  "💰",
    "yodai":     "🤖",
}

log = logging.getLogger(__name__)

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_REPO = os.getenv("GITHUB_REPO")
GITHUB_HEADERS = {
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
}
BASE_URL = f"https://api.github.com/repos/{GITHUB_REPO}"


def _get_daily_log(date_str: str) -> list[dict]:
    """Read today's conversation log entries."""
    log_file = LOGS_DIR / f"{date_str}.jsonl"
    if not log_file.exists():
        return []
    entries = []
    with open(log_file, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                try:
                    entries.append(json.loads(line))
                except Exception:
                    pass
    return entries


def _format_log(entries: list[dict]) -> str:
    if not entries:
        return ""
    lines = []
    for e in entries:
        icon = _TOPIC_LABELS.get(e.get("topic", "yodai"), "•")
        lines.append(f"{icon} _{e['ts']}_ — {e['summary']}")
    return "\n".join(lines)


def _get_branch_files(branch: str) -> list[str]:
    """Return list of file paths added/modified on branch vs main."""
    r = requests.get(
        f"{BASE_URL}/compare/main...{branch}",
        headers=GITHUB_HEADERS,
        timeout=10,
    )
    if r.status_code == 404:
        return []
    if not r.ok:
        log.error(f"GitHub compare failed: {r.status_code} {r.text[:200]}")
        return []
    files = r.json().get("files", [])
    return [f["filename"] for f in files if f["status"] in ("added", "modified")]


def _send_telegram(chat_id: str, text: str):
    token = os.getenv("TELEGRAM_TOKEN")
    r = requests.post(
        f"https://api.telegram.org/bot{token}/sendMessage",
        json={"chat_id": chat_id, "text": text, "parse_mode": "Markdown"},
        timeout=10,
    )
    if not r.ok:
        log.error(f"Telegram send failed: {r.status_code} {r.text[:200]}")


def run():
    """Main entry point — called by the scheduler."""
    t_start = time.monotonic()
    owner_chat_id = os.getenv("TELEGRAM_OWNER_CHAT_ID")
    if not owner_chat_id:
        log.warning("TELEGRAM_OWNER_CHAT_ID not set — skipping daily recap")
        _log_recap("RECAP_SKIPPED", "TELEGRAM_OWNER_CHAT_ID not set")
        return

    today = date.today().strftime("%Y-%m-%d")
    branch = f"yodai/{today}"

    _log_recap("RECAP_TRIGGERED", f"branch={branch}")
    log.info(f"Running daily recap for branch {branch}")

    try:
        files = _get_branch_files(branch)
        _log_recap("BRANCH_FETCHED", f"{len(files)} files on {branch}")
    except Exception as e:
        _log_recap("RECAP_FAILED", f"branch fetch error: {e}")
        _send_telegram(owner_chat_id, f"⚠️ Daily recap failed — could not fetch branch `{branch}`:\n`{e}`")
        return

    log_entries = _get_daily_log(today)
    log_section = _format_log(log_entries)

    parts = [f"*YodAI Daily Recap — {today}*"]

    if log_section:
        parts.append(f"*Today's work:*\n{log_section}")
    else:
        parts.append("_Nothing logged today._")

    if files:
        file_list = "\n".join(f"• `{f}`" for f in files)
        parts.append(f"*Branch `{branch}`:*\n{file_list}\n\nReply to make any changes, then say *\"merge\"* to push to main.")
    else:
        parts.append(f"_No files on today's branch. Nothing to merge._")

    msg = "\n\n".join(parts)

    try:
        log.info(f"Sending recap: {len(files)} files")
        _send_telegram(owner_chat_id, msg)
        duration = time.monotonic() - t_start
        _log_recap("MESSAGE_SENT", f"telegram ok | {len(files)} files")
        _log_recap("RECAP_COMPLETE", f"duration={duration:.1f}s")
        log_schedule_run("daily_recap", "OK", f"{len(files)} files", duration)
    except Exception as e:
        _log_recap("RECAP_FAILED", f"telegram send error: {e}")
        log.error(f"Daily recap telegram send failed: {e}")
        log_schedule_run("daily_recap", "FAILED", str(e)[:80], time.monotonic() - t_start)
