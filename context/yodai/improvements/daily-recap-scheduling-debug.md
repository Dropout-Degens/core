# Daily Recap Scheduling Debug Improvement

## Problem
When daily recaps fail to send, there's no systematic way to diagnose why. Issues could be: branch not ready, merge conflicts, network failures, missing content, or timing misses. Without debug tools, troubleshooting is manual and slow.

## Solution
Build debug tooling to diagnose daily recap scheduling issues and surface actionable information about what went wrong.

## What Needs to Happen
1. **Health check tool** — Verify preconditions before recap:
   - Is the branch (`yodai/YYYY-MM-DD`) available?
   - Does it have commits?
   - Are there merge conflicts with main?
   - Is the merge able to complete cleanly?

2. **Execution diagnostics** — During recap run:
   - Track timing at each step (schedule time vs. actual execution)
   - Measure merge duration
   - Measure message post latency
   - Log any API errors or timeouts

3. **Failure recovery** — On failure:
   - Identify the exact failure point (scheduling, merge, post)
   - Capture error message/stack trace
   - Suggest remediation (retry, manual merge, etc.)

4. **Visibility dashboard** (optional) — Quick way to check recap status:
   - Last successful recap timestamp
   - Current branch status
   - Next scheduled recap time

## Dependencies
- Recap scheduling logging (`daily-recap-scheduling-logging.md`) should be in place to provide diagnostic data

## Questions to Resolve
1. Should debug info be exposed in the Discord message, or only in logs?
2. Should failures trigger a retry automatically, or require manual intervention?
3. Should debug tooling be callable manually (e.g., `/debug-recap` command)?

## Next Steps
Implement health checks and execution diagnostics first, then add failure recovery logic.
