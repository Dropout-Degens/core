"""
Play of the Day check — runs at 2:29:30 PM CT.

Pulls today's partner from Google Calendar (all-day event),
checks if a POTD post was made in the POTD channel today,
and sends a status message tagging @asiad_.
"""
import logging
import os
import time
from datetime import date, datetime, timezone, timedelta

import requests

from schedules.uptime import log_schedule_run

log = logging.getLogger(__name__)

DISCORD_EPOCH = 1420070400000
ASIAD_USER_ID = "340076015797796864"
POTD_CHANNEL_ID = os.getenv("DISCORD_POTD_CHANNEL_ID", "")


def _discord_headers():
    return {"Authorization": f"Bot {os.getenv('DISCORD_BOT_TOKEN')}"}


def _get_todays_partner() -> str | None:
    """Get today's partner promo from Google Calendar all-day events."""
    token = _get_google_access_token()
    if not token:
        return None

    today = date.today().isoformat()
    r = requests.get(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        headers={"Authorization": f"Bearer {token}"},
        params={
            "timeMin": f"{today}T00:00:00Z",
            "timeMax": f"{today}T23:59:59Z",
            "singleEvents": "true",
            "orderBy": "startTime",
        },
        timeout=10,
    )
    if not r.ok:
        log.error(f"Google Calendar error: {r.text}")
        return None

    for event in r.json().get("items", []):
        # All-day events have 'date' key, not 'dateTime'
        if "date" in event.get("start", {}):
            return event.get("summary", "").strip()

    return None


def _get_google_access_token() -> str | None:
    r = requests.post("https://oauth2.googleapis.com/token", data={
        "client_id": os.getenv("GOOGLE_CLIENT_ID"),
        "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
        "refresh_token": os.getenv("GOOGLE_REFRESH_TOKEN"),
        "grant_type": "refresh_token",
    }, timeout=10)
    if not r.ok:
        log.error(f"Google token refresh failed: {r.text}")
        return None
    return r.json().get("access_token")


def _get_potd_message() -> dict | None:
    """
    Return the first POTD message posted today, or None.
    Dict keys: content (str), image_url (str | None)
    """
    if not POTD_CHANNEL_ID:
        log.warning("DISCORD_POTD_CHANNEL_ID not set")
        return None

    r = requests.get(
        f"https://discord.com/api/v10/channels/{POTD_CHANNEL_ID}/messages?limit=20",
        headers=_discord_headers(),
        timeout=10,
    )
    if not r.ok:
        log.error(f"Discord read failed: {r.status_code} {r.text}")
        return None

    today = date.today()
    for msg in r.json():
        ts_ms = (int(msg["id"]) >> 22) + DISCORD_EPOCH
        msg_date = datetime.fromtimestamp(ts_ms / 1000, tz=timezone.utc).date()
        if msg_date == today:
            image_url = None
            if msg.get("attachments"):
                image_url = msg["attachments"][0]["url"]
            elif msg.get("embeds"):
                image_url = (msg["embeds"][0].get("image") or {}).get("url")
            return {"content": msg.get("content", ""), "image_url": image_url}

    return None


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


def _cross_post(potd: dict):
    """Post the POTD to Twitter and Instagram. Logs errors but does not raise."""
    from connections.twitter import post_tweet
    from connections.instagram import post_photo

    text = potd["content"]
    image_url = potd["image_url"]

    # Twitter
    if os.getenv("TWITTER_API_KEY"):
        result = post_tweet(text[:280], image_url)
        if "error" in result:
            log.error(f"Twitter cross-post failed: {result['error']}")
        else:
            log.info(f"Twitter cross-post success: {result.get('url')}")
    else:
        log.info("TWITTER_API_KEY not set — skipping Twitter cross-post")

    # Instagram (requires an image)
    if os.getenv("INSTAGRAM_ACCESS_TOKEN"):
        if image_url:
            result = post_photo(image_url, text)
            if "error" in result:
                log.error(f"Instagram cross-post failed: {result['error']}")
            else:
                log.info(f"Instagram cross-post success: media_id={result.get('media_id')}")
        else:
            log.warning("No image in POTD message — skipping Instagram cross-post")
    else:
        log.info("INSTAGRAM_ACCESS_TOKEN not set — skipping Instagram cross-post")


def run():
    """Main entry point — called by the scheduler."""
    t = time.monotonic()
    log.info("Running POTD check")

    try:
        partner = _get_todays_partner()
        potd = _get_potd_message()

        partner_str = f"the {partner} " if partner else ""

        if potd:
            msg = f"<@{ASIAD_USER_ID}> the {partner_str}play of the day was posted today ✓"
            detail = f"posted | partner={partner or 'unknown'}"
            # _cross_post(potd)  # disabled — re-enable once posting format is finalized
        else:
            msg = f"<@{ASIAD_USER_ID}> the {partner_str}play of the day was not posted for today"
            detail = f"not posted | partner={partner or 'unknown'}"

        log.info(f"POTD check result: {msg}")
        _send_discord_message(msg)
        log_schedule_run("potd_check", "OK", detail, time.monotonic() - t)
    except Exception as e:
        log.error(f"potd_check failed: {e}")
        log_schedule_run("potd_check", "FAILED", str(e)[:80], time.monotonic() - t)
