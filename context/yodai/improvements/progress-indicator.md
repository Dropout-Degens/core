# Progress Indicator for Long Tasks

## Problem
When YodAI runs a complex multi-step task (multiple tool calls, Supabase queries, file writes), the user sees nothing. No indication of what is happening or how long it will take. Feels like the bot is stuck or broken.

## When to trigger
Only activate this for tasks where a plan clearly needs to be established first — multi-step work that requires sequencing. NOT for:
- Simple questions or lookups (single tool call)
- Short conversational replies
- Quick reads (e.g. "what is on my calendar")

Trigger when the task clearly requires 3+ steps or multiple tool calls to complete.

## Solution

1. **Post a plan first** — before starting the work, send a message outlining the steps:
   e.g. "Plan:
1. Read Supabase schema
2. Query EVAlertEvent
3. Cross-reference EVActualStat
4. Summarize findings"

2. **Progress updates every 5 seconds** — while working, send an updated progress message every 5 seconds:
   Updating the same message if possible, or sending a new one.
   Format: current step + simple bar
   e.g. "Step 2/4 — querying Supabase |====------| 40%"
        "Step 3/4 — cross-referencing stats |========--| 75%"

3. **Time estimate** — include a rough estimate in the plan message based on number of steps

## Implementation Notes
- Trigger condition: task requires 3+ tool calls or explicit multi-step sequencing
- Progress ticker runs on a background thread, sends update every 5 seconds via Telegram
- Needs chat_id passed into the agent loop so the ticker can send independently
- Stop ticker when agent reaches end_turn
- Keep messages short — one line each
