# Research Gaps — EVAlert Betting Agent

**Date:** 2026-03-02
**Author:** YodAI

---

## My Research Gaps

Things identified but not researched deeply enough yet.

### Novig Market Coverage
- Confirmed API exists (docs.novig.us, self-serve access) but never investigated actual market/prop depth
- Don't know if their available lines overlap with DD's EVAlertEvent betTypes
- Could be better or worse than ProphetX for our use case — unknown

### ProphetX Market Overlap
- Know the API endpoints and auth flow
- Don't know if ProphetX actually offers the specific betTypes in our alerts (e.g. SOG 1.5, rebounds, made threes)
- If the overlap is low, the entire execution layer needs a different platform

### OddsJam vs DGF Alert Quality
- DGF SOG performs well (55.22% WR at 1.5 line)
- OddsJam rebounds perform poorly (30% WR)
- Never investigated *why* — is DGF's EV model better calibrated? Are they targeting different markets? Different sharpness of the line they're comparing against?
- This distinction matters for which provider's alerts to prioritize

### Closing Line Value (CLV)
- Standard sharp betting metric — did the alert capture value relative to where the line closed?
- If alert fires at -110 and closes at -130, you captured value
- If alert fires at -110 and closes at -105, you likely didn't
- No data on this at all — would require pulling closing lines and comparing to alert receipt time

### Alert Timing to Game Start
- No analysis of how far in advance alerts typically fire before game start
- If a betType consistently alerts 10 minutes before tip-off, there's no time to act
- If it alerts 6+ hours out, the batch schedule works fine
- Need distribution of (eventTime - receivedTime) by betType and provider

---

## System / Data Gaps

### EVActualStat Coverage Audit — Most Critical Gap
We know:
- Player Made Threes: 3,971 alerts, **0 outcomes tracked**
- Hockey SOG: 77.7% covered (6,011 of 7,732)
- Total EVActualStat rows: ~120,845

We don't know:
- What % of ALL betTypes across ALL sports have outcome coverage
- Which betTypes have enough outcomes (≥30) to be statistically usable
- How many total alerts exist with zero outcome data

This audit needs to exist before any agent runs. Without it, the scoring function is operating blind.

**SQL needed:**
```sql
SELECT
  e."betType",
  e."alertProvider",
  e.sport,
  COUNT(e.id) AS total_alerts,
  COUNT(s.id) AS outcomes_tracked,
  ROUND(100.0 * COUNT(s.id) / COUNT(e.id), 1) AS coverage_pct,
  CASE WHEN COUNT(s.id) >= 30 THEN 'usable' ELSE 'insufficient' END AS status
FROM private."EVAlertEvent" e
LEFT JOIN manual."EVActualStat" s ON s.id = e.id
GROUP BY e."betType", e."alertProvider", e.sport
ORDER BY total_alerts DESC;
```

### Scoring Function Is Unvalidated
- The weights proposed (EV modifier, sportsbook bonus, line type modifier, score thresholds) are directionally reasonable but arbitrary
- Based on a single sport's analysis (hockey) — not backtested across NBA, NFL, MLB, etc.
- Need to backtest: apply the scoring function to historical alerts and check if BET decisions actually outperform PASS decisions in EVActualStat

### Overall System Profitability Unknown
Currently confirmed:
- DGF SOG 1.5-line: +2.84% edge (55.22% WR) ✅
- DGF SOG 3.5-line: +6.13% edge (58.51% WR) ✅ (small sample)
- Player Rebounds (OddsJam): -22.4% edge (30% WR) ❌
- OddsJam Player SOG: -7.98% edge (44.40% WR) ❌
- Hockey Moneyline (OddsJam): -13.04% edge (39.34% WR) ❌

Unknown: win rates for NBA props, NFL props, MLB props, and most OddsJam betTypes.

The fundamental question — is the EV alert system profitable at the portfolio level — is not answered.

### Line Movement Between Alert and Execution
- Alerts fire, then odds move
- Batch runs 3x/day means some alerts are hours old before processing
- No data on how much lines move between receivedTime and a realistic execution time
- A bet that was +2% EV at alert time could be -1% EV by execution

### Alert Deduplication
- OddsJam and DGF both fire alerts — likely overlap on popular props
- EVAlertEvent probably has two rows for the same underlying bet when both providers cover it
- Scoring agent would flag both as BET → double-sizing a position unknowingly
- No deduplication logic exists yet

### EVActualStat Pipeline Is Manual
- Currently: Google Sheets CSV export → manual import to Supabase
- If the agent flags BETs on betTypes with no outcome tracking, the feedback loop never closes
- No automation exists for fetching actual stats post-game
- The fetch script pattern exists (example_fetch_script.py) for basketball/hockey via ESPN API, but it's not running automatically

---

## Gaps That Need Answers from Dax

| Question | Why It Matters |
|---|---|
| What state are you in? | Determines which platforms (ProphetX, Novig, Kalshi) are actually available |
| What's the bankroll? | Kelly sizing, cost breakeven math, max bet limits all depend on this |
| ProphetX or Novig account yet? | No credentials = no sandbox testing = can't validate execution layer |
| Who runs the EVActualStat pipeline? | If manual, the feedback loop has a human bottleneck that limits how fast the agent can learn |
| Is there a plan to automate outcome fetching? | Critical for closing the loop — agent places bets, outcomes need to come back automatically |

---

## Priority Order for Resolving Gaps

1. **EVActualStat coverage audit** — run the SQL above, understand what data exists before anything else
2. **Win rate analysis across all sports** — extend the hockey analysis to NBA, NFL, MLB betTypes
3. **Alert timing analysis** — (eventTime - receivedTime) distribution by betType
4. **ProphetX/Novig market overlap check** — get credentials, pull available markets, compare to EVAlertEvent betTypes
5. **Backtest the scoring function** — apply retrospectively to historical alerts, check if BET decisions beat PASS
6. **CLV analysis** — requires pulling closing line data (Pinnacle or Unabated as sharp reference)
7. **Deduplication strategy** — define how to handle same-prop alerts from multiple providers
8. **EVActualStat automation** — adapt existing fetch scripts to run on a schedule post-game
