# Token Spend by Task Type

**Status:** Open  
**Date Created:** 2026-03-05  
**Priority:** High  
**Owner:** YodAI (implementation), Dax (review)

## Problem

The existing Claude API usage tracking logs total tokens/cost, but provides **no breakdown by task type or tool**. This means:
- Don't know which operations are expensive (querying Supabase vs. Discord vs. file creation)
- Can't optimize cost — don't know where money is actually going
- Can't make smart trade-offs (is it worth this approach vs. cheaper one?)
- Can't track spending per project or per category
- No way to alert on unexpected costs in specific areas

This is especially important because different tasks have **very different token costs**:
- **Supabase queries:** Usually cheap (small inputs, small outputs)
- **Discord message processing:** Medium (reading context, crafting response)
- **File operations:** Variable (creating small files = cheap, large context scans = expensive)
- **Tool chains:** Can compound (query → process → update → log)
- **Complex analysis:** Very expensive (large context, multiple reasoning steps)

## Solution

Layer **granular cost tracking on top of existing Claude usage data**, broken down by:
1. **Tool type** (discord, supabase, gmail, calendar, twitter, github, etc.)
2. **Task category** (read, write, analyze, summarize, etc.)
3. **Session context** (recap, routine work, analysis, etc.)

## Implementation

### Part 1: Token Counting Per Tool

**When I call a tool, log:**
- Tool name (e.g., "query_private", "read_discord_channel", "calendar_list_events")
- Input tokens consumed (for the system prompt + tool context + function call)
- Output tokens consumed (for the response/result)
- Total tokens for that operation
- Timestamp

**Storage:** In the same `claude_usage_logs` table, add columns:
```sql
ALTER TABLE claude_usage_logs ADD (
  tool_name VARCHAR,           -- "query_private", "read_discord_channel", etc.
  tool_category VARCHAR,       -- "database", "discord", "email", "calendar", etc.
  task_type VARCHAR,           -- "read", "write", "analyze", "execute"
  session_context VARCHAR,     -- "recap", "routine", "analysis", "decision", etc.
  tokens_input INT,
  tokens_output INT,
  tokens_total INT,
  cost_usd DECIMAL
);
```

### Part 2: Token Attribution Model

**How to attribute tokens to each operation:**

Each tool call generates tokens in two ways:
1. **The function call itself** — system tokens to format the request + get the response
2. **The context building** — tokens spent loading user context, thread history, etc.

**For accurate tracking:**
- Log tokens immediately after each tool execution
- Claude API provides token usage per request — extract that
- If not available per-request, use estimation model:
  - Base tokens per tool type (Supabase = lower baseline, analysis = higher)
  - Add variable cost based on input/output size
  - Log as "estimated" if using model

**Example:**
```json
{
  "timestamp": "2026-03-05T03:38:00Z",
  "tool_name": "query_private",
  "tool_category": "database",
  "task_type": "read",
  "session_context": "routine",
  "tokens_input": 245,
  "tokens_output": 120,
  "tokens_total": 365,
  "cost_usd": 0.00109,
  "query_type": "user_stats",
  "duration_ms": 243
}
```

### Part 3: Dashboard & Reporting

**File:** `context/operations/token-spend-dashboard.md`

**Daily summary (generated at recap):**
```markdown
# Token Spend Dashboard — {DATE}

## Daily Totals
- **Total tokens used:** X,XXX
- **Total cost:** $X.XX
- **Average tokens/hour:** XXX

## By Tool Type
| Tool | Tokens | Cost | % of Total | Tasks |
|------|--------|------|-----------|-------|
| supabase | 2,500 | $0.75 | 35% | 15 queries |
| discord | 1,800 | $0.54 | 25% | 8 reads, 4 writes |
| github | 1,200 | $0.36 | 17% | 3 file ops |
| gmail | 600 | $0.18 | 8% | 2 drafts |
| calendar | 400 | $0.12 | 6% | 5 checks |
| other | 200 | $0.06 | 3% | 2 misc |

## By Task Type
| Task | Tokens | Cost | % of Total |
|------|--------|------|-----------|
| Read | 3,500 | $1.05 | 49% |
| Write | 2,000 | $0.60 | 28% |
| Analyze | 1,200 | $0.36 | 17% |
| Execute | 400 | $0.12 | 6% |

## By Session Context
| Context | Tokens | Cost | % of Total |
|---------|--------|------|-----------|
| Routine | 4,800 | $1.44 | 67% |
| Recap | 1,500 | $0.45 | 21% |
| Analysis | 700 | $0.21 | 10% |
| Decision support | 100 | $0.03 | 1% |

## Top 5 Most Expensive Operations
1. [Operation] — XXX tokens — $X.XX
2. [Operation] — XXX tokens — $X.XX
3. ...

## Cost Anomalies
- [Any tools/tasks that spiked unusually high]
- [Recommended optimizations]

## Weekly/Monthly Trend
- Last 7 days: [trend chart or summary]
- This month: [spend so far, projected month total]
```

