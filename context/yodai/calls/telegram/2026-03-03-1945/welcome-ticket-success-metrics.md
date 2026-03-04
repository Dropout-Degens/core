# Welcome Ticket Success Metrics

**Type:** Measurement & Attribution  
**Date:** March 3, 2026  
**Status:** Ready for 2-week pilot  
**Goal:** Define what "success" looks like, how to measure it, and how to connect conversion back to acquisition channels

---

## Overview

The welcome ticket is designed to convert passive new members into engaged members who take downstream actions. This doc defines:

1. **What counts as success** (engagement signals)
2. **How to measure it** (tracking methodology)
3. **How to attribute it back to source** (channel quality assessment)
4. **How to iterate** (A/B testing framework)

---

## Tier 1: Engagement Signals (Primary Metrics)

These are the "downstream actions" that prove a member is engaged, not lurking.

### Action 1: Partner Promo Bot Sign-Up
**What it is:** Member uses the partner promo bot to sign up for a sportsbook (DraftKings, FanDuel, BetMGM, etc.)

**Why it matters:**
- Requires explicit action (not passive)
- Shows they're ready to place bets
- Gives us attribution (we can see which partner they signed up through)
- High conversion → high intent member

**How to track:** Partner bot logs all signups with user ID + partner name + timestamp

**Success threshold:** 30%+ of new members sign up via partner bot within 7 days

---

### Action 2: Bankroll Tracker Input
**What it is:** Member inputs their bankroll amount (and optionally current unit size) into the bankroll tracker.

