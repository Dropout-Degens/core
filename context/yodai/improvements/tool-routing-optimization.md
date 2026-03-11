# Keyword-Based Tool Routing (Token Optimization)

## Problem

Every API call to Claude sends all tool definitions — across all connections (GitHub, Supabase, Discord, Google, Todoist, Finances, Telegram, Twitter, Instagram, Memory). This adds ~6k tokens of input on every single message, regardless of whether those tools are relevant.

At Haiku pricing ($0.80/MTok input), this is wasteful — a simple "what's on my calendar today" still pays for Supabase, Todoist, Discord, and Twitter tool definitions being sent.

## Solution: Option A — Keyword-Based Routing

Build a `_select_tools(message: str) -> list` function in `bot.py` that:

1. Scans the incoming user message for keywords
2. Returns only the relevant tool definitions for that message
3. Always includes a small baseline set (e.g. memory tools) on every call

### Keyword map (draft)

| Keywords | Tools included |
|---|---|
| supabase, query, database, table, schema, sql, select, insert, user, member, bet, ticket | Supabase |
| calendar, event, schedule, meeting, reminder, tomorrow, today, week | Google Calendar |
| email, gmail, inbox, draft, send, reply | Gmail |
| github, repo, file, branch, commit, context, improvement, voice note | GitHub |
| discord, channel, message, server, post | Discord |
| todoist, task, todo, project, due, deadline | Todoist |
| finances, fina, account, transaction, balance, spend | Finances |
| tweet, twitter, post | Twitter |
| instagram, ig, post, story | Instagram |
| telegram, react, message, send | Telegram |
| (no match / fallback) | Memory + Telegram only |

### Always-included baseline
- `memory` tools (load_past_context, search_past_sessions) — needed on almost every call
- `telegram` tools (react_to_message) — needed for reactions on every message

## Implementation

In `bot.py`, replace the flat `ALL_TOOLS` list passed to every `client.messages.create()` call with a dynamic call to `_select_tools(user_message)`.

`ALL_TOOLS` stays as-is for reference and for routing in `handle_tool()` — only the tools passed to the API change.

### Fallback behavior
If no keywords match, send only the baseline (memory + telegram). Claude can still ask the user to clarify, and the next turn will match keywords and load the right tools.

### Multi-topic messages
If keywords from multiple topics match (e.g. "add a calendar event and create a Todoist task"), include tools for all matched topics.

## Expected impact

- Typical message: 6k → ~1–2k input tokens for tool definitions
- Estimated savings: 50–70% reduction in tool definition token cost
- No change to Claude's capabilities — tools are still available, just not sent when irrelevant

## Files to change

- `bot.py` — add `_select_tools()`, update `run_agent()` to call it
- `CLAUDE.md` — document the routing behavior

## Open questions

- Should we log which tools were selected per turn? (useful for debugging)
- Should voice messages get a broader tool set by default?
