# Model Routing by User Tier

**Status:** Open  
**Date Created:** 2026-03-05  
**Priority:** Medium  
**Owner:** Zack (implementation), YodAI (routing logic)

## Problem

Currently, all messages (whether from you or team members) route to Claude (the premium/expensive model). This means:
- Team member requests cost the same as your requests
- No cost optimization based on request complexity or user tier
- Budget grows linearly with team size
- Can't prioritize budget spending toward high-value work (your decisions vs. team automation)

## Solution

Implement **model routing by user tier**:
- **Tier 1 (You/Owner):** Claude (premium model) — always best quality/reasoning
- **Tier 2 (Team Members):** Kimi (cheaper model) — good for routine tasks, faster iteration, cost-effective

Routes automatically based on Discord user ID from the **Discord User Profile Tracking** improvement.

## How It Works

### Step 1: Check User Tier

When a message arrives, before processing:
1. Extract user ID from Discord message
2. Look up user profile in `context/operations/discord-users/user_profiles.json`
3. Check their tier:
   - Tier 1 (owner) → use Claude
   - Tier 2 (team member/other) → use Kimi
4. Route to appropriate model

### Step 2: Model Selection Logic

```
if user_id == dax_id:
  model = "claude-opus"  // or current best Claude
  priority = "high"
elif user_role in ["owner", "admin"]:
  model = "claude-opus"
  priority = "high"
elif user_id in specific_high_priority_list:
  model = "claude-opus"
  priority = "medium"
else:
  model = "kimi"
  priority = "normal"
```

**Config file:** `context/operations/model-routing-config.json`
```json
{
  "default_model": "kimi",
  "tier_mapping": {
    "owner": "claude-opus",
    "admin": "claude-opus",
    "team_member": "kimi",
    "external": "kimi"
  },
  "user_overrides": {
    "user_id_special": "claude-opus"
  },
  "cost_limits": {
    "daily_kimi_budget": 100.00,
    "daily_claude_budget": 50.00,
    "alert_threshold_pct": 80
  }
}
```

### Step 3: Model Comparison

**When to use each:**

| Task | Kimi | Claude | Recommendation |
|------|------|--------|-----------------|
| Simple Q&A | ✓ | ✓ | Kimi (saves cost) |
| Data queries | ✓ | ✓ | Kimi (straightforward) |
| Tool execution | ✓ | ✓ | Kimi (defined steps) |
| Complex analysis | ✗ | ✓ | Claude (reasoning needed) |
| Strategic decisions | ✗ | ✓ | Claude (high stakes) |
| Multi-step reasoning | ✗ | ✓ | Claude (complex) |

**Decision rule:**
- Team members = Kimi by default
- Your messages = Claude (always best quality)
- Escalation = if Kimi hits complexity limit, flag for manual review

### Step 4: Fallback/Escalation

If Kimi response quality is insufficient (detectable via error rate, user feedback, or complexity heuristic):
1. Log the request as "escalation candidate"
2. Flag in daily recap: "X requests were complex for Kimi model"
3. Option to retry with Claude (costs more, but ensures quality)
4. User can explicitly request Claude ("use the good model")

## Implementation Checklist

- [ ] Research Kimi API and pricing
- [ ] Create Kimi integration (similar to Claude API setup)
- [ ] Design model routing logic
- [ ] Create `model-routing-config.json`
- [ ] Implement tier check before processing each message
- [ ] Update system prompt to include model awareness
- [ ] Add cost tracking per model (separate from existing tracking)
- [ ] Implement fallback/escalation detection
- [ ] Test routing (verified Dax → Claude, team → Kimi)
- [ ] Set up cost monitoring (alert if Kimi budget exceeded)
- [ ] Create dashboard showing cost breakdown by model
- [ ] Document when to use each model in system prompt

## Cost Implications

**Assumptions (to verify with Kimi pricing):**
- Claude: ~$0.003 per 1K tokens (input/output blend)
- Kimi: ~$0.001 per 1K tokens (estimate, 50-70% cheaper)

**Monthly savings estimate:**
- If team generates 500K tokens/month at Kimi rates: saves ~$1-2/month per team member
- If you generate 500K tokens/month at Claude rates: ~$1.50/month
- **Scale factor:** With 3-5 team members, potential 40-50% savings on overall token costs

## Related Improvements

**Depends on:**
- Discord User Profile Tracking (knows who's who and their tier)
- Discord User Profile Tracking establishes the channel/user response rules

**Enables:**
- Cost optimization (tier-based routing)
- Better budget allocation (premium model for premium requests)
- Scalability (can add team members without proportional cost increase)

## Success Signal

- All your messages route to Claude automatically
- All team member messages route to Kimi automatically
- Daily cost tracking shows breakdown by model and user tier
- Team gets fast, usable responses from Kimi
- Complex requests escalate appropriately
- Overall token costs decrease 30-40% vs. all-Claude approach

## Questions to Resolve

1. **Kimi pricing:** What's the actual per-token cost?
2. **Kimi capabilities:** What are its limits? Which task types should we avoid?
3. **Quality detection:** How to automatically detect if Kimi response is insufficient?
4. **User preference:** Should team members be able to request Claude explicitly?
5. **Fallback cost:** If escalation to Claude happens, who bears the cost?
6. **Error handling:** What if Kimi API is down? Fall back to Claude?

## Timeline

**Week 1:** Research Kimi, set up integration  
**Week 2:** Implement routing logic  
**Week 3:** Cost monitoring and dashboard  
**Week 4:** Monitor quality, tune escalation thresholds  

---

## Rationale

This is a **pragmatic cost optimization** without sacrificing quality where it matters. Team members get fast, functional responses via a cheaper model. You maintain access to the best model for strategic work. As the team grows, cost growth slows because routine work is already optimized.
