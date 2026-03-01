# Progress Indicator for Long Tasks

## Problem
When YodAI runs a complex multi-step task (multiple tool calls, Supabase queries, file writes), the user sees nothing. No indication of what's happening or how long it will take. Feels like the bot is stuck or broken.

## Solution
For any task that will take more than one tool call:

1. **Post a plan first** — before starting the work, send a message outlining the steps:
   e.g. "Here's my plan:
1. Read Supabase schema
2. Query EVAlertEvent
3. Cross-reference EVActualStat
4. Summarize findings"

2. **Progress updates** — send a Telegram message at each major step with a simple progress bar:
      
3. **Time estimate** — include a rough time estimate in the first progress message based on number of steps

## Implementation Notes
- Trigger when: response.stop_reason == "tool_use" and more than 1 tool call expected
- Progress messages sent via the Telegram bot (need access to update object or chat_id in the agent loop)
- Plan detection: before first API call, have a lightweight pass that outlines steps (or detect from tool call count)
- Keep progress messages short — one line each, edit in place if Telegram allows (or send new)
