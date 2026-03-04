# Improvement: Voice Note Transcript Capture

**Type:** Process improvement  
**Date:** March 3, 2026  
**Status:** Recommended for implementation  
**Priority:** High

---

## Problem

When processing voice notes that result in document creation (brainstorms, ideas, thoughts, calls), I'm currently saving only the processed output files (brief + transcript for brainstorms/ideas, or framework + metrics for projects). 

I'm **not automatically capturing a consolidated transcript file** of all voice notes in the session, which means:

1. The raw transcripts aren't persisted to the repo
2. If voice notes need to be reviewed later, there's no single reference file
3. Session context is only in the processed docs, not the raw input

---

## Solution

**Add a third file to all voice note output:** A `transcript.txt` file that captures all voice note transcripts in the session.

### For Brainstorms / Ideas / Thoughts:

When creating the brief + transcript markdown files, also create:

**File:** `context/yodai/voice-notes/{type}/{YYYY-MM-DD}-{slug}-transcript.txt`

**Content:**
```
{TYPE}: {TITLE}
Date: {YYYY-MM-DD}
Session duration: {if known}

---

TRANSCRIPT 1 (if multiple notes)
[timestamp if available]

{full transcript verbatim}

---

TRANSCRIPT 2
[timestamp if available]

{full transcript verbatim}

---

[repeat for all transcripts in session]

END OF TRANSCRIPTS
```

### For Calls (Discord / Telegram):

When creating framework + metrics docs, also create:

**File:** `context/yodai/calls/{platform}/{YYYY-MM-DD}-{topic}-transcript.txt`

**Content:** All voice note transcripts from the call session, in reverse chronological order (most recent first), clearly labeled.

---

## Updated Workflow

**Current:** 2 files per voice note session  
**New:** 3 files per voice note session

| File Type | Purpose | Current | New |
|-----------|---------|---------|-----|
| Brief | Summary + key points | ✅ | ✅ |
| Transcript (MD) | Clarifying Q&A format | ✅ | ✅ |
| Transcript (TXT) | Raw transcript capture | ❌ | ✅ |

---

## Implementation

Before creating any output files for a voice note session:

1. Collect all transcripts from the session (chronologically)
2. Create the primary output docs (brief, framework, metrics, etc.)
3. **Create `transcript.txt`** with all raw transcripts
4. Commit all files to the daily branch together

**Key rule:** If multiple voice notes in a session, all transcripts go in one `.txt` file, not separate files.

---

## Example: Today's Session

**Files created:**
- ✅ `welcome-ticket-personalization-framework.md`
- ✅ `welcome-ticket-success-metrics.md`
- ✅ `transcript.txt` (all 4 voice notes, reversed)

All 3 saved together to `context/yodai/calls/telegram/` on `yodai/2026-03-03` branch.

---

## Why This Matters

1. **Traceability** — original voice notes are always available in the repo
2. **Audit trail** — if we need to revisit the conversation, it's there
3. **Context preservation** — the raw thinking is captured, not just the processed output
4. **Consistency** — same capture methodology across all voice note types

---

*Recommendation: Implement immediately. No breaking changes — just adds a third file to existing workflows.*
