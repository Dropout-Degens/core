# Multi-Channel Discord Messaging

**Status:** Open  
**Date:** 2026-03-03  
**Priority:** Medium

## Problem
Currently, `send_discord_message()` is hardcoded to only send to the YodAI channel (1477573766623002676). When needing to post in other channels (like general community channels), there's no way to do it — have to manually copy/paste or ask the user to post manually.

## Solution
Extend `send_discord_message()` to accept an optional `channel_id` parameter:
- **Default behavior:** If no channel_id provided, send to YodAI channel (1477573766623002676)
- **Explicit channel:** If channel_id provided, send to that channel instead
- **Error handling:** Return clear error if channel_id is invalid or bot lacks permissions

## Implementation Details

### Function Signature (Updated)
```
send_discord_message(
  content: string (required),
  channel_id: string (optional, defaults to "1477573766623002676")
)
```

### Example Usage
```python
# Send to YodAI channel (default)
send_discord_message("Hello YodAI channel")

# Send to a specific channel
send_discord_message("Hello general", channel_id="1102256584056385667")
```

### Use Case
This came up when trying to post the EV optimizer explanation in the general betting discussion channel instead of the YodAI ops channel. Having the flexibility to target specific channels while keeping the default behavior safe makes ops posting more flexible.

## Benefits
- Post updates/explanations in relevant community channels without manual copy/paste
- Keep YodAI as default (safe, prevents accidental posts to wrong channel)
- Cleaner workflow for multi-channel updates
- No breaking changes to existing code (default behavior unchanged)

## Risks/Notes
- Bot needs appropriate permissions in target channels (already enforced by Discord)
- If channel_id is invalid, function should fail gracefully with clear error message
- Consider adding a whitelist of allowed channels to prevent accidental posts to restricted areas (optional, can add later)

## Next Steps
1. Update function signature in Discord integration
2. Add channel_id parameter handling
3. Test with valid and invalid channel IDs
4. Update any documentation/examples
