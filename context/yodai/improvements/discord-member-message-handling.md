# Discord Member Message Handling Improvement

## Problem
Currently, YodAI only responds to/processes messages from a specific user (340076015797796864, the owner). This limits functionality for other team members who want to interact with YodAI in Discord channels.

## Solution
Implement a system that allows messages from other Discord members, but with configurable rules and permission levels:

## Permission Levels & Rules

### Owner (340076015797796864)
- Full access to all YodAI commands and functions
- Can trigger any operation
- No rate limits or restrictions

### Authorized Members
- Can send messages to YodAI
- Restricted command set (to be defined)
- Rate limits apply
- Certain sensitive operations require owner approval

### All Other Members
- Can mention/tag YodAI
- Limited response capability (greeting, info only)
- Cannot trigger operations or data queries
- Read-only access to certain info

## Implementation Questions

1. **How many authorization tiers?** (owner, moderators, members, public?)
2. **Which commands should each tier have access to?**
3. **Rate limiting** — should we limit how often non-owners can call YodAI?
4. **Audit trail** — should we log all member interactions?
5. **Approval workflow** — do sensitive operations (data queries, etc.) need owner approval?
6. **Member whitelist** — hardcoded list, role-based, or both?

## Dependencies
- Message source detection (`message-source-detection.md`) — to identify sender
- Discord channel mapping (`discord-channel-mapping.md`) — to know which channels to monitor

## Next Steps
1. Define which members/roles should have access
2. Decide on command restrictions per tier
3. Create permission configuration
4. Implement message handling with permission checks
5. Set up audit logging

## Status
Ready for design discussion
