# Daily Alert Processing Pipeline
Type: idea
Date: 2026-03-03

## Summary
Build an automated daily script that queries `private."EVAlertEvent"` for new alerts, matches them against ESPN box scores for completed games, and populates `manual."EVActualStat"` with results. Run at 2 AM EST when most alerts from the previous day have settled.

## Key Points
- **Data source:** `private."EVAlertEvent"` table contains all alerts as they're generated
- **Processing scope:** All markets/bet types we already know how to process (to be refined after data cleanup)
- **Timing:** 2 AM EST — when most previous-day alerts have settled with final game results
- **Output:** Populate `manual."EVActualStat"` with (id, actualStat) for alerts that now have results
- **Future enhancement:** Tag/group alerts to specific games to make processing cleaner and potentially parallelize

## Architecture
Reuse the existing ESPN fetch pattern from `context/operations/data/data-processing/`:
- Query `EVAlertEvent` for alerts missing `actualStat` in `EVActualStat` table (LEFT JOIN)
- Group alerts by (game, date, league)
- For each group, fetch ESPN scoreboard + summary once (already have this logic)
- Extract the relevant stat based on `betType`
- Calculate `difference` and `status` (Win/Loss/Push)
- INSERT/UPDATE `manual."EVActualStat"` with id + actualStat

## Data Flow
```
EVAlertEvent (all alerts)
    ↓
Query for alerts WITHOUT actualStat in EVActualStat table
    ↓
Filter to supported markets (scope TBD)
    ↓
Group by (game, date, league)
    ↓
Fetch ESPN (existing scripts as template)
    ↓
Extract stat, calculate Win/Loss/Push
    ↓
Write to EVActualStat (id, actualStat)
```

## Context
- Existing ESPN fetch scripts in `newdata/scripts/` handle all parsing logic
- Input CSV format documented in `context/operations/data/data-processing/README.md`
- `actualStat` values must be single numbers to one decimal place (e.g., `2.0`, `-3.0`)
- Moneyline uses signed margin; player props use raw stat; spreads use covered margin
- Date handling differs by sport (hockey uses eventTime string; basketball/football use Unix timestamps)

## Next Steps
1. Scope out exact bet types to support initially (after data refinement)
2. Write query to identify gaps between `EVAlertEvent` and `EVActualStat`
3. Build daily script using existing ESPN fetch patterns as template
4. Add optional game-tagging logic for future optimization
5. Test on 1-2 days of alerts before scheduling
6. Set up 2 AM EST cron job
