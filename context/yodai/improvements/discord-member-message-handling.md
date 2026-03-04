# Discord Member Message Handling Improvement

## Problem
Currently, YodAI only responds to/processes messages from a specific user (340076015797796864, the owner). This limits functionality for other team members who want to interact with YodAI in Discord channels.

## Solution
Implement a system that allows messages from other Discord members, but with configurable rules and permission levels:

## Permission Levels & Rules

### Owner (340076015797796864)
- Full access to all YodAI commands and functions
- Can trigger any operation
- Can read and write to Supabase
- Can read and write to GitHub
- No rate limits or restrictions

### Authorized Members (JP + specified team members)
- Can query Supabase (read-only)
- Can read GitHub files and list directories
- **Cannot** write/edit GitHub files
- **Cannot** write to Supabase
- **Cannot** trigger database updates, merges, or file operations
- Rate limits apply
- Can ask questions and get analysis

### All Other Members
- Can mention/tag YodAI
- Limited response capability (greeting, info only)
- Cannot query databases or access GitHub
- Read-only access to general info

## Implementation Details

**Read-only access for authorized members:**
- `query_private` — allowed
- `query_manual` — allowed
- `query_personal` — allowed (read-only)
- `read_github_file` — allowed
- `list_github_directory` — allowed
- `update_github_file` — **blocked**
- `create_github_file` — **blocked**
- `update_manual` — **blocked**
- `merge_github_branch` — **blocked**

## Dependencies
- Message source detection (`message-source-detection.md`) — to identify sender
- Discord channel mapping (`discord-channel-mapping.md`) — to know which channels to monitor

## Next Steps
1. Define exact list of authorized members (JP + others?)
2. Implement permission checks on all tool calls
3. Add audit logging for all member queries
4. Set up rate limiting per member

## Status
Ready for implementation
