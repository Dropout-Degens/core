# YodAI Folder README Improvement

## Problem
The current `context/yodai/CLAUDE.md` (README) is incomplete and doesn't document the folder structure, file organization, or purpose of each subfolder. New context added to the repo is unclear to navigate.

## Solution
Create a comprehensive README that documents:
1. YodAI folder structure and purpose
2. What goes in each subfolder
3. File naming conventions
4. How to navigate and use the context

## Proposed README Structure

```markdown
# YodAI Context Directory

Central repository for YodAI system documentation, improvements, and call transcripts.

## Folder Structure

### `/improvements`
Tracks all YodAI enhancements and feature improvements.

- **Active improvements:** Features in development or planning
- **`/implemented`:** Completed and merged improvements
- Each file documents one improvement with status, dependencies, and implementation details

### `/voice-notes`
Transcripts and notes from voice interactions, organized by type.

- **`/brainstorms`:** Unstructured ideas and explorations
  - Format: `{YYYY-MM-DD}-{slug}-transcript.md` and `{YYYY-MM-DD}-{slug}-brief.md`
- **`/ideas`:** Focused concepts with clear structure
  - Format: `{YYYY-MM-DD}-{slug}-transcript.md` and `{YYYY-MM-DD}-{slug}-brief.md`
- **`/thoughts`:** Reflections, analysis, and observations
  - Format: `{YYYY-MM-DD}-{slug}-transcript.md` and `{YYYY-MM-DD}-{slug}-brief.md`

### `/calls`
Recorded and transcribed calls from Discord and Telegram.

- **`/discord`:** Discord call transcripts
- **`/telegram`:** Telegram call transcripts
- Each call stored in timestamped folder: `{YYYY-MM-DD-HHMM}/`
- Contains `transcript.txt` and any supporting documents

### `/alg-research`
Algorithm research, analysis, and findings documentation.

## File Naming Conventions

**Voice Notes:**
- Transcript: `{YYYY-MM-DD}-{slug}-transcript.md`
- Brief: `{YYYY-MM-DD}-{slug}-brief.md`
- Example: `2026-03-04-daily-alert-processing-transcript.md`

**Calls:**
- Folder: `{YYYY-MM-DD-HHMM}` (date and time of call start)
- Transcript: Always `transcript.txt`
- Example: `calls/discord/2026-03-04-1430/transcript.txt`

**Improvements:**
- Format: `{improvement-name}.md` (kebab-case)
- Example: `discord-member-message-handling.md`

## Navigation Guide

**To find a brainstorm from March 3:**
→ `context/yodai/voice-notes/brainstorms/2026-03-03-{slug}-brief.md`

**To find a Discord call transcript:**
→ `context/yodai/calls/discord/{YYYY-MM-DD-HHMM}/transcript.txt`

**To check an improvement status:**
→ `context/yodai/improvements/{improvement-name}.md`

## Branch Strategy

- Voice notes and improvements → commit to daily branch `yodai/{YYYY-MM-DD}`
- Merged to main at end of day during recap
- Completed improvements move to `improvements/implemented/`

```

## Implementation Notes

1. Replace current `CLAUDE.md` with new comprehensive README
2. Keep it updated as new conventions are added
3. Link from main repo README if needed

## Status
Ready for implementation
