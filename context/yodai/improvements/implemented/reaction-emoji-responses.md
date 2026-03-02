# Reaction Emoji Responses

## Problem
YodAI currently closes interactions with unnecessary closing lines like "Let me know when you need something." This adds filler and noise to conversations that should be direct and minimal.

## Solution
Use emoji reactions directly on messages instead of sending text, for:
- Simple acknowledgments
- Confirmations that require no follow-up
- Any response where a reaction is sufficient

## Blocker
YodAI does not currently have a Discord reaction API function. See `discord-reaction-api.md` for the feature request. Until that is available, avoid sending unnecessary closing text entirely.

## Examples
- User: "No not now" → React with ✅ (no text message)
- User: "Okay" → React with 👍 (no text message)

## Note
Substantive responses (e.g. after creating a file, running a query, completing a task) still require a proper text reply summarizing what was done.
