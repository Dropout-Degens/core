# EVAlert Agent — Architecture Plan

**Date:** 2026-03-02
**Author:** YodAI

---

## Background

Dropout Degens receives ~5,000+ EV alerts per day across two providers:
- **OddsJam** — ~3 alerts/minute
- **Daily Grind Fantasy (DGF)** — ~3 alerts/5 minutes

All alerts are stored in `private."EVAlertEvent"` in Supabase (dropout-degens project, us-west-1).
Actual outcomes are stored in `manual."EVActualStat"` (~120,845 rows as of March 2026).

Running Claude on every alert is not cost-viable. The agent runs on a schedule and batch-processes alerts.

---

## Data Model

### Existing tables

**`private."EVAlertEvent"`**
```
id, alertProvider, sport, league, game, EV, oddsToHit, sportsbook,
eventTime, receivedTime, odds, betSizeRecommendationFor1kBankroll,
betType, betPrediction, playerName, playerPrediction, playerLine
```

**`manual."EVActualStat"`**
```
id          -- FK → EVAlertEvent.id
actualStat  -- actual result (numeric, 1 decimal place)
```

**`private."EVAlertPlacedBet"`**
- Tracks placed bets with reported status and units wagered

### New table to create

**`private."EVAlertDecision"`**
```sql
CREATE TABLE private."EVAlertDecision" (
  id                      BIGINT PRIMARY KEY,      -- FK → EVAlertEvent.id
  decision                TEXT NOT NULL,           -- 'BET' | 'PASS' | 'INSUFFICIENT_DATA'

  -- Composite score and full breakdown
  score                   NUMERIC,                 -- final composite score (0-100)
  score_edge_component    NUMERIC,                 -- pts added/removed from historical edge
  score_ev_component      NUMERIC,                 -- pts added from raw EV signal
  score_sportsbook_component NUMERIC,              -- pts from sportsbook modifier
  score_line_component    NUMERIC,                 -- pts from line type (half vs whole)

  -- Signal values at time of decision
  ev_bucket               NUMERIC,                 -- EV value from alert (e.g. 2.17)
  odds_to_hit_bucket      NUMERIC,                 -- oddsToHit value from alert
  break_even              NUMERIC,                 -- calculated break-even at those odds
  edge                    NUMERIC,                 -- historical_wr - break_even

  -- Historical context used
  historical_wr           NUMERIC,                 -- win rate from EVActualStat join
  sample_size             INTEGER,                 -- # historical outcomes used

  -- Human-readable reason
  reasoning               TEXT,                    -- what drove the decision (e.g. "edge +5.2%, PrizePicks +10, half-line +5")

  -- Paper trading
  paper_trade             BOOLEAN DEFAULT true,    -- true until live mode is enabled
  paper_stake             NUMERIC,                 -- bet size that would have been placed
  paper_odds              INTEGER,                 -- American odds at time of decision
  paper_prophetx_line_id  TEXT,                    -- ProphetX line_id if market was found
  paper_result            TEXT,                    -- 'WIN' | 'LOSS' | 'PUSH' | 'PENDING'
  paper_pnl               NUMERIC,                 -- calculated P&L after outcome resolves

  -- Live execution (populated when paper_trade = false)
  kalshi_placed           BOOLEAN DEFAULT false,
  kalshi_order_id         TEXT,
  prophetx_placed         BOOLEAN DEFAULT false,
  prophetx_wager_id       TEXT,

  processed_at            TIMESTAMPTZ DEFAULT now()
);
```

---

## Agent Architecture

### Design principle

SQL and Python do the scoring. Claude is called once per run to generate a human-readable Telegram summary. This keeps API costs near zero.

```
run() →
  Step 1 [SQL]    Pull unprocessed EVAlertEvents
                  WHERE eventTime > now() AND id NOT IN EVAlertDecision

  Step 2 [SQL]    Compute historical context per unique (betType, direction, sportsbook)
                  JOIN EVAlertEvent × EVActualStat
                  → historical_wr, sample_size

  Step 3 [Python] Score each alert using deterministic scoring function
                  → decision (BET | PASS | INSUFFICIENT_DATA), score 0-100

  Step 4 [SQL]    Bulk INSERT all decisions into EVAlertDecision

  Step 5 [Haiku]  ONE Claude call — generate Telegram summary of BET decisions only

  Step 6 [Telegram] Send summary to Dax's chat

  Step 7 [Kalshi] Attempt to auto-place BET decisions where Kalshi market exists
```

---

## Scoring Function

