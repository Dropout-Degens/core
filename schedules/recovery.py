"""
Missed schedule recovery — called on bot startup after uptime.log_event("START").

Detects which daily scheduled jobs were supposed to run while the bot was offline
and runs them. Sends a Telegram summary to the owner.

If >3 missed schedule instances, sends a batched summary instead of running them.
"""
import logging
import os
from datetime import datetime, timedelta

import pytz
import requests

from schedules.uptime import get_last_offline_gap

log = logging.getLogger(__name__)
TZ = pytz.timezone("America/New_York")


def _send_telegram(text: str):
    token = os.getenv("TELEGRAM_TOKEN")
    chat_id = os.getenv("TELEGRAM_OWNER_CHAT_ID")
    if not token or not chat_id:
        log.warning("recovery: TELEGRAM_TOKEN or TELEGRAM_OWNER_CHAT_ID not set — skipping notify")
        return
    try:
        r = requests.post(
            f"https://api.telegram.org/bot{token}/sendMessage",
            json={"chat_id": chat_id, "text": text, "parse_mode": "Markdown"},
            timeout=10,
        )
        if not r.ok:
            log.warning(f"recovery telegram send failed: {r.status_code} {r.text[:100]}")
    except Exception as e:
        log.warning(f"recovery telegram send error: {e}")


def _job_fired_in_gap(hour: int, minute: int, second: int,
                       gap_start: datetime, gap_end: datetime) -> list[datetime]:
    """Return list of times this daily cron job would have fired within the gap."""
    fired = []
    current = gap_start.date()
    while current <= gap_end.date():
        fire_dt = TZ.localize(datetime(current.year, current.month, current.day, hour, minute, second))
        if gap_start < fire_dt < gap_end:
            fired.append(fire_dt)
        current += timedelta(days=1)
    return fired


def check_and_recover(registry: list[dict]):
    """
    Check for missed schedules and run them.

    Registry entries (daily jobs only — hour/minute/second as ints):
        {"name": str, "hour": int, "minute": int, "second": int, "fn": callable}

    Batching rule: if >3 missed instances, send one summary to Telegram instead of
    running each individually (too many to auto-recover reliably).
    """
    gap = get_last_offline_gap()
    if not gap:
        log.info("No offline gap detected — skipping missed schedule recovery")
        return

    gap_start, gap_end = gap
    duration_min = int((gap_end - gap_start).total_seconds() / 60)
    log.info(
        f"Offline gap: {gap_start.strftime('%Y-%m-%d %H:%M')} → "
        f"{gap_end.strftime('%H:%M')} EST ({duration_min} min)"
    )

    missed = []
    for entry in registry:
        for fired_at in _job_fired_in_gap(
            entry["hour"], entry["minute"], entry.get("second", 0),
            gap_start, gap_end,
        ):
            missed.append({**entry, "fired_at": fired_at})

    if not missed:
        log.info("No missed schedules in the offline gap")
        _send_telegram(
            f"⚡ *Bot restarted* — was offline for {duration_min} min "
            f"({gap_start.strftime('%H:%M')} → {gap_end.strftime('%H:%M')} EST). "
            f"No scheduled tasks were missed."
        )
        return

    log.info(f"{len(missed)} missed schedule(s): {[m['name'] for m in missed]}")

    if len(missed) > 3:
        # Too many to run individually — send batched summary
        lines = "\n".join(
            f"• `{m['name']}` — scheduled {m['fired_at'].strftime('%H:%M')} EST"
            for m in missed
        )
        _send_telegram(
            f"⚡ *Bot restarted* after {duration_min} min offline.\n\n"
            f"*{len(missed)} tasks were missed* (too many to auto-recover — run manually if needed):\n"
            f"{lines}"
        )
        return

    # ≤3 missed — notify then run each
    names = ", ".join(f"`{m['name']}`" for m in missed)
    _send_telegram(
        f"⚡ *Bot restarted* after {duration_min} min offline. "
        f"Running {len(missed)} missed task(s): {names}"
    )

    for m in missed:
        scheduled_str = m["fired_at"].strftime("%H:%M EST")
        log.info(f"Recovering missed schedule: {m['name']} (was due {scheduled_str})")
        try:
            m["fn"]()
            log.info(f"Recovery OK: {m['name']}")
        except Exception as e:
            log.error(f"Recovery failed for {m['name']}: {e}")
            _send_telegram(
                f"❌ Missed task `{m['name']}` (due {scheduled_str}) failed to recover: `{e}`"
            )
