# DD Health Dashboard

**Status:** Open  
**Date Created:** 2026-03-05  
**Priority:** Medium  
**Owner:** YodAI (implementation), Dax (data source)

## Problem

I have read access to Supabase but no **live, unified view** of DD's operational health. This means:
- Can't spot early warning signals (revenue drops, user churn, blockers emerging)
- Don't understand what projects are stuck and why
- Can't see team capacity or what's slowing things down
- Have to query individual metrics separately instead of seeing the picture
- Miss context on "why are we focused on this right now?"

Without operational context, I make recommendations in a vacuum. I don't understand:
- Which initiatives are blocked and need unblocking
- What the current bottleneck is
- How healthy the business actually is
- What constraints we're operating under

## Solution

Create a **simple DD health dashboard** stored in the repo that I can read before/during recap to understand:
- Current operational status
- Key metrics (users, revenue, blockers)
- What's being prioritized this week
- Team capacity / what's in flight

### What Goes In It

**File:** `context/operations/dd-health-status.md` (updated weekly or as-needed)

**Sections:**

```markdown
# DD Health Status — Week of {DATE}

## Key Metrics (Last Updated: {DATE})
- Active Users: X (↑/↓ Y% from last week)
- Revenue (MTD): $X (on pace for $Y monthly)
- Churn Rate: X%
- User Acquisition Rate: X/day

## Current Blockers
- [ ] Blocker 1 — Impact: medium — Unblocked by: [date/person]
- [ ] Blocker 2 — Impact: high — Unblocked by: [date/person]

## In Flight (Priority Order)
1. Project A — Status: 70% — Lead: X — Blocks: nothing / Blocked by: Y
2. Project B — Status: 30% — Lead: X — Blocks: Y / Blocked by: nothing
3. Project C — Status: On hold — Reason: X

## Team Capacity
- Available: X hours this week
- Allocated to: [breakdown]
- Risk: [overloaded? gaps?]

## This Week's Focus
- Top 3 priorities
- What success looks like
- Risks to watch

## Context / Decisions Made
- Decision: X → Rationale: Y → Expected outcome: Z

## Data Sources
- Metrics from: [where pulled from]
- Last full update: {date}
- Next update: {date}
```

### How I'd Use It

**Before Daily Recap:**
- Scan health status to understand context
- Know which projects are live and which are on hold
- Understand what blockers exist
- Have context for prioritizing tasks

**During Work Sessions:**
- Reference when making recommendations ("this would help unblock project X")
- Understand constraints ("we don't have capacity for new initiatives")
- Spot when something contradicts health status (flag it)

**At Recap:**
- Ask you: "Any updates to health status for next week?"
- You give me changes
- I update the file

### Data Sources

**Metrics pull from:**
- Supabase queries (users, churn, etc.)
- Manual logging (if not in DB)
- Routine (if we integrate it)
- Your input (team capacity, priorities, blockers)

**Update frequency:**
- Weekly (standard update cycle)
- As-needed (urgent blocker emerges)
- Post-decision (when priorities shift)

### Implementation Steps

1. **Define what "health" means for DD**
   - What metrics actually matter?
   - What's the decision framework for priorities?
   - What counts as a blocker vs. noise?

2. **Create initial dashboard**
   - `context/operations/dd-health-status.md` on main
   - Seed with current state

3. **Set update cadence**
   - Weekly refresh (e.g., Friday recap)
   - You provide updates, I format and commit

4. **Build into my workflow**
   - Read at start of day/before recap
   - Reference when making calls
   - Flag inconsistencies

5. **Optional: Query automation**
   - Create saved queries for metrics pulls
   - Auto-update some fields weekly
   - Still manual for blockers/priorities (those need your input)

## Success Signal

- I have current context on DD ops before making recommendations
- Can spot when something contradicts health status (e.g., "we're focused on retention but metrics show acquisition focus")
- Understand why we're prioritizing what we're prioritizing
- Can proactively flag emerging issues ("churn spiked, should we investigate?")
- Reduces the "I didn't know that was happening" moments

## Trade-offs

**Pro:**
- Single source of truth for DD health
- Lightweight (one file, updated once a week)
- Gives me context I'm currently missing
- Easy to build on (add metrics as they become relevant)

**Con:**
- Requires you to maintain (but it's a weekly 5-min update)
- Only as good as the data sources
- Might highlight uncomfortable truths (that's a feature, not a bug)

## Related Improvements

- Supabase Query Templates (will use these queries to pull metrics)
- Persistent Context Storage (blockers/decisions go here too)
- Outcome Feedback Loop (health metrics inform what's working)

## Next Steps

1. Define DD's key health metrics (what should be on the dashboard?)
2. Identify current blockers and priorities
3. Create initial dashboard file
4. Establish weekly update cadence (probably Friday recap?)
5. Build into my pre-recap routine
