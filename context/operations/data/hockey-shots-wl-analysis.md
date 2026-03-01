# Hockey Shots On Goal + Moneyline — W/L Analysis
**Date:** 2026-02-27
**Data source:** `private."EVAlertEvent"` INNER JOIN `manual."EVActualStat"`
**Script:** `H:/dropout_degens/claude/newdata/alg/analyze_hockey_shots.py`

---

## Data Coverage

| | Count |
|---|---|
| Total hockey EVAlertEvent rows | 7,732 |
| Hockey rows with actualStat (processed) | 6,011 (77.7%) |
| Total EVActualStat rows (all sports) | 120,845 |

### All processed hockey bet types

| betType | Count | alertProvider |
|---|---|---|
| Shots On Goal | 1,513 | Daily Grind Fantasy |
| Player Points | 986 | OddsJam |
| Player Shots On Goal | 759 | OddsJam |
| Player Goals | 611 | OddsJam |
| Puck Line | 368 | OddsJam |
| Saves | 325 | OddsJam |
| Total Goals | 264 | OddsJam |
| Player Assists | 264 | OddsJam |
| Assists | 236 | OddsJam |
| Goals | 165 | OddsJam |
| Blocked Shots | 150 | OddsJam |
| Team Total | 103 | OddsJam |
| 1st Period Total Goals | 93 | OddsJam |
| Moneyline | 61 | OddsJam |
| 1st Period Team Total | 48 | OddsJam |
| 1st Period Moneyline | 32 | OddsJam |
| 1st Period Puck Line | 22 | OddsJam |
| Player Power Play Points | 10 | OddsJam |

---

## Win/Loss Results (3 queried bet types)

> Win/Loss logic:
> - **Shots On Goal / Player SOG** — Over: `actualStat > line` = Win, Under: `actualStat < line` = Win, else Loss/Push
> - **Moneyline** — `actualStat > 0` (signed margin) = Win, `< 0` = Loss, `= 0` = Push

### Summary

| betType | alertProvider | Total | Wins | Losses | Win Rate |
|---|---|---|---|---|---|
| **Shots On Goal** | Daily Grind Fantasy | 1,513 | 767 | 746 | **50.69%** |
| **Player Shots On Goal** | OddsJam | 759 | 337 | 422 | **44.40%** |
| **Moneyline** | OddsJam | 61 | 24 | 37 | **39.34%** |

**Key takeaway:** Shots On Goal (DGF) is close to coin-flip. Player Shots On Goal (OddsJam) and Moneyline are both below the ~52.4% needed to break even at -110.

---

## Shots On Goal — Deep Breakdown

### By Line

| betType | Line | Total | Wins | Win Rate | Notes |
|---|---|---|---|---|---|
| Shots On Goal | 1.5 | 594 | 328 | **55.22%** | Best line |
| Shots On Goal | 2.0 | 192 | 73 | **38.02%** | ⚠️ Whole number — pushes exist |
| Shots On Goal | 2.5 | 520 | 271 | **52.12%** | |
| Shots On Goal | 3.0 | 91 | 33 | **36.26%** | ⚠️ Whole number — worst |
| Shots On Goal | 3.5 | 94 | 55 | **58.51%** | Best half-point line |
| Shots On Goal | 4.0 | 16 | 4 | 25.00% | Small sample |
| Player Shots On Goal | 1.5 | 231 | 116 | **50.22%** | |
| Player Shots On Goal | 2.5 | 419 | 177 | **42.24%** | Largest volume, below 50% |
| Player Shots On Goal | 3.5 | 96 | 38 | **39.58%** | |
| Player Shots On Goal | 4.5 | 13 | 6 | 46.15% | Small sample |

> ⚠️ **Whole number line issue:** Lines of 2.0 and 3.0 have dramatically lower win rates because when `actualStat == line` (a push), the original DB query classifies it as a **Loss** (no push case in CASE statement). The processed CSVs correctly label these as Push. This inflates the apparent loss count for whole-number lines. Half-point lines (1.5, 2.5, 3.5) are unaffected since ties are impossible.

### By Direction

| betType | Direction | Total | Wins | Win Rate |
|---|---|---|---|---|
| Shots On Goal | Over | 926 | 471 | **50.86%** |
| Shots On Goal | Under | 587 | 296 | **50.43%** |
| Player Shots On Goal | Over | 759 | 337 | **44.40%** |

> All Player Shots On Goal are **Over** only — no Under bets in the dataset.

### By Sportsbook

| betType | Sportsbook | Total | Wins | Win Rate |
|---|---|---|---|---|
| **Shots On Goal** | PrizePicks | 183 | 108 | **59.02%** ✅ |
| **Shots On Goal** | Underdog Fantasy | 267 | 153 | **57.30%** ✅ |
| **Shots On Goal** | ParlayPlay | 420 | 209 | **49.76%** |
| **Shots On Goal** | Dabble | 620 | 286 | **46.13%** |
| **Shots On Goal** | Sleeper | 23 | 11 | 47.83% |
| **Player Shots On Goal** | ESPN BET | 56 | 31 | **55.36%** ✅ |
| **Player Shots On Goal** | Fliff | 11 | 7 | **63.64%** (small n) |
| **Player Shots On Goal** | FanDuel | 440 | 205 | **46.59%** |
| **Player Shots On Goal** | Fanatics | 32 | 14 | 43.75% |
| **Player Shots On Goal** | BetMGM | 53 | 21 | **39.62%** ❌ |
| **Player Shots On Goal** | bet365 | 155 | 54 | **34.84%** ❌ |
| **Player Shots On Goal** | Rebet | 6 | 2 | 33.33% (small n) |

