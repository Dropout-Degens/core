# Discord Channel Mapping Improvement

## Problem
Currently, YodAI only has access to one hardcoded Discord channel ID (1477573766623002676). When asked to check Discord activity (like "who's the last user who joined"), I have no way to:
- Know which channel to check without asking
- Access member-log or audit channels
- Distinguish between different types of channels (chat, member-logs, etc.)

## Solution
Create a channel mapping document that lives in `connections/discord/README.md` with a structured list of channel IDs and their purposes. This lets me know at a glance which channel to query based on the request.

## What We Need to Map
- **Chat channels** — general, announcements, etc. (for reading messages)
- **Member-log channels** — join/leave events (for membership questions)
- **Alert channels** — alerts, notifications, bots (for system messages)
- Any other Discord channels relevant to DD operations

## Format (proposed)
```yaml
channels:
  general-chat:
    id: 1477573766623002676
    purpose: Main chat channel
  member-logs:
    id: [TO BE PROVIDED]
    purpose: User join/leave events
  alerts:
    id: [TO BE PROVIDED]
    purpose: Bot alerts and notifications
```

## Next Step
Owner provides the channel IDs and their purposes, then we build out the mapping in the connections folder.
