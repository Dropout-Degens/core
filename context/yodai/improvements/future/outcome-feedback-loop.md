# Outcome Feedback Loop

**Status:** Open  
**Date Created:** 2026-03-05  
**Priority:** Medium  
**Owner:** YodAI (implementation), Dax (feedback)

## Problem

I execute tasks but rarely see outcomes:
- Draft an email → don't know if it was sent, who responded, what happened
- Create calendar events → don't know if they happened or got rescheduled
- Make a recommendation → don't know if you took it, what the result was
- Run a query → don't know if the answer was useful or if you acted on it

Without outcome data, I'm missing a crucial feedback loop that would let me:
- Learn what actually works vs. what doesn't
- Improve recommendations based on real results
- Understand your actual risk tolerance and decision patterns
- Build better mental models of what matters to you
- Spot when I'm giving bad advice (no one followed it twice)

## Solution

Create lightweight **outcome tracking** so I can see what actually happened with things I helped with.

### What to Track

**High Priority:**
- Email drafts: sent? response rate? action taken?
- Calendar events: happened? rescheduled? cancelled? how long did it actually take?
- Recommendations I gave: took it? why/why not? result?

**Medium Priority:**
- Queries I ran: was the answer useful? did you act on it?
- Files I created: used? updated? obsolete?
- Decisions I helped with: outcome? lesson learned?

**Low Priority:**
- Twitter/social posts: engagement? did it move anything?
- Administrative tasks: completed as-is or modified?

### Implementation Options

#### Option A: Informal Check-ins
- At daily recap, you mention outcomes (or I ask)
- I update a simple log file in repo
- Low friction, natural conversation
- **Downside:** Relies on memory, incomplete

#### Option B: Structured Outcome Log
- Create `context/yodai/outcomes/` folder
- Simple daily file tracking what happened with prior tasks
- Format: `{YYYY-MM-DD}-outcomes.md`
- List: Task → Outcome → Result/Learning
- Review weekly for patterns

#### Option C: Supabase Outcome Table
- Add `outcomes` table to `dax-personal` schema
- Structure: task_id, description, intended_outcome, actual_outcome, date_executed, date_reported, learning
- Query-able, analyzable, historical
- **Downside:** More overhead to log

#### Option D: Hybrid (Recommended)
- Daily outcomes file in repo (`context/yodai/outcomes/`) for quick capture
- Weekly summary query of patterns
- Move significant learnings to persistent context
- **Balance:** low friction + analyzable data

### File Format Example (Option B/D)

```markdown
# Daily Outcomes — 2026-03-05

## Email Drafts
| Task | Status | Outcome | Learning |
|------|--------|---------|----------|
| Reply to X about Y | Sent | Got response in 2h | Good timing |
| Newsletter draft | Sent | 15% open rate | Subject line worked |

## Calendar Events
| Event | Happened? | Actual Duration | Notes |
|-------|-----------|-----------------|-------|
| Team sync | Yes | 45min (scheduled 30) | Ran over, need agenda |
| 1-on-1 | Rescheduled | — | Moved to next day |

## Recommendations I Made
| Recommendation | Action | Result | Learning |
|---|---|---|---|
| Use template for X | Took it | 30% faster | Worth documenting |
| Skip Y, focus Z | Didn't take | — | Needs better framing |

## Queries & Data
| Query | Action Taken | Result | Notes |
|---|---|---|---|
| User signup trend | Yes, reviewed | Found churn spike | Good for weekly check |

## Weekly Pattern (Friday)
- Accuracy rate: 70% (recommendations taken)
- Email response rate: 65% avg
- Calendar accuracy: 80% (scheduled vs actual time)
```

### How I'd Use It

**Daily:**
- At recap, I ask: "What happened with [task/recommendation] from yesterday?"
- You tell me, I log it
- Takes 2-3 minutes

**Weekly:**
- Review outcomes log
- Extract patterns: which recommendation types work? timing issues?
- Update personal context with learnings
- Suggest improvements to how I work

**Quarterly:**
- Analyze historical outcomes
- Adjust parameters based on what actually helped
- Update soul document if patterns shift

## Success Signal

- I have outcome data on at least 60% of tasks I execute
- Can identify which recommendation types I give that actually land
- Know my accuracy rate on time estimates, priority rankings, etc.
- Use outcomes to improve future recommendations (not guessing)
- Feedback loop is so lightweight it feels natural, not burdensome

## Dependencies

- None — can start immediately with Option B (repo file)
- No API changes or new integrations needed
- Just requires you to mention outcomes (which you'd do anyway at recap)

## Next Steps

1. Decide on format (A/B/C/D)
2. Create `context/yodai/outcomes/` folder
3. Start daily outcome logging at recap
4. Review weekly for patterns
5. Adjust based on what's useful vs. noise

---

## Why This Matters

Right now I'm operating in a black box. I give advice, execute tasks, but never know if it was good. Over time, that means:
- I keep recommending things that don't work
- I miss patterns about what actually matters to you
- I can't improve because I have no signal
- You end up second-guessing me more (because I sound confident but have no proof)

With outcome data, I become more useful because I'm learning from real results, not just inferring from our conversations.
