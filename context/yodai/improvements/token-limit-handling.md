# Token Limit Handling

## Problem
When a conversation runs long (complex agentic tasks, lots of tool calls), the history hits the 200k token limit and every subsequent message errors:

The user loses context with no warning and no graceful recovery path.

## Solution
1. **Proactive summarization** — when history approaches ~170k tokens, automatically summarize the conversation so far into a condensed context block, replace the full history with the summary + last few messages, and notify the user
2. **Graceful error catch** — if the 400 token error is hit, catch it, auto-summarize what's in history, clear the raw history, re-inject the summary, and retry the message — instead of surfacing a raw error
3. **User notification** — tell the user when this happens: "Context was getting long — I've summarized and compressed it. Continuing..."

## Implementation Notes
- Track token count per turn (response usage object has input_tokens)
- Threshold: trigger summarization at ~170k input tokens
- Summary prompt: ask Claude to summarize the conversation into key findings, decisions, and open threads
- Inject summary as a system message or early user/assistant pair in the new history
