# Discord Reaction API

## Problem
YodAI needs to respond with reaction emojis to messages instead of sending text, but currently only has `send_discord_message` available. This creates unnecessary text pollution in chat.

## Solution
Add a Discord reaction function that allows YodAI to:
- Add emoji reactions directly to messages
- Use reactions for acknowledgments instead of text responses
- Keep conversations clean and direct

## Function Needed
```
send_discord_reaction(message_id, emoji)
```

Parameters:
- `message_id` — the Discord message ID to react to
- `emoji` — the emoji to add (e.g. "✅", "👍")

## Use Cases
- Acknowledge commands or requests without text clutter
- Confirm file creation, database updates, etc.
- Keep YodAI voice sharp and minimal

## Implementation
Add this to the Discord tools available to YodAI.
