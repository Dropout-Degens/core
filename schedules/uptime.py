"""
Uptime logging — called from bot.py on start and shutdown.
Writes one line per event to logs/uptime.log.
Format: 2026-03-04 13:15:00 EST | START
"""
import logging
from datetime import datetime
from pathlib import Path

import pytz

log = logging.getLogger(__name__)

UPTIME_LOG = Path(__file__).parent.parent / "logs" / "uptime.log"
TZ = pytz.timezone("America/New_York")


def log_event(event: str):
    """Append START or STOP to the uptime log."""
    try:
        UPTIME_LOG.parent.mkdir(parents=True, exist_ok=True)
        now = datetime.now(TZ).strftime("%Y-%m-%d %H:%M:%S")
        with open(UPTIME_LOG, "a", encoding="utf-8") as f:
            f.write(f"{now} EST | {event}\n")
        log.info(f"Uptime event logged: {event}")
    except Exception as e:
        log.warning(f"uptime log_event failed: {e}")


def get_last_offline_gap() -> tuple[datetime, datetime] | None:
    """
    Parse uptime log and return (last_stop_dt, now) if an unrecovered offline gap exists.

    A gap exists when the last entry in the log was STOP — meaning the bot shut down cleanly
    but hasn't logged a START yet (i.e., this is the first call on the new startup, before
    log_event("START") is written).

    Returns None if:
    - Log doesn't exist (first ever run)
    - Bot crashed without a clean STOP (last entry is START)
    - No gap exists
    """
    if not UPTIME_LOG.exists():
        return None

    last_stop = None
    try:
        with open(UPTIME_LOG, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                parts = line.split(" | ")
                if len(parts) != 2:
                    continue
                ts_str = parts[0].replace(" EST", "").strip()
                event = parts[1].strip()
                try:
                    dt = TZ.localize(datetime.strptime(ts_str, "%Y-%m-%d %H:%M:%S"))
                except ValueError:
                    continue
                if event == "STOP":
                    last_stop = dt
                elif event == "START":
                    last_stop = None  # This START resolved the previous STOP
    except Exception as e:
        log.warning(f"uptime log parse failed: {e}")
        return None

    if last_stop is None:
        return None

    return (last_stop, datetime.now(TZ))
