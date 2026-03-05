# Decision Reasoning Capture

**Status:** Open  
**Date Created:** 2026-03-05  
**Priority:** High  
**Owner:** YodAI (implementation), Dax (input)

## Problem

I see what you decide to do, but I rarely understand **why**. This limits how well I can:
- Help with future similar decisions (I don't know your actual criteria)
- Give better recommendations (I'm guessing at your priorities, not knowing them)
- Understand your risk tolerance, values, and trade-off preferences
- Update my soul document with accurate behavioral models
- Build accurate personal context about how you think

Right now I'm inferring your decision frameworks from outputs, which is lossy and unreliable. What I actually need is **your reasoning, in your own words, in the moment** — while the decision is fresh.

## Solution

After you make a **significant decision** (not tactical tasks, but strategic choices), I ask 3-5 targeted questions about your reasoning. Your answers let me:
1. Update my soul document with your actual decision frameworks
2. Update personal context with how you think about problems
3. Recognize similar situations in the future and apply the same logic
4. Give better recommendations based on what actually matters to you

## What Counts as a "Significant Decision"

**Yes — ask about these:**
- Strategic pivots (shifting focus, changing priorities)
- Resource allocation (which project gets time/money/focus)
- Partnership/integration decisions (should we work with X?)
- Product/feature choices (what to build, what to skip)
- Team/ops changes (hiring, role shifts, process changes)
- Financial commitments (spending money, investment decisions)
- Technology choices (which tool, framework, approach)
- When you reject my recommendation (always ask why — I need to know)

**No — don't ask about these:**
- Tactical execution ("send this email", "schedule that meeting")
- Quick operational decisions (which channel to post to, minor timing calls)
- Routine tasks (file management, small updates)
- When the reasoning is obvious and already stated

## The Questioning Framework

**Trigger:** You make a significant decision or tell me a decision you made

**My response:** NOT "let me just note that" — actually ask.

**Format:**
```
Got it. I noticed you chose [decision]. Want to help me understand your thinking?

1. What was the main factor that tipped it for you? (vs. other options)
2. What would have changed your mind? (i.e., what conditions would flip this?)
3. How does this fit into what you're trying to do with [context]?
   (connect to bigger picture)
4. What's the worst case if this doesn't work out? (and are you okay with it?)
5. [Optional] Is there something here you've learned from before?
   (pattern recognition — have you faced similar trade-offs?)
```

**Tone:** Curious, not interrogative. 2-3 sentences max per question. Feel like natural conversation, not a survey.

**Adaptation:** Not all 5 every time. If 2-3 are clearly answered already, skip the rest. If you're busy, I can do it async (but in-the-moment is better).

## How I Use the Answers

### Immediate: Update Soul Document
If the answer reveals something about your **values, priorities, or decision framework**, it goes in the soul document.

**Examples:**

You say: "I picked Option A because it's more sustainable long-term, even though B would ship faster."
→ **Soul doc update:** "Dax prioritizes long-term sustainability over short-term speed"

You say: "I turned that down because I don't know enough yet."
→ **Soul doc update:** "Dax prefers to decide with more information; willing to delay decisions to reduce uncertainty"

You say: "I chose this because it compounds — small effort now saves a lot later."
→ **Soul doc update:** "Values compound effects and infrastructure investments; looks at second-order consequences"

### Ongoing: Update Personal Context
The **specific decision and reasoning** goes in personal context with the criteria you used.

**Format:**
```markdown
### Decision Framework — [Context Type]
- **Decision:** [What you chose]
- **Why:** [Your stated reasoning]
- **Trade-offs considered:** [Options you rejected and why]
- **Risk tolerance on this:** [What level of uncertainty you accepted]
- **Date:** {when you told me}
- **Related past decision:** [if pattern is clear]
```

### Over Time: Build Decision Model
After multiple decisions, I can identify your actual priority stack:
1. What matters most (speed? quality? sustainability? learning?)
2. When trade-offs happen, which wins? (usually?)
3. What's non-negotiable vs. flexible?
4. How much uncertainty can you live with?
5. Do you decide fast or slow? Under what conditions?

## Implementation Details

### When to Ask
- **Immediately after** you mention a decision (you say "I decided to..." or "We're going with...")
- **During work sessions** when a choice point comes up and you state your preference
- **At recap** if major decisions happened that day and I didn't get to ask in-the-moment
- **Never ambush** — if you're clearly busy, defer to later

### How to Handle Resistance
- If you seem like you don't want to explain: "No worries, just helps me learn. Skip it if you want."
- If the answer is "I don't know why, felt right": Accept that. Log it as intuitive/gut decision.
- If the answer is "it's complicated": Okay, ask the most important 1-2 questions instead.

### What If I Get It Wrong?
If I misread the decision or the reasoning, you correct me. No defensiveness — just adjust the context entry.

### Frequency
**Expected:** 2-5 times per week (depends on how many big decisions you make)  
**Not a burden:** Should feel like a natural conversation, not a chore  
**Async option:** If I miss it in the moment, I can ask at recap or next day

## Related to This

**Depends on:**
- Persistent Context Storage (where I store the learnings)
- Personal Context file (updated with decision frameworks)
- Soul Document (updated with values/priorities)

**Enables:**
- Better recommendations (I actually know your priorities)
- Continuous learning (I understand you better each week)
- Self-correction (when I give bad advice, I learn why)
- Decision support (I can ask "is this fitting your framework?" proactively)

## Success Signal

- Within 2 weeks: Have documented 5-10 significant decisions with reasoning
- Soul document has updated entries about your actual decision criteria
- Personal context has your decision frameworks by category (strategic, financial, technical, etc.)
- I reference your reasoning in future similar situations ("last time you chose Y because X, this feels similar")
- You feel understood better (I'm not guessing anymore)
- Recommendations improve (because I actually know what matters to you)

## What This Reveals Over Time

**By week 2:** Your top 3-5 actual priorities  
**By week 4:** Patterns in how you trade off (quality vs. speed, learning vs. execution)  
**By week 8:** Your risk tolerance, decision velocity, and non-negotiables  
**By week 12:** A functional decision model I can use to predict what you'd choose  

## Example Interaction

**You:** "I decided we're not integrating with Routine until they have a public API. Too risky to depend on their in-house build."

**Me:** "Got it — makes sense given the dependency risk. A few quick questions to help me understand your thinking?

1. Was the main concern that they might change the API, or that we'd be blocked if it fails?
2. If they released the API tomorrow, would you reconsider, or would you want time to see it mature first?
3. How does this fit into your broader strategy for data access and integrations?
4. What would be the cost if we waited 3-6 months vs. jumped in now?"

**You:** "1. Mainly the timing uncertainty — they're building in-house, no timeline. 2. I'd want to see it stable for a month first. 3. We're trying to reduce vendor lock-in, so I want to understand what we're depending on before committing. 4. The cost is just slower visibility into team data, which we can live with."

**My follow-up:** 
- **Soul doc:** Add "Dax values independence from vendors; willing to delay integration for better understanding of dependencies"
- **Personal context:** Document this as a decision framework + add to integration criteria (public API, mature, understood dependencies)
- **Future:** When another integration comes up, reference this framework

## Guardrails

- **Not therapy:** I'm not analyzing your *feelings*, just understanding your *reasoning*
- **Not interrogation:** If you seem annoyed, I drop it
- **Not second-guessing:** I'm not asking to challenge your decision, just to understand it
- **Privacy respected:** This is for me to understand you better; not shared or judged
- **No "gotchas":** If you contradict yourself later, I don't point it out — people change their minds, and that's data too

## Timeline

**Start:** Immediately (with next significant decision)  
**Ongoing:** Every time a major decision happens  
**Audit:** Weekly recap — any decisions I missed?  
**Review:** Monthly — update soul doc based on accumulated patterns

