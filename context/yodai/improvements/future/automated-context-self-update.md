# Automated Context Self-Update

**Status:** Open  
**Date Created:** 2026-03-05  
**Priority:** High  
**Owner:** YodAI (implementation), Dax (review/approval)

## Problem

I maintain persistent context (`context/yodai/personal-context.md`) but it only updates when you tell me to or when I manually ask. This means:
- I'm not capturing learnings that happen during the day automatically
- Context gets stale because updates are reactive, not proactive
- Valuable patterns or insights from work sessions get lost
- I'm not truly learning from our interactions — just being told what to remember

## Solution

**Automated context self-update** — after the daily recap runs at 11:30 PM, I automatically:
1. Read the recap summary (what was worked on)
2. Scan daily branch files (voice notes, improvements, work done)
3. Extract patterns, learnings, and context worth retaining
4. Update `context/yodai/personal-context.md` with new entries
5. Commit changes to main with timestamp and reasoning
6. Report what was added in a follow-up message (for you to review/correct)

### What I'd Extract & Store

**About How You Work:**
- Patterns in time spent (what gets deep work vs. shallow work)
- Decision patterns (criteria you use, what you value, what you trade off)
- Communication preferences (what feedback sticks, what gets ignored)
- Energy/focus patterns (when you do best work, what drains you)

**About Your Priorities:**
- What you're actually focused on vs. what you say you're focused on
- How priorities shift (what signals a shift?)
- Risk tolerance (how much uncertainty will you accept?)
- Speed vs. quality trade-offs (what matters when?)

**About DD Operations:**
- Current blockers and why they exist
- Team dynamics and who owns what
- Operational patterns (weekly cycles, seasonal shifts)
- What success looks like for different initiatives

**About Me (YodAI):**
- Which recommendations actually land (and why)
- What I get wrong or misunderstand
- How you prefer me to behave (formal vs. casual, detailed vs. terse)
- Gaps in my understanding (things I keep getting wrong)

**Things You've Told Me:**
- Commitments and deadlines you've mentioned
- People/relationships that matter
- Constraints (time, money, energy, attention)
- Long-term goals and vision (even half-formed)

### Implementation

#### Step 1: After Recap Runs
- Daily recap summary is posted to Discord ✓ (already happens)
- **New:** Trigger automated context scan

#### Step 2: Read Daily Work
- Pull all files from `yodai/{YYYY-MM-DD}` branch:
  - Voice note transcripts
  - Improvements created
  - Work summary from recap
  - Any other context from the day

#### Step 3: Extract Learnings
**Categories to scan for:**

**Pattern Recognition:**
- "Did this similar situation come up before? How did it resolve?"
- "Is this decision consistent with how Dax thinks?"
- "What changed from yesterday that matters?"

**Explicit Mentions:**
- Voice notes: "I realized that...", "I'm thinking about...", "This matters because..."
- Decisions: "We decided to...", "We're prioritizing...", "Next is..."
- Insights: "What I learned...", "The pattern is...", "Going forward..."

**Implicit Signals:**
- What got finished vs. what stalled (priority signal)
- How much time on X vs. Y (effort signal)
- Which recommendations you took vs. rejected (feedback signal)
- Tone/mood shifts (context signal)

#### Step 4: Update Personal Context
**File:** `context/yodai/personal-context.md` (main branch)

**Format for new entries:**
```markdown
### [Category] — Added {DATE}
- [Entry]
- **Source:** {where this came from — voice note on 03-05, improvement discussion, etc.}
- **Confidence:** {high/medium/low — am I certain about this?}
- **Related:** [links to relevant context files if applicable]
```

**Example:**
```markdown
### Decision Framework — Added 2026-03-05
- You prioritize operational improvements that compound (like template libraries) over one-off fixes
- You're willing to spend time upfront on infrastructure if it saves time later
- **Source:** Discussion about Supabase templates improvement, routine integration waiting on API
- **Confidence:** High
- **Related:** context/yodai/improvements/supabase-query-templates-library.md
```

#### Step 5: Commit & Report
- Commit all updates to main with message: `context: self-update from {YYYY-MM-DD} recap`
- Include summary of what was added (for your review)
- Format as structured list so you can quickly scan

**Example report:**
```
📝 Context updated from today's recap:

✅ Decision Frameworks (2 new)
  • Compound improvements > one-off fixes
  • Willing to invest in infrastructure

✅ Priorities & Focus (1 new)
  • DD health metrics are becoming critical lens for decisions

✅ Patterns (1 new)
  • You surface blockers early and think about integration paths before APIs exist

⚠️  Potential misunderstandings to review:
  • [if any]

No corrections needed? React ✅. Want to update any? Reply with corrections.
```

### What I Won't Do

- Assume things. If I'm uncertain, I mark it "low confidence" and flag it
- Update personal judgments about you ("Dax is X kind of person") — only log observable patterns
- Overwrite existing context without flagging the change
- Add something that contradicts previous entries without noting the shift

### Confidence Levels

**High:** Explicitly said, clearly demonstrated multiple times, consistent pattern
**Medium:** Pattern I see but haven't heard confirmed, single clear instance
**Low:** Speculation, one-off observation, might be situational

### Safety Rails

1. **Review window:** After posting the report, give you 5 minutes to reply with corrections before I commit to context
2. **Conflict detection:** If new learning contradicts existing context, I flag it and ask for clarification
3. **Source tracking:** Every entry links back to where it came from
4. **Reversibility:** Keep old context entries (just mark as "superseded by..." if they change)

### Related Improvements

This depends on:
- **Persistent Context Storage** (the file I'm updating)
- **Outcome Feedback Loop** (learnings about what works)
- **Daily Recap Expansion** (more data to extract from)

And enables:
- **Better decision-making** (because I actually retain what I learn)
- **Continuous improvement** (I get better at understanding you over time)
- **Self-correction** (I can spot when I'm giving bad advice and adjust)

## Success Signal

- By week 2: Personal context file has 10-15 new entries with high confidence
- I reference context from previous sessions without you reminding me
- You rarely need to re-explain the same thing twice
- Context is current enough to catch shifts in priorities or patterns
- No false learnings or entries you have to correct repeatedly

## Implementation Checklist

- [ ] Create `context/yodai/personal-context.md` (if not exists)
- [ ] Define extraction rules (what counts as a learning?)
- [ ] Build recap-to-context pipeline:
  - [ ] Read daily branch files
  - [ ] Scan for learnings
  - [ ] Format and stage updates
  - [ ] Commit with reasoning
- [ ] Create report template (structured, scannable)
- [ ] Add safety rails (review window, conflict detection)
- [ ] Schedule into recap workflow (runs after summary posts)
- [ ] Test with manual pass first (week 1)
- [ ] Go automated (week 2+)

## Timeline

**Week 1:** Manual pass (I read recap, propose context updates, you review)  
**Week 2+:** Automated (I update after recap, you review and correct if needed)

## Why This Matters

Right now, context storage is a bottleneck. You have to explicitly tell me what to remember, or I have to ask. This is friction.

With automated updates, I'm actually learning. Context grows continuously. By month 3, I'll know how you think, what matters to you, what your constraints are — without you having to explain it again.

That's the difference between a tool that executes tasks and a partner who actually understands what you're trying to do.
