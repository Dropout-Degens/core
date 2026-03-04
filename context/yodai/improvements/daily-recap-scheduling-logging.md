# Daily Recap Scheduling Logging Improvement

## Problem
The daily recap scheduling process lacks visibility into success/failure events. When recaps don't send or fail silently, there's no log trail to diagnose what went wrong — making it hard to debug timing issues or missed runs.

## Solution
Implement structured logging for all daily recap scheduling interactions, capturing both successes and failures with timestamps and error details.

## What Needs to Happen
1. **Log capture** — Record each scheduling event:
   - Recap trigger time (scheduled vs. actual execution)
   - Branch merge status (success/fail)
   - Message post status (success/fail)
   - Any errors encountered (with stack trace if applicable)
   - Duration of the recap process

2. **Log format** — Timestamp + status + details:
   ```
   [YYYY-MM-DD HH:MM:SS EST] RECAP_SCHEDULED | triggered at 11:30 PM
   [YYYY-MM-DD HH:MM:SS EST] BRANCH_MERGED | yodai/2026-03-03 → main (success)
   [YYYY-MM-DD HH:MM:SS EST] MESSAGE_POSTED | Discord recap posted (message_id: xxx)
   [YYYY-MM-DD HH:MM:SS EST] RECAP_FAILED | merge conflict on yodai/2026-03-03 (error details)
   ```

3. **Storage** — Log location TBD (file in repo, database, or separate logging service)

4. **Retrieval** — Make logs accessible for debugging past recap runs

## Dependencies
- Recap automation process itself (where the scheduling logic lives)

## Questions to Resolve
1. Where should recap logs be stored (in-repo file, external logging service, database)?
2. Should logs be human-readable plaintext or structured JSON?
3. How long should logs be retained?
4. Should failed recaps trigger an alert/notification?

## Next Steps
Define log storage location and format, then instrument the recap automation.
