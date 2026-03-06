# Full Chat Transcript Local Storage

**Status:** Open  
**Date Created:** 2026-03-05  
**Priority:** High  
**Owner:** Zack (implementation), YodAI (integration)

## Problem

Right now, logs only capture partial data. Missing entirely:
- **Verbatim user messages** (what you actually said, exactly)
- **Verbatim bot responses** (what I actually said, exactly)
- **Bot prompts sent to tools** (what I passed to each tool function — the exact parameters)
- **Tool call usages** (which tools were called, in what order, with what inputs, what the outputs were)

This matters because:
- No audit trail of what actually happened in a session
- Can't debug why I made a bad call (what did I actually receive/send?)
- Can't build better context awareness (was this question already asked before?)
- Can't self-improve without seeing the full picture
- Can't detect context switching issues (new question in long thread vs. continuation)
- Automated context self-update has nothing rich to read from

## Context Switching Problem

Since all messages live in one thread, I don't always know:
- Is this a new topic that needs fresh context?
- Is this a continuation of something from 2 hours ago?
- Did I already answer a version of this question?
- Should I go back and re-read earlier context in this thread?

With full transcripts stored locally, I can:
1. Check if the current question is related to something prior
2. Pull relevant context from earlier in the conversation
3. Know when to treat something as a fresh start vs. continuation
4. Avoid repeating myself or contradicting my own earlier responses

## Solution

Store **complete session transcripts** locally, covering all four data types:

### 1. User Messages (verbatim)
- Every message, exactly as typed/sent
- Include: timestamp, message source (Telegram/Discord/other), message ID
- No editing, no paraphrasing, no "cleaned up" versions
- Include typos, formatting, line breaks exactly as sent

### 2. Bot Responses (verbatim)
- Every response I sent, exactly as delivered
- Include: timestamp, which message it was in reply to
- Full text including markdown, code blocks, lists — exactly as formatted

### 3. Bot Prompts to Tools
- Every time I call a tool, log the exact parameters I passed
- Include: tool name, full parameter payload (JSON), timestamp
- This captures my reasoning process (what I decided to query/do)
- Example:
```json
{
  "tool": "query_private",
  "timestamp": "2026-03-05T03:38:00Z",
  "parameters": {
    "sql": "SELECT COUNT(*) FROM private.\"users\" WHERE created_at > now() - interval '7 days'"
  }
}
```

### 4. Tool Call Outputs
- The full response returned by every tool
- Include: tool name, response payload (JSON/text), timestamp, success/error status
- Truncate if extremely large (e.g., database results over 10k rows) but log the truncation
- Example:
```json
{
  "tool": "query_private",
  "timestamp": "2026-03-05T03:38:02Z",
  "status": "success",
  "response": {
    "rows": [{"count": 42}]
  }
}
```

## Storage Format

### File Location
```
logs/
  sessions/
    {YYYY-MM-DD}/
      {HH-MM-SS}-session-{id}.json       ← full session transcript
      {HH-MM-SS}-session-{id}-tools.json ← tool calls + outputs
  archive/
    {YYYY-MM}/
      [archived monthly sessions]
```

### Session File Format
```json
{
  "session_id": "uuid",
  "date": "2026-03-05",
  "started_at": "2026-03-05T03:38:00Z",
  "ended_at": "2026-03-05T05:12:00Z",
  "source": "telegram",
  "messages": [
    {
      "id": "msg_001",
      "timestamp": "2026-03-05T03:38:00Z",
      "role": "user",
      "content": "exact verbatim message here",
      "source": "telegram"
    },
    {
      "id": "msg_002",
      "timestamp": "2026-03-05T03:38:05Z",
      "role": "assistant",
      "content": "exact verbatim response here",
      "in_reply_to": "msg_001"
    }
  ]
}
```

### Tool Call File Format
```json
{
  "session_id": "uuid",
  "tool_calls": [
    {
      "id": "call_001",
      "message_id": "msg_002",
      "timestamp": "2026-03-05T03:38:03Z",
      "tool": "query_private",
      "parameters": { "sql": "..." },
      "response": { "rows": [...] },
      "status": "success",
      "duration_ms": 243
    }
  ]
}
```

## How I'd Use This

### Context Switching Awareness
Before responding to a new message, I can:
1. Check if it relates to earlier in the thread
2. Pull relevant prior context automatically
3. Know if I already gave this answer (avoid repeating)
4. Understand thread continuity (continuation vs. new topic)

**System prompt addition:**
```
## Context Awareness
Before responding, check if the current message relates to earlier in the session.
If yes: reference and build on it.
If no: treat as fresh context but note the shift.
If unsure: ask one clarifying question.
```

### Automated Context Self-Update
At 11:30 PM recap, instead of just reading branch files, I can:
- Read the full day's session transcripts
- Extract actual patterns from real conversations
- See exactly what tools I called and why
- Build better context from the full picture, not just summaries

### Debugging & Self-Improvement
When something goes wrong:
- Check exact tool parameters I sent (was it a bad query?)
- Check the response I received (was the data wrong?)
- Check my response (did I misread the data?)
- Pinpoint exactly where the error happened

### Query Templates (Supabase)
Instead of guessing what queries to template:
- Read tool call logs from last 30 days
- Extract all SQL from `query_private`, `query_manual`, `query_personal` calls
- Identify duplicates and near-duplicates automatically
- Auto-generate template candidates

## Implementation Checklist

- [ ] Define log storage location (local filesystem path)
- [ ] Design session file schema (finalize JSON structure)
- [ ] Implement user message capture (verbatim, with metadata)
- [ ] Implement bot response capture (verbatim, with metadata)
- [ ] Implement tool call parameter logging
- [ ] Implement tool call output logging
- [ ] Handle large outputs (truncation strategy)
- [ ] Handle errors (log failed calls with error detail)
- [ ] Create log reader function for YodAI access
- [ ] Update system prompt with context awareness rules
- [ ] Define retention policy (90 days live? indefinite?)
- [ ] Create monthly archival process
- [ ] Test end-to-end (message in → full session logged)
- [ ] Test context switching awareness (does referencing logs help?)

## Related Improvements

- **YodAI Log Access** — gives me read permissions to these logs
- **Automated Context Self-Update** — reads these transcripts at recap
- **Supabase Query Templates** — generated from tool call logs
- **Verbatim Transcript Storage** — existing improvement (narrower scope, this supersedes it)
- **Daily Recap Expansion** — recap can summarize transcript stats (messages, tool calls, tokens)

## Success Signal

- Every session has a complete, queryable transcript
- Context switching issues are rare (I know what happened earlier)
- Supabase templates built from actual query history (not guesses)
- Can audit any session from the past 90 days in full detail
- Automated context self-update has rich data to extract from
- At recap: I can report exact tool usage, query count, session length
