# YoDai Daily Branch + Recap System

## Overview
Two-part improvement to YoDai workflow: (1) voice-note files commit to daily branches instead of main, and (2) automated daily recap message at 11:30 PM ET.

---

## Part 1: Daily Branch Commits

**Change:** When YoDai creates voice-note transcript and brief files in `context/yodai/voice-notes/`, commit them to a daily branch instead of main.

**Branch pattern:** `yodai/{YYYY-MM-DD}`

**Behavior:**
- Each day gets its own branch
- All voice-note files created that day commit to that branch
- Branch is created if it doesn't exist; reused if it does
- Allows batching and review before merging to main

**Prompting update needed:**
- Remove "All commits go directly to main" from voice-note workflow
- Replace with: "Commit to daily branch using pattern `yodai/{YYYY-MM-DD}`"

---

## Part 2: Daily Recap Message

**Change:** At 11:30 PM ET every night, send a recap message between you and YoDai listing all files created that day.

**Message format:**
- Simple list of file titles from that day's branch
- Includes files even if the list is empty that day
- Starts foundation for expanded recap content in future

**Trigger:** Hard 11:30 PM ET nightly (runs regardless of activity that day)

**Output example:**
```
📋 YoDai Daily Recap — March 1
- Voice note: "Improvement brainstorm - daily branch system"
- Transcript: 2026-03-01-yodai-daily-branch-recap-transcript.md
- Brief: 2026-03-01-yodai-daily-branch-recap-brief.md
```

---

## Next Steps
1. Implement branch creation logic in voice-note file workflow
2. Set up 11:30 PM ET scheduled recap message
3. Test with next voice note creation
