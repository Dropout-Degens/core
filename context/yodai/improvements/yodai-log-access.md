# YodAI Log Access & System Prompt Integration

**Status:** Open  
**Date Created:** 2026-03-05  
**Priority:** High  
**Owner:** Zack (system access), YodAI (integration)

## Problem

Currently, I have **no access to my own logs**. This means:
- Can't audit what I've queried or how I've spent API tokens
- Can't see conversation history across sessions (don't know if context is fresh or stale)
- Can't identify patterns in what I do (which tools I overuse, which I should use more)
- Can't self-correct based on past behavior
- Can't help with the **Supabase Query Templates** improvement (don't know recent queries)
- Can't implement **Outcome Feedback Loop** (don't see what happened with prior tasks)

## Solution

**Give YodAI read access to its own logs**, both:
1. **System logs** (API calls, tool usage, token spend)
2. **Conversation logs** (previous messages in this thread and others)

Then update system prompt so I know where to find them and when to check.

## What Needs to Happen

### 1. Identify Log Storage Location

**Questions to answer:**
- Where are logs actually stored? (local filesystem? Supabase? external logging service?)
- What logs exist?
  - Tool call history (function invocations, parameters, results)
  - API usage (tokens spent, endpoints called)
  - Conversation history (user messages, my responses)
  - Error logs (failures, timeouts, exceptions)
  - Session metadata (timestamps, duration, branch/context)

- Format? (JSON? CSV? plaintext? structured?)
- Current retention? (how far back do we keep them?)
- Access method? (file path? database query? API endpoint?)

### 2. Grant Read Access

**In system:**
- Can I read local logs via file system?
- Or do I need a database query function (e.g., `query_logs()` tool)?
- Permissions: read-only to all logs, no write/delete

### 3. Create Tool/Function for Log Access

**Option A: Direct File System**
```
If logs stored in /var/log/yodai/ or similar, create function:
query_yodai_logs(log_type, filters) → returns structured data
```

**Option B: Database Query**
```
If logs in Supabase (new table or existing):
SELECT * FROM private."yodai_logs" WHERE timestamp > now() - interval '30 days'
```

**Option C: Both**
```
Hybrid: file system for recent (last 24h), database for historical (30+ days)
```

### 4. Update System Prompt

Add to my instructions:

```
## Log Access & Self-Awareness

You have read-only access to your own logs to improve over time.

**Available log queries:**
- recent_queries() → Last 20 Supabase queries executed (useful for templates)
- tool_usage() → Which tools I use most (helps prioritize)
- token_usage() → Tokens spent today/this week (cost tracking)
- conversation_history(days_back) → Previous messages in this conversation and related threads
- error_log() → Failures and exceptions (helps me avoid repeat mistakes)

**When to use them:**
- Before building templates: check recent_queries() to see actual patterns
- Before recommending: check conversation_history() to avoid repeating myself
- During recap: review token_usage() for cost summary
- If something fails: check error_log() to see if it's a known issue
- Proactively: monthly review of tool usage to spot inefficiencies

**Important:**
- Logs are source of truth for what I actually did (vs. what I remember)
- Use them to self-correct and improve
- Reference log data in responses when relevant (shows I'm actually learning)
- Privacy: these logs are mine to track my own behavior; treat them as private
```

### 5. Define Log Retention & Cleanup

**Questions:**
- How long to keep logs? (90 days? indefinite?)
- Auto-cleanup or manual?
- Archive old logs or delete?

**Recommendation:**
- Keep last 90 days live
- Archive to GitHub (`context/yodai/logs/archive/`) monthly for long-term reference
- Let me query both live and archived logs

## Related to This

This unblocks:
- **Supabase Query Templates** (I can see actual recent queries to template)
- **Outcome Feedback Loop** (can track what happened with prior tasks)
- **Session Awareness** (know if context is fresh or if I should re-read)

## Implementation Checklist

- [ ] Identify log storage location and format
- [ ] Document what logs exist and their structure
- [ ] Determine access method (file, database, API)
- [ ] Set up read-only permissions
- [ ] Create query function(s) for log access
- [ ] Update system prompt with log usage guidelines
- [ ] Test log queries (can I read recent queries? tool usage?)
- [ ] Define retention policy
- [ ] Create archival process (if needed)
- [ ] Document where logs live in README

## Success Signal

- Can run `recent_queries()` and see last 20 Supabase queries
- Can run `conversation_history(7)` and see all messages from last week
- Can run `token_usage()` and report daily spend
- Use logs proactively in responses (e.g., "checked logs, last similar query was...")
- Can audit own behavior and spot patterns

## Next Steps

1. **Immediate:** Figure out where logs live and how to access them
2. **Short-term:** Create query functions
3. **Update system prompt** with log access guidelines
4. **Test** with manual log queries
5. **Integrate** into daily workflows (recap, template building, etc.)
