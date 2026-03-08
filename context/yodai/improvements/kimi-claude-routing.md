# Kimi-Claude Cost Routing

**Status:** Proposed  
**Date:** 2026-03-07  
**Cost Impact:** Reduces token spend by routing simple responses through Kimi, Claude only for complex work

## Problem

Every response currently goes through Claude, even when the user is asking a simple question that just needs me to identify what work needs doing. This wastes credits on narration.

## Solution

Implement two-tier routing:

### Tier 1: Single-part answers (Kimi only)
- Quick lookups ("what tasks do I have?")
- Simple confirmations ("sounds good")
- Status checks
- Direct context pulls

I answer directly, no Claude involved.

### Tier 2: Two-part questions (Kimi → Claude)
- Questions that need thinking + execution (e.g., "how many users joined yesterday?")
- Data analysis that requires synthesis
- Complex decision-making

**Flow:**
1. User asks two-part question
2. I identify the work needed ("Looking to see how many users joined yesterday")
3. Kimi rewrites this into a proper Claude prompt with full context
4. Claude API executes (query, analysis, synthesis)
5. Return result to user

## Implementation

Add middleware that:
- Takes my "looking to..." response
- Reformats into Claude prompt with relevant context (schema info, past queries, user intent)
- Hits Claude API directly
- Returns result

No change to my code — I still flag the work, middleware handles the routing.

## Cost Benefit

- **Current:** Kimi cost + Claude cost (every response)
- **New:** Kimi cost + Claude cost (only two-part questions)
- **Net savings:** Every single-part answer that would have gone to Claude now stays in Kimi layer

Example:
- "What tasks do I have?" → Kimi only (~$0.001)
- "How many users joined yesterday?" → Kimi flag (~$0.001) + Claude execution (~$0.01)

## Tracking

Mark two-part questions with a flag in responses so we can measure how much of the workload this actually catches.

## Next Steps

1. Build middleware that takes "Looking to..." responses
2. Test with a few real queries
3. Measure actual cost difference
4. Adjust thresholds if needed (maybe some "single-part" questions should go to Claude anyway)
