# Calibration Analysis Strategy

**Date:** 2026-03-02
**Author:** YodAI

---

## The Core Problem

OddsJam and DGF produce two signals per alert:
- **EV** — their model's implied edge (e.g. 2.17)
- **oddsToHit** — their confidence score on the outcome

These are black box outputs. We cannot reverse engineer what internal factors they used to arrive at them (sharp line comparison, market consensus, their model weights, etc.). Trying to decompose them is a dead end.

What we *can* do is empirically validate them — treat each value as its own category and measure what actually happens when the provider says that value.

---

## The Key Insight

**EV 2.16 and EV 2.17 are not points on a linear scale.**

They are independent categories that each need their own empirical validation. EV 2.17 does not mean "marginally better than 2.16." It means "here is what the provider's model output when it saw this specific market." Whether that output is accurate, miscalibrated, or only accurate under certain conditions is an empirical question — not something we can infer from the number alone.

The same logic applies to oddsToHit.

---

## The Framework

### Two layers

**Layer 1 — Base signals (black box, accept as-is)**
- EV bucket (exact value, e.g. 2.17)
- oddsToHit bucket (exact value or small range)

**Layer 2 — Observable factors (what we can see and segment by)**
- American odds (the actual line — -110, -120, +150, etc.)
- Bet size recommendation ($10-20, $20-50, $50+)
- Sportsbook (DraftKings, FanDuel, PrizePicks, etc.)
- betType (Player Rebounds, Shots On Goal, Made Threes, etc.)
- Line value (1.5, 2.5, 3.5, etc.)
- Sport / league (NBA, NHL, NFL, MLB)
- Direction (Over / Under)
- Alert provider (OddsJam vs DGF)

### The question for every combination

> "Given that the provider said EV X.XX, does the actual win rate change depending on these observable factors — and which combinations consistently outperform?"

---

## What the Analysis Produces

### Step 1 — EV calibration curve

For each EV bucket, pull all historical alerts with that value, join with EVActualStat, calculate actual win rate.

```sql
SELECT
  e."EV",
  COUNT(*) AS total_alerts,
  COUNT(s.id) AS outcomes_tracked,
  ROUND(
    100.0 * SUM(CASE
      WHEN e."betPrediction" ILIKE '%Over%'
        AND s."actualStat" > CAST(SPLIT_PART(e."betPrediction", 'Over ', 2) AS numeric)
      THEN 1
      WHEN e."betPrediction" ILIKE '%Under%'
        AND s."actualStat" < CAST(SPLIT_PART(e."betPrediction", 'Under ', 2) AS numeric)
      THEN 1
      ELSE 0
    END) / NULLIF(COUNT(s.id), 0),
  4) AS actual_wr,
  -- provider implied win rate derived from EV and odds (for comparison)
  ROUND(AVG(e."oddsToHit"), 4) AS avg_odds_to_hit
FROM private."EVAlertEvent" e
LEFT JOIN manual."EVActualStat" s ON s.id = e.id
GROUP BY e."EV"
HAVING COUNT(s.id) >= 30
ORDER BY e."EV";
```

This produces the calibration curve — provider-implied win rate vs. actual win rate at each EV level.

**What we're looking for:**
- EV buckets where actual WR consistently exceeds the implied WR → provider is underconfident, these are better bets than they appear
- EV buckets where actual WR is below implied WR → provider is overconfident, these are worse than they appear
- EV buckets where the model is well-calibrated → trust the signal as-is

---

### Step 2 — Layer in observable factors

For each EV bucket that shows promise, segment by the observable factors to find where performance is strongest.

**Example: EV = 2.17, segmented by bet size recommendation**

```sql
SELECT
  e."betSizeRecommendationFor1kBankroll" AS bet_size,
  COUNT(*) AS total,
  ROUND(
    100.0 * SUM(CASE
      WHEN e."betPrediction" ILIKE '%Over%'
        AND s."actualStat" > CAST(SPLIT_PART(e."betPrediction", 'Over ', 2) AS numeric)
      THEN 1 ELSE 0
    END) / NULLIF(COUNT(s.id), 0),
  2) AS actual_wr
FROM private."EVAlertEvent" e
JOIN manual."EVActualStat" s ON s.id = e.id
WHERE e."EV" = 2.17
GROUP BY e."betSizeRecommendationFor1kBankroll"
ORDER BY actual_wr DESC;
```

Repeat this segmentation for: sportsbook, betType, odds range, line value, sport.

---

### Step 3 — oddsToHit calibration

Same analysis as Step 1 but for oddsToHit as the base signal.

Then cross-tab: for a given (EV bucket × oddsToHit bucket) combination, what is the actual win rate? This tells you whether both signals together are more predictive than either alone.

---

### Step 4 — Identify the winning combinations

The output of Steps 1-3 is a table of combinations ranked by actual win rate, sample size, and edge over break-even. This becomes the lookup table for the scoring function — not an arbitrary set of weights, but empirically derived rules:

| EV | oddsToHit range | Bet size range | Sportsbook | Actual WR | Sample | Edge vs break-even |
|---|---|---|---|---|---|---|
| 2.17 | 0.52-0.55 | $20-$50 | PrizePicks | 65.2% | 87 | +12.8% |
| 2.17 | 0.52-0.55 | $10-$20 | PrizePicks | 48.1% | 43 | -4.3% |
| 3.10 | 0.58-0.62 | $20-$50 | ESPN BET | 57.4% | 62 | +5.0% |
| ... | | | | | | |

(Values above are illustrative — actual values come from running the analysis)

---

## What This Is Not

- This is **not** building an algorithm
- This is **not** assuming the EV signal is accurate
- This is **not** assuming higher EV = better bet
- This is **not** a model that predicts future outcomes

This is an **empirical map** of where the providers' signals have historically been reliable, and under what observable conditions. The algorithm comes after this map exists.

---

## What We Need to Run This

1. **EVActualStat coverage** — enough outcome rows per EV bucket (minimum 30 per segment)
2. **The coverage audit** (see research-gaps.md) to know which EV ranges have sufficient data
3. **Clean win/loss logic** for each betType (Over/Under, Moneyline, Puck Line — each parsed differently)
4. **Time** — more alerts + outcomes = more reliable calibration curves

---

## Why This Comes Before the Algorithm

The scoring function in ev-alert-agent-plan.md uses arbitrary weights derived from one sport's analysis. This calibration study replaces those arbitrary weights with empirically derived ones.

Once this map exists, the algorithm is just: look up the incoming alert's (EV × oddsToHit × bet size × sportsbook) combination in the table, check if the historical edge is positive with sufficient sample, flag BET or PASS.

The algorithm becomes a lookup, not a model. Much simpler and more trustworthy.

---

## Open Questions

- Does oddsToHit represent the provider's implied probability directly, or is it scaled/transformed?
- Are EV values continuous (infinite precision) or do they cluster at specific values?
- Is there a minimum EV threshold below which the provider doesn't send alerts at all?
- Does the relationship between EV and actual WR differ between OddsJam and DGF for the same betType?