**Why it matters:**
- Requires commitment (they're saying "this is my betting budget")
- Enables unit sizing calculation
- Shows they're thinking about discipline, not just picks
- Signals they understood the bankroll management message

**How to track:** Bankroll tracker logs input with user ID + amount + timestamp

**Success threshold:** 25%+ of new members input bankroll within 7 days

---

### Action 3: EV Alerts Opt-In
**What it is:** Member enables notifications for the EV alerts channel (OddsJam partnership alerts).

**Why it matters:**
- Shows interest in strategy-based picks (not just picks)
- Keeps them engaged with the server (daily alerts)
- High repeat engagement (they come back daily to check)
- Correlates with tool literacy

**How to track:** Discord notification settings + alerts channel join logged with user ID + timestamp

**Success threshold:** 35%+ of new members opt into EV alerts within 7 days

---

### Action 4: Bet Tracking Started
**What it is:** Member logs their first bet in a tracking system (OddsJam, spreadsheet, bankroll tracker, or Odds Jam integrated logging).

**Why it matters:**
- Proves they're actually betting (not window shopping)
- Starts the feedback loop (they see their P&L)
- Shows commitment to transparency
- High signal of serious member vs. degen

**How to track:** First bet entry timestamp + system used (logged in Discord or tracking DB)

**Success threshold:** 20%+ of new members log a bet within 7 days

---

## Tier 2: Composite Engagement Score

**Engaged Member Definition:** Took at least 1 of the 4 actions above within 7 days

**Target conversion rate:** 60%+ of new members take at least one action

**Breakdown for 100 new members (example):**
- 30 sign up for partner promo
- 25 input bankroll
- 35 opt into EV alerts
- 20 log a bet
- Some overlap (same person does 2+ actions)
- **Total engaged:** 60+ unique members (60%+)

---

## Tier 2: Churn Risk Signals

Inverse of engagement: members who don't take any action within 7 days = high churn risk.

**Tracking:**
- Flag any member with zero actions by day 7
- Send re-engagement ticket (pain point rediscovery)
- Secondary test: "What would actually be useful to you?"

This becomes your re-engagement funnel data.

---

## Channel Attribution: Identifying Quality Sources

Once you have conversion data, overlay it with source data to see which invite links send engaged members.

**The query you'll run (week 2):**

```sql
SELECT
  source_invite_code,
  source_domain,
  COUNT(DISTINCT user_id) as total_new_members,
  COUNT(DISTINCT CASE WHEN took_action = true THEN user_id END) as engaged_members,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN took_action = true THEN user_id END) / COUNT(DISTINCT user_id), 1) as conversion_rate,
  AVG(CASE WHEN action_type = 'partner_signup' THEN 1 ELSE 0 END) as partner_signup_rate,
  AVG(CASE WHEN action_type = 'bankroll_input' THEN 1 ELSE 0 END) as bankroll_rate,
  AVG(CASE WHEN action_type = 'ev_alerts' THEN 1 ELSE 0 END) as ev_alerts_rate,
  AVG(CASE WHEN action_type = 'bet_tracking' THEN 1 ELSE 0 END) as bet_tracking_rate
FROM new_member_actions
WHERE join_date >= CURRENT_DATE - INTERVAL '14 days'
GROUP BY source_invite_code, source_domain
ORDER BY conversion_rate DESC
```

**What you're looking for:**

| Invite Source | Expected Signal |
|---------------|-----------------|
| Personal invites (Luke, Poro, etc.) | 70%+ conversion (high intent) |
| Website join button | 40-50% conversion (medium intent, casual discovery) |
| Server discovery | 30-40% conversion (lowest intent, passive) |
| Partner listings (DraftKings, Dabble Reddit) | 50-60% conversion (partner traffic, self-selected) |
| Community listings (Fliff Flops, Discord.me, Hive) | 30-50% conversion (mixed quality) |

---

## Success Metrics: Week 1 vs. Week 2

### Week 1: Baseline
Run the welcome ticket on all new members for 7 days. Collect:
- Total new members
- Total actions taken (and which action type)
- Overall conversion rate
- Churn rate (zero actions)

**Example target: 60%+ conversion**

### Week 2: Attribution + Iteration
Overlay conversion with source data:
- Which invite link sent the most engaged members?
- Which pain area had the highest conversion to specific action?
- Which response template drove the most action?

**Example insight:** "Personal invites convert at 75%, server discovery at 28% — scale personal invite budget, reduce organic discovery spend."

---

## Pain Area → Action Correlation

Track which pain area connects to which downstream action:

| Pain Area | Primary Action | Expected Rate | Notes |
|-----------|----------------|----------------|-------|
| Profit Taking | Bankroll Input | 60%+ | They see the direct connection to discipline |
| Hedging / EV Confusion | EV Alerts Opt-In | 50%+ | They want to understand when hedging makes sense |
| No Tracking | Bet Tracking Started | 40%+ | Natural next step, but requires ongoing effort |
| No Separate Account | Bankroll Input | 55%+ | Setup → tracker → ongoing discipline |
| No Unit System | Bankroll Input + Unit Calc | 65%+ | Math-based, they see the ROI immediately |
| Tax Unaware | None (maybe low action) | 20-30% | Lowest engagement; compliance education, not urgent to them |

**Use this to:**
- Identify which response templates work (profit taking → bankroll conversion?)
- Test message variations (does emphasizing the math vs. discipline change action rate?)
- Recognize underperforming pain areas (if tax awareness = low action, deprioritize or reframe)

---

## A/B Testing Framework

Once you have baseline data, test variations:

### Test 1: Question Wording
**Hypothesis:** "When was the last time you took money out?" gets deeper answers than "Do you ever withdraw wins?"

**Run:** Half new members get Q1 version, half get Q2 version. Measure response depth and downstream action rate.

**Metric:** Do more detailed answers correlate to higher action rate?

---

### Test 2: Response Length
**Hypothesis:** Shorter responses (2-3 sentences) drive more action than longer explanations.

**Run:** Test a condensed version vs. the full template for one pain area (e.g., profit taking).

**Metric:** Does shorter message → higher bankroll input rate?

---

### Test 3: CTA Variation
**Hypothesis:** "Want me to set that up?" (personal offer) drives more action than "Click this link" (self-service).

**Run:** Alternate which pain areas get which CTA.

**Metric:** Does personal offer increase action rate?

---

### Test 4: Pain Area Ordering
**Hypothesis:** Starting with profit taking (easiest pain to connect to action) gets higher overall completion than starting with taxes (hardest).

**Run:** Randomize question order for new cohort. Measure completion rate and actions.

**Metric:** Does question sequence affect conversion?

---

## Reporting Cadence

### Daily (Real-Time Tracking)
- New members joined
- Welcome tickets sent
- Actions taken (by type)
- Churn flags (no action by day 3)

### Weekly (End of Week 1)
- Total new members
- Total actions (and breakdown by type)
- Conversion rate (% who took at least 1 action)
- Top pain areas identified
- Churn risk list (re-engagement candidates)

### Bi-Weekly (End of Week 2 / Pilot Complete)
- Channel attribution (which invite link converts best)
- Pain area → action correlation
- Response template performance (which one drove most action?)
- Comparison: expected vs. actual conversion rates
- Recommendation: scale, iterate, or pivot

---

## Data Architecture

### Required Tracking

Create a table in `dax-personal` or `manual` to log welcome ticket interactions:

```sql
CREATE TABLE welcome_ticket_log (
  id SERIAL PRIMARY KEY,
  user_id BIGINT,
  join_source_code VARCHAR(50),
  join_source_domain VARCHAR(100),
  welcome_ticket_sent_at TIMESTAMP,
  pain_areas_identified TEXT[], -- array of ["profit_taking", "hedging", etc.]
  response_template_used VARCHAR(50),
  action_taken VARCHAR(50), -- "partner_signup", "bankroll_input", "ev_alerts", "bet_tracking", "none"
  action_timestamp TIMESTAMP,
  days_to_action INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Data Sources

- **User ID + join source:** Already in `private."Users"` (latest_discord_join_method)
- **Invite code mapping:** `manual.activeInvites` (code → domain → owner)
- **Partner signups:** Partner bot database (Zach owns this)
- **Bankroll inputs:** Bankroll tracker database (integrated or separate)
- **EV alerts:** Discord notification logs (Zach owns this)
- **Bet tracking:** OddsJam API logs or manual logging (depends on integration)

---

## Success Thresholds for Scaling

**If pilot hits these targets, scale acquisition:**

| Metric | Target | Action |
|--------|--------|--------|
| Overall conversion rate | 55%+ | Scale all channels evenly |
| Personal invite conversion | 70%+ | Double budget on personal invites |
| Partner signup rate | 35%+ | Increase partner promotion frequency |
| Bankroll input rate | 25%+ | Emphasize bankroll setup in welcome message |
| Source quality disparity | >30% gap between best/worst | Cut worst channel, reallocate budget |

**If pilot misses targets:**

- Iterate on question wording (clarify pain discovery)
- Test different response templates (better routing)
- Extend pilot to 3 weeks (more data)
- Interview churned members (why no action?)

---

## Example: Week 2 Report Template

```
Welcome Ticket Pilot — Week 2 Summary

NEW MEMBERS: 97 total
CONVERSION RATE: 62% (60 engaged members)

Breakdown by action:
- Partner signups: 32 (33%)
- Bankroll input: 24 (25%)
- EV alerts opt-in: 31 (32%)
- Bet tracking: 18 (19%)

By source:
- Luke personal invite: 8 total → 7 engaged (88%)
- Hive Index promo: 34 total → 18 engaged (53%)
- Server discovery: 22 total → 5 engaged (23%)
- Website join button: 18 total → 13 engaged (72%)
- DraftKings partnership: 15 total → 12 engaged (80%)

Pain area insights:
- Profit taking → bankroll input: 85% conversion
- Hedging confusion → EV alerts: 70% conversion
- No tracking → bet logging: 45% conversion (friction point?)

Recommendation: Personal invites and partnership channels are high quality. Server discovery underperforming — consider pausing or retargeting.

Next iteration: Test shorter responses on hedging pain area (currently 50% action rate, should be higher).
```

---

*Last updated: March 3, 2026*  
*Pilot begins: March 4, 2026*  
*Results ready: March 17, 2026*
