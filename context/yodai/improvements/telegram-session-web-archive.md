# Improvement: Telegram Session Web Archive
**Status:** Open  
**Date:** March 17, 2026  
**Category:** Web app feature  

---

## Problem

Telegram sessions (voice notes, conversations, decisions) are currently only viewable in Telegram. Once they scroll out of the active feed, they're effectively lost — no persistent view, no searchability, no way to review or organize them. This means:

- Can't reference past sessions without digging through Telegram
- No unified view across all input types (Telegram, Discord, voice notes, calendar context)
- Sessions are orphaned data — stored but inaccessible
- Can't tag, archive, or curate which sessions to keep long-term

---

## Solution

Create a **Telegram Session Archive** in the web app that:

1. **Displays all stored Telegram sessions** (already in the consolidated log) in a unified view
2. **Allows filtering/search** by date, keyword, topic
3. **Lets you tag sessions** (e.g., "keep", "archive", "discard", custom tags)
4. **Supports bulk actions** (delete tagged sessions, export, etc.)
5. **Integrates with existing session data** (no new storage needed — just read from the log)

---

## What This Enables

- **Session hygiene:** Review past Telegram conversations, keep what matters, remove noise
- **Searchability:** Find past decisions without digging through Telegram
- **Permanence:** Sessions survive Telegram scroll-out once they're tagged for keeping
- **Context:** View Telegram sessions alongside other logs (Discord, calendar, etc.)
- **Removal option:** Stop using Telegram as the live interface if desired — all historical data is already in the web app

---

## Implementation Details

### Data Source
- Sessions are already logged and stored (same consolidated log as Discord, calendar, etc.)
- No new database schema needed
- Just needs a read query to surface them in the UI

### Web App UI Components

**Session List View:**
- Table or card layout showing:
  - Date (sortable)
  - Preview text (first 100 chars)
  - Tags (if applied)
  - Actions (tag, delete, view full)
- Filter sidebar:
  - Date range picker
  - Keyword search
  - Tag filter
  - Session type filter (if logged with type labels)

**Session Detail View:**
- Full session transcript
- Timestamps
- Tag editor (add/remove tags)
- Delete button
- Export option (copy to clipboard, download as text)

**Bulk Actions:**
- Select multiple sessions
- Apply tag to all selected
- Delete all selected
- Export all selected

### Backend Requirements
- **Read endpoint:** `/api/sessions?filters={}` 
  - Returns paginated sessions from the log
  - Supports filtering by date, keyword, tags
- **Tag endpoint:** `PATCH /api/sessions/:id` to add/remove tags
- **Delete endpoint:** `DELETE /api/sessions/:id` (soft delete recommended)

### UX Flow

1. User opens "Session Archive" in web app
2. Sees list of all Telegram sessions (newest first)
3. Scrolls, searches, or filters to find sessions
4. Clicks on a session to view full text
5. Tags it ("keep", "archive", "project-x", etc.) or deletes it
6. Bulk actions available for quick cleanup

---

## Why This Works

- **No new storage** — everything is already logged, just needs UI
- **Low complexity** — mostly read operations, minimal write logic
- **Flexible** — can extend with more tagging, grouping, or export options later
- **Permanence** — solves the "Telegram scroll-out" problem without changing the Telegram workflow
- **Optional Telegram removal** — once this exists, you have the option to stop using Telegram as the interface entirely

---

## Next Steps

1. Confirm the session log query structure (what fields are available, how to filter)
2. Design the UI mockup (or use minimal/functional first version)
3. Build the read endpoint (`GET /api/sessions`)
4. Build the tag endpoint (`PATCH /api/sessions/:id`)
5. Build the UI component
6. Test with real session data
7. Optional: soft-delete vs hard-delete decision

---

*Created: March 17, 2026*