```python
def score_alert(ev, odds, historical_wr, sample_size, sportsbook, line):
    # Minimum sample gate — only bet with historical data
    if sample_size < 30:
        return 0, "INSUFFICIENT_DATA"

    # Break-even threshold at given odds
    if odds < 0:
        break_even = abs(odds) / (abs(odds) + 100)   # e.g. -110 → 52.38%
    else:
        break_even = 100 / (odds + 100)              # e.g. +150 → 40.00%

    edge = historical_wr - break_even
    score = 0

    # Historical edge — primary signal
    if edge >= 0.05:    score += 40
    elif edge >= 0.02:  score += 20
    elif edge >= 0:     score += 5
    else:               score -= 30    # losing market → PASS

    # Raw EV signal from alert provider
    if 0.05 <= ev <= 0.10:  score += 20
    elif ev < 0.05:          score += 10
    else:                    score += 15  # >10% EV is suspicious — see hockey data

    # Sportsbook modifier (from hockey W/L analysis)
    sportsbook_bonus = {
        "PrizePicks": 10, "Underdog": 10, "ESPN BET": 5,
        "bet365": -10, "BetMGM": -10,
    }.get(sportsbook, 0)
    score += sportsbook_bonus

    # Line type modifier (whole number lines inflate push as loss in DB)
    if line == int(line):  # e.g. 2.0, 3.0
        score -= 10
    else:                  # e.g. 1.5, 2.5, 3.5
        score += 5

    decision = "BET" if score >= 50 else "PASS"
    return score, decision
```

---

## Schedule

Registered in `bot.py` via APScheduler. Three runs per day to cover different game windows:

| Job | Time (EST) | Covers |
|---|---|---|
| `morning_batch` | 09:00 | Afternoon games |
| `afternoon_batch` | 14:00 | Evening NBA/NHL |
| `night_batch` | 19:00 | Late night games |

---

## Historical Win Rate Query Pattern

```sql
SELECT
  e."betType",
  CASE WHEN e."betPrediction" ILIKE '%Over%' THEN 'Over' ELSE 'Under' END AS direction,
  e.sportsbook,
  COUNT(*) AS sample_size,
  ROUND(
    100.0 * SUM(CASE
      WHEN e."betPrediction" ILIKE '%Over%'
        AND s."actualStat" > CAST(SPLIT_PART(e."betPrediction", 'Over ', 2) AS numeric)
      THEN 1
      WHEN e."betPrediction" ILIKE '%Under%'
        AND s."actualStat" < CAST(SPLIT_PART(e."betPrediction", 'Under ', 2) AS numeric)
      THEN 1
      ELSE 0
    END) / COUNT(*), 4
  ) AS historical_wr
FROM private."EVAlertEvent" e
JOIN manual."EVActualStat" s ON s.id = e.id
GROUP BY e."betType", direction, e.sportsbook
HAVING COUNT(*) >= 30
ORDER BY historical_wr DESC;
```

---

## Known Profitable Signals (as of March 2026)

| betType | Provider | Line | Win Rate | Break-even (-110) | Edge |
|---|---|---|---|---|---|
| Shots On Goal | DGF | 1.5 | 55.22% | 52.38% | +2.84% |
| Shots On Goal | DGF | 3.5 | 58.51% | 52.38% | +6.13% |
| Shots On Goal | DGF | 2.5 | 52.12% | 52.38% | -0.26% |

**Known losing signals:**
- Player Rebounds (OddsJam): 30.0% WR vs 52.38% break-even → avoid
- Player Shots On Goal (OddsJam): 44.40% WR → below break-even
- Moneyline hockey (OddsJam): 39.34% WR → avoid

**Data gaps:**
- Player Made Threes (OddsJam): 3,971 alerts, 0 outcomes in EVActualStat → INSUFFICIENT_DATA
- Many bet types have no EVActualStat coverage — expanding this is a parallel priority

---

## New Files to Create in claudebot

```
claudebot/
├── schedules/
│   └── betting/
│       ├── __init__.py
│       └── ev_alert_processor.py    ← main scheduled agent
├── connections/
│   └── kalshi/
│       ├── __init__.py              ← Kalshi API client
│       └── README.md
│   └── prophetx/
│       ├── __init__.py              ← ProphetX Market Maker API client
│       └── README.md
```

---

## Cost Estimate

| Item | Monthly Cost |
|---|---|
| Claude Haiku (3 runs/day × 30 days, ~1k tokens/run) | ~$2-5 |
| YodAI Telegram conversations | ~$5-10 |
| Supabase (existing) | existing |
| **Total** | **~$10-20/month** |

