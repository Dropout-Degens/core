"""
Daily poll check — runs at 12:29:30 EST.

Checks if the daily poll was posted in the poll channel today.
If yes: reports vote count (from Supabase votes table).
If no: reports it was not posted.
Sends result to the notify channel tagging @asiad_.
"""
import logging
import os
import time
from datetime import date, datetime, timezone

import requests

from schedules.uptime import log_schedule_run

log = logging.getLogger(__name__)

DISCORD_EPOCH = 1420070400000
POLL_CHANNEL_ID = "1178415778517758002"
ASIAD_USER_ID = "340076015797796864"


def _discord_headers():
    return {"Authorization": f"Bot {os.getenv('DISCORD_BOT_TOKEN')}"}


def _get_today_poll():
    """Return today's poll row from Supabase, or None."""
    PAT = os.getenv("SUPABASE_PAT")
    REF = os.getenv("SUPABASE_PROJECT_REF")

    r = requests.post(
        f"https://api.supabase.com/v1/projects/{REF}/database/query",
        headers={"Authorization": f"Bearer {PAT}", "Content-Type": "application/json"},
        json={"query": f'SELECT id, question FROM private."poll" ORDER BY id DESC LIMIT 50'},
        timeout=10,
    )
    if not r.ok:
        log.error(f"Supabase query failed: {r.text}")
        return None

    today = date.today()
    for row in r.json():
        ts_ms = (int(row["id"]) >> 22) + DISCORD_EPOCH
        row_date = datetime.fromtimestamp(ts_ms / 1000, tz=timezone.utc).date()
        if row_date == today:
            return row

    return None


def _get_vote_count(poll_id: str) -> int:
    """Count votes for a poll from Supabase."""
    PAT = os.getenv("SUPABASE_PAT")
    REF = os.getenv("SUPABASE_PROJECT_REF")

    r = requests.post(
        f"https://api.supabase.com/v1/projects/{REF}/database/query",
        headers={"Authorization": f"Bearer {PAT}", "Content-Type": "application/json"},
        json={"query": f"SELECT COUNT(*) as count FROM private.\"votes\" WHERE poll_id = '{poll_id}'"},
        timeout=10,
    )
    if not r.ok:
        log.error(f"Vote count query failed: {r.text}")
        return 0
    return int(r.json()[0]["count"])


def _send_discord_message(content: str):
    send_channel = os.getenv("DISCORD_SEND_CHANNEL_ID")
    r = requests.post(
        f"https://discord.com/api/v10/channels/{send_channel}/messages",
        headers={**_discord_headers(), "Content-Type": "application/json"},
        json={"content": content},
        timeout=10,
    )
    if not r.ok:
        log.error(f"Discord send failed: {r.status_code} {r.text}")


def run():
    """Main entry point — called by the scheduler."""
    t = time.monotonic()
    log.info("Running daily poll check")

    try:
        poll = _get_today_poll()

        if poll:
            vote_count = _get_vote_count(poll["id"])
            msg = f"<@{ASIAD_USER_ID}> the daily poll has **{vote_count}** votes so far today"
            detail = f"{vote_count} votes"
        else:
            msg = f"<@{ASIAD_USER_ID}> the daily poll was not posted for today"
            detail = "not posted"

        log.info(f"Daily poll check result: {msg}")
        _send_discord_message(msg)
        log_schedule_run("daily_poll_check", "OK", detail, time.monotonic() - t)
    except Exception as e:
        log.error(f"daily_poll_check failed: {e}")
        log_schedule_run("daily_poll_check", "FAILED", str(e)[:80], time.monotonic() - t)