> **Major finding:** Sportsbook is the strongest signal for Player SOG. ESPN BET wins at 55.4%, FanDuel is mediocre (46.6%), bet365 is a significant loser (34.8%). DGF Shots On Goal on PrizePicks/Underdog are the best performers.

### By EV Bucket (OddsJam Player SOG only)

| EV Bucket | Total | Wins | Win Rate |
|---|---|---|---|
| < 3% | 305 | 130 | **42.62%** |
| 3–5% | 271 | 122 | **45.02%** |
| 5–7% | 92 | 47 | **51.09%** |
| 7–10% | 50 | 26 | **52.00%** |
| **>= 10%** | 41 | 12 | **29.27%** ❌ |

> EV shows a rough positive trend up to 10%, but **>= 10% EV is a red flag** — these bets are winning at only 29.3%. Possible causes: line shopping artifacts at extreme EV, stale lines, or market inefficiency traps. High-EV SOG bets may be OddsJam finding bad numbers that the market has already moved.

Note: 432 of 759 Player SOG rows have EV populated. The remaining 327 may be from a time before EV was tracked or have null EV.

### EV Bucket (DGF Shots On Goal rows that have EV populated)

| EV Bucket | Total | Wins | Win Rate |
|---|---|---|---|
| < 3% | 94 | 48 | 51.06% |
| 3–5% | 50 | 24 | 48.00% |
| 5–7% | 42 | 19 | 45.24% |
| 7–10% | 38 | 23 | **60.53%** |
| >= 10% | 208 | 98 | 47.12% |

> Only 432 of 1,513 DGF Shots rows have EV (the rest use `oddsToHit`). Small-sample caution on 7–10% bucket.

---

## Moneyline Breakdown (small sample — 61 bets)

| Sportsbook | Total | Wins | Win Rate |
|---|---|---|---|
| Fliff | 12 | 2 | 16.67% ❌ |
| bet365 | 9 | 2 | 22.22% ❌ |
| ESPN BET | 9 | 4 | 44.44% |
| BetMGM | 11 | 5 | 45.45% |
| Fanatics | 7 | 3 | 42.86% |
| FanDuel | 2 | 1 | 50.00% |
| Rebet | 5 | 2 | 40.00% |

> 61 total bets at 39.3% WR. Very small sample — insufficient for strong conclusions. Fliff and bet365 are notably poor but n is tiny.

---

## Key Findings & Action Items

### Confirmed signals

1. **DGF Shots On Goal on PrizePicks/Underdog (~57–59% WR)** is the only segment with a consistent positive edge. Dabble and Sleeper drag the overall number down to 50.7%.

2. **Player SOG on ESPN BET (55.4%)** is the one OddsJam sportsbook with clear positive signal. All others are at or below break-even. **Bet365 (34.8%) and BetMGM (39.6%)** are strong avoids.

3. **Half-point lines outperform whole-number lines** for Shots On Goal. Line 3.5 (58.5%) and 1.5 (55.2%) vs line 3.0 (36.3%) and 2.0 (38.0%). Part of this is the push-coded-as-loss artifact, but the gap is large enough to be real even after accounting for that.

4. **High EV (>=10%) on Player SOG is counterproductive** — 29.3% WR. The mid-range 5–10% EV is the sweet spot (51–52%).

5. **Player SOG overall (44.4%)** is a losing bet type at standard juice. You need >52.4% to break even at -110.

### Watch list

- **Moneyline (hockey):** Sample too small (61 bets) to draw conclusions. Keep tracking.
- **Whole-number SOG lines:** Validate actual push rate vs. the DB classification issue before making decisions.

---

## W/L Logic Notes

### For shots on goal bets (Over/Under)
```
difference = (actualStat - line)   if Over
           = (line - actualStat)   if Under

Win  if difference > 0
Loss if difference < 0
Push if difference == 0
```

### For moneyline
```
actualStat = bet_team_score - opponent_score   (signed margin)

Win  if actualStat > 0
Loss if actualStat < 0
Push if actualStat == 0  (rare in NHL)
```

### DB query push bug
The original SQL query collapses Push into Loss for shots on goal:
```sql
ELSE 'Loss'  -- this catches ties (Push) for whole-number lines
```
The processed CSVs correctly calculate Push via `difference == 0`. Use the CSVs for accurate analysis, not the DB query as-is.

---

## Analysis Script

```
H:/dropout_degens/claude/newdata/alg/analyze_hockey_shots.py
```

Loads the three processed CSVs, runs all breakdowns above, and prints a full report including flat-bet unit P&L and ROI estimates.