At DGF SOG 1.5-line edge (+2.84%), $10/bet, ~3 bets/day:
- Expected value per bet: +$0.28
- Monthly EV: ~$25
- Breakeven: ~40-70 profitable bets/month

---

## Paper Trading

Paper trading runs before any live execution. Every BET decision is logged to `EVAlertDecision` with `paper_trade = true`. No money moves. The goal is to validate the scoring function forward in time before trusting it with real capital.

### What gets tracked per paper trade

| Field | What it captures |
|---|---|
| `score` | Final composite score that drove the BET decision |
| `score_edge_component` | How much the historical edge contributed |
| `score_ev_component` | How much the raw EV signal contributed |
| `score_sportsbook_component` | Sportsbook modifier applied |
| `score_line_component` | Line type modifier applied |
| `ev_bucket` | The exact EV value from the alert |
| `odds_to_hit_bucket` | The exact oddsToHit from the alert |
| `break_even` | Break-even threshold calculated from odds |
| `edge` | The historical edge that triggered BET |
| `reasoning` | Plain text: e.g. "edge +5.2% (+40), EV 2.17 (+20), PrizePicks (+10), half-line (+5) = 75" |
| `paper_stake` | Bet size that would have been placed |
| `paper_odds` | American odds at time of decision |
| `paper_prophetx_line_id` | ProphetX line ID if a matching market was found |
| `paper_result` | WIN / LOSS / PUSH — filled in when EVActualStat resolves |
| `paper_pnl` | Calculated P&L after outcome: win = `stake * 100/|odds|`, loss = `-stake` |

### How paper results get resolved

When a new `EVActualStat` row is inserted for an alert ID that has a `paper_trade = true` decision in `EVAlertDecision`, the processor back-fills `paper_result` and `paper_pnl`.

This creates a continuous feedback loop:
```
Alert fires → scored → BET logged as paper trade
          ↓
Game plays → EVActualStat updated
          ↓
Processor resolves paper_result + paper_pnl
          ↓
Weekly P&L summary sent to Telegram
```

### Paper trade P&L query

```sql
SELECT
  d.decision,
  d.ev_bucket,
  d.reasoning,
  e."betType",
  e.sportsbook,
  e.odds,
  d.paper_stake,
  d.paper_result,
  d.paper_pnl,
  d.processed_at
FROM private."EVAlertDecision" d
JOIN private."EVAlertEvent" e ON e.id = d.id
WHERE d.paper_trade = true
  AND d.decision = 'BET'
ORDER BY d.processed_at DESC;
```

### Weekly paper P&L rollup

```sql
SELECT
  DATE_TRUNC('week', d.processed_at) AS week,
  COUNT(*) FILTER (WHERE d.paper_result = 'WIN') AS wins,
  COUNT(*) FILTER (WHERE d.paper_result = 'LOSS') AS losses,
  COUNT(*) FILTER (WHERE d.paper_result = 'PUSH') AS pushes,
  COUNT(*) FILTER (WHERE d.paper_result = 'PENDING') AS pending,
  ROUND(SUM(d.paper_pnl), 2) AS total_pnl,
  ROUND(AVG(d.score), 1) AS avg_score
FROM private."EVAlertDecision" d
WHERE d.paper_trade = true AND d.decision = 'BET'
GROUP BY week
ORDER BY week DESC;
```

### When to go live

Paper trading runs until:
1. Minimum 4 weeks of forward data
2. At least 50 resolved BET decisions (WIN/LOSS/PUSH)
3. Net paper P&L is positive
4. The score breakdown shows the edge component is the dominant driver (not the EV or sportsbook modifiers carrying it)

If any of those conditions aren't met after 8 weeks, the calibration study needs to be re-run with updated data before going live.

---

## Build Order

1. Create `EVAlertDecision` table in Supabase
2. Build `schedules/betting/ev_alert_processor.py` with `run()`
3. Register 3 daily jobs in `bot.py`
4. Expose `EVAlertDecision` in `query_private` so YodAI can answer "what did we bet today?" and "what's our paper P&L this week?"
5. Build `connections/prophetx/` — paper trading mode only (sandbox or intercept to Supabase)
6. Add paper result resolution logic — back-fill `paper_result` + `paper_pnl` when EVActualStat updates
7. Weekly Telegram P&L summary from the rollup query
8. Build `connections/kalshi/` — auto-place for game-level markets
9. Telegram inline buttons: `✅ Placed` / `❌ Skipped` → log to `EVAlertPlacedBet`
10. Flip `paper_trade = false` when go-live criteria are met
