# Call Transcript Storage Structure

## Problem
Call transcripts from Discord and Telegram are currently stored inconsistently without a clear organizational structure.

## Solution
Implement standardized folder structure for all call transcripts (Discord and Telegram):

```
calls/
  discord/
    {YYYY-MM-DD-HHMM}/
      transcript.txt
      [other related documents]
  telegram/
    {YYYY-MM-DD-HHMM}/
      transcript.txt
      [other related documents]
```

## Naming Convention
- **Folder name:** `{YYYY-MM-DD-HHMM}` (date and time of call start)
  - Example: `2026-03-04-1430` (March 4, 2026 at 2:30 PM EST)
- **Transcript file:** Always named `transcript.txt` (plain text)
- **Other documents:** Any supporting files (analysis, notes, follow-ups, etc.)

## File Structure Example

```
calls/discord/2026-03-04-1430/
├── transcript.txt
├── analysis.md
└── follow-up-tasks.md

calls/telegram/2026-03-04-0915/
├── transcript.txt
└── notes.md
```

## Implementation
1. Create `calls/` folder in `context/yodai/` if it doesn't exist
2. Create `discord/` and `telegram/` subfolders
3. When transcribing any call: create timestamped folder and store `transcript.txt` inside
4. Add any related analysis/notes in the same folder

## Status
Ready for implementation