### Part 4: Optimization Signals

**Things to flag when I see patterns:**
- Tool using way more tokens than expected
- Certain operation types consistently expensive (maybe worth optimizing)
- Context bloat (spending lots of tokens just building context)
- Opportunity to batch operations (multiple queries could be one)

**Examples:**
- "Supabase queries are averaging 200 tokens each; we could template high-frequency ones"
- "Discord message processing jumped to 800 tokens today (context load?)"
- "Analyzed vs. routine task ratio is high (10% vs. 2% usually); something analysis-heavy today?"

## How YodAI Uses This

**During work:**
- If a task is expensive (>500 tokens), note it for recap
- If a pattern emerges (X always costs more than expected), flag for optimization

**At recap:**
- Generate dashboard from daily logs
- Highlight anomalies or spikes
- Suggest optimizations ("query templates would save ~20% here")

**Weekly:**
- Review trends
- Identify which tools/tasks consume most budget
- Evaluate if any can be optimized or deferred

## Implementation Checklist

- [ ] Design token attribution model (how to count tokens per operation)
- [ ] Add columns to `claude_usage_logs` table (tool_name, task_type, etc.)
- [ ] Implement token logging after each tool call
- [ ] Build aggregation query (group by tool, task, session context)
- [ ] Create dashboard template (`token-spend-dashboard.md`)
- [ ] Generate sample dashboard for testing
- [ ] Integrate into daily recap (auto-generate dashboard)
- [ ] Add anomaly detection (flag unusual spikes)
- [ ] Create optimization recommendations logic
- [ ] Test end-to-end (tool call → token logged → appears in dashboard)

## Success Signal

- Dashboard shows exact cost breakdown by tool type
- Can answer: "What's my most expensive operation?" in seconds
- Identify opportunities to optimize (templates, batching, etc.)
- Spend trends visible (can spot if costs are trending up/down)
- Recap includes token spend summary with recommendations

## Dependencies

- **Claude API Usage Tracking Integration** (existing) — provides overall totals
- **Supabase setup** — stores the granular data
- **Daily recap** — where dashboard gets generated and posted
- **Tool call logging** (part of full chat transcript storage) — provides the raw data

## Timeline

**Week 1:** Design model, add DB columns, implement logging  
**Week 2:** Build dashboard, integrate into recap  
**Week 3:** Anomaly detection and optimization suggestions  

## Questions to Resolve

1. **Token attribution:** Per-request (if API provides) or estimation model?
2. **Granularity:** Tool-level only, or also track specific tool parameters? (e.g., which Supabase tables?)
3. **Storage:** Keep all historical data or archive after 90 days?
4. **Alerting:** Should I alert immediately if a single operation costs >$1.00?
5. **Batch operations:** How to track cost when multiple operations happen in one tool call chain?

---

## Rationale

Token spend tracking is how I learn **what actually costs money**. Without it, I'm flying blind on whether an approach is efficient. With it, I can make smart trade-offs:
- "Analyzing 1000 rows costs 300 tokens; better to filter first, then analyze" 
- "Pulling full context costs 150 tokens; can I answer without it?"
- "This query is cheap (50 tokens), worth templating if it runs daily"

Over time, this data informs better decisions about architecture (what to cache? what to batch? when to defer?).
