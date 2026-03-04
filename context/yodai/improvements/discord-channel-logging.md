# Discord Channel Logging Improvement

## Problem
Currently, YodAI maintains conversation logs for Telegram interactions but not for Discord conversations. This creates an asymmetry — past context can be retrieved from Telegram but not from Discord, making it harder to reference previous discussions or maintain continuity across sessions.

## Solution
Implement structured logging for the primary Discord text channel (1477573766623002676) that mirrors the Telegram logging structure. Each message should be timestamped, attributed to the user/bot, and stored in a format that allows retrieval via `load_past_context`.

## What Needs to Happen
1. **Capture mechanism** — Log each message sent to/from the channel with:
   - Timestamp (ISO 8601, converted to EST)
   - Sender (username or bot identifier)
   - Message content (full text)
   - Message ID (for reference/threading)

2. **Storage format** — Match Telegram log structure:
   ```
   [YYYY-MM-DD] HH:MM AM/PM EST — Message summary or content
   ```

3. **Retrieval integration** — Make logs accessible via `load_past_context` with topic `discord` so past Discord conversations can be pulled for context

4. **Scope** — Start with channel 1477573766623002676 (primary channel); extend to other mapped channels once channel mapping is complete

## Dependencies
- Discord channel mapping (`discord-channel-mapping.md`) should be completed first so we know which channels to log
- Message source detection improvement may be relevant for attribution

## Questions to Resolve
1. Should we log all Discord messages in the channel, or only messages directed at/involving YodAI?
2. How far back should historical logs go (retroactive backfill or start fresh)?
3. Should reactions and other Discord interactions be logged, or just text messages?
4. Storage location — where should logs live (file in repo, database, separate logging service)?

## Next Steps
Clarify the above questions, then implement the logging mechanism.
