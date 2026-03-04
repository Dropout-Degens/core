# Reaction vs. Text Response Clarity
**Status:** Open  
**Date Created:** 2026-03-03  
**Priority:** High

## Problem
YodAI consistently fails to use `react_to_message` for simple acknowledgments, instead sending text emoji or text replies. This violates the core rule: simple acks (ok, thanks, cool, got it, yes, no worries, perfect) should use reactions only — never text + reaction together.

## Why It's Failing
1. **Buried in prompt** — The rule lives in the "Rules" section near the bottom of instructions, competing with 10+ other rules. By the time context window is deep into a conversation, it's not fresher in focus.
2. **Not memorable enough** — Phrased as a standard rule without emphasis or trigger language. No pattern matching on phrases like "cool thank you" or "sounds good" that should autopilot to reactions.
3. **No friction/enforcement** — The function exists and is easy to use, but nothing flags when I'm about to send text instead of reacting.
4. **Ambiguity on edge cases** — Unclear when a response is "simple acknowledgment" vs. "needs actual reply" (e.g., "cool thank you" + we just stored a file — is that close enough to just ack?).

## Root Cause
The instruction is clear, but **priority hierarchy is wrong**. It's treated as a general guideline rather than a structural rule about how to communicate. Message format decisions should come early in response planning, not late.

## What Would Help

### Option A: Elevate in Prompt (Quick Win)
Move the reaction rule to the top 3 rules in the "Rules" section with bold emphasis:
```
## Rules
- **BE CONCISE** — no fluff
- **READ CONTEXT FIRST** — before acting on DD topics  
- **REACTIONS FOR ACKS** — simple acknowledgments (ok, thanks, cool, got it, yes, no worries, perfect, all good, sounds good) use react_to_message ONLY. Never send text + reaction together.
```

**Impact:** Moves it into the first ~50 tokens of instruction parsing. Better recency in working memory.

### Option B: Create Decision Tree (More Robust)
Add a structured decision framework before the Rules section:

```
## Response Format Decision
Before responding, ask: "Is this a simple acknowledgment?"

Simple acks include: ok, thanks, cool, got it, yes, no worries, perfect, all good, sounds good, understood, confirmed, sure, yep, nope, nice, great

If YES → Use react_to_message (👍 for agreement, ✅ for completion). Stop. Don't send text.
If NO → Send text reply normally.

Exception: If ack comes with substantive context that needs reply, clarify first.
```

**Impact:** Explicit decision point before each response. Removes ambiguity.

### Option C: Add Examples (Concrete Anchoring)
Include a section showing real scenarios:

```
## Reaction Examples
❌ Wrong: Send "👍" as text message
❌ Wrong: Send "sounds good" as text + then react
✅ Right: Use react_to_message(emoji="👍")

Scenario 1: "cool thank you"
→ React with 👍. Nothing else.

Scenario 2: "sounds good, create the file"
→ React with 👍. The request is captured, no need to echo.

Scenario 3: "ok but what about X?"
→ Send text. Has a question, needs actual reply.
```

**Impact:** Removes guesswork. Shows exactly what right looks like.

### Option D: Token Budget Allocation (Systemic Fix)
Reserve ~200 tokens at the start of every response for "core rules check" — a forced review of the top 5 decision rules before generating any output.

**Impact:** Highest reliability but adds latency. Best for critical rules.

## Recommendation
Combine **Option A** (elevate in prompt) + **Option B** (decision tree). Takes ~100 tokens, covers both recency and clarity.

Option C (examples) is good reinforcement but secondary.

## Success Signal
- Zero instances of sending text emoji or text + reaction combo
- 100% of simple acks use `react_to_message`
- Decision is made before response generation, not corrected after
