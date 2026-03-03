# Daily Alert Processing Pipeline
Type: idea
Date: 2026-03-03

## Summary
Build an automated daily script that queries `private."EVAlertEvent"` for new alerts, matches them against ESPN box scores for completed games, and populates `manual."EVActualStat"` with results. Run at 2 AM EST when most alerts from the previous day have settled.

## Key Points
- **Data source:** `private."EVAlertEvent"` table contains all alerts as they're generated
- **Processing scope:** All supported markets (to be filled in on creation; currently basketball, hockey, football receiving/kicking)
- **Timing:** 2 AM EST — when most previous-day alerts have settled with final game results
- **Output:** Populate `manual."EVActualStat"` with (id, actualStat) for alerts that now have results
- **Failure handling:** Log and move on; leave actualStat null for unmatched alerts
- **Future enhancement:** Consider adding boxscore game_id to `EVAlertEvent` to skip scoreboard lookups and enable better game grouping

## Architecture
Reuse the existing ESPN fetch pattern from `context/operations/data/data-processing/`:
- Query `EVAlertEvent` for alerts missing `actualStat` in `EVActualStat` table (LEFT JOIN)
- Group alerts by (game, date, league)
- For each group, fetch ESPN scoreboard + summary once (already have this logic)
- Extract the relevant stat based on `betType`
- Calculate `difference` and `status` (Win/Loss/Push)
- INSERT/UPDATE `manual."EVActualStat"` with id + actualStat
- Log failures (game not found, player not found, ESPN error) and continue

## Data Flow
```
EVAlertEvent (all alerts)
    ↓
Query for alerts WITHOUT actualStat in EVActualStat table
    ↓
Filter to supported markets
    ↓
Group by (game, date, league)
    ↓
Fetch ESPN (existing scripts as template)
    ↓
Extract stat, calculate Win/Loss/Push
    ↓
Write to EVActualStat (id, actualStat)
    ↓
Log failures (actualStat remains null)
```

## Context
- Existing ESPN fetch scripts in `newdata/scripts/` handle all parsing logic
- Input CSV format documented in `context/operations/data/data-processing/README.md`
- `actualStat` values must be single numbers to one decimal place (e.g., `2.0`, `-3.0`)
- Moneyline uses signed margin; player props use raw stat; spreads use covered margin
- Date handling differs by sport (hockey uses eventTime string; basketball/football use Unix timestamps)
- Supported bet types include basketball (points, assists, rebounds, 3s, steals, blocks, combos, moneyline, spread, totals), hockey (moneyline, puck line, goals, player props), football (receiving yards, receptions, kicking points, FG made)

## Clarifying Questions & Answers

**Q: Market coverage — Are there football alerts coming in, and which should we handle first?**
A: Note all supported markets will be filled in at creation time.

**Q: Game tagging workflow — Store game_id on EVAlertEvent or just add post-processing metadata?**
A: Future implementation. Consider adding boxscore game_id to `EVAlertEvent` table to optimize matching and enable better grouping. Start without it; revisit after initial build.

**Q: Failure handling — Retry, log and move on, or something else?**
A: Log and move on. Accept that some alerts won't process (ESPN down, game not found, player not found, etc.). Leave actualStat null.

## Next Steps
1. Confirm exact bet types to support initially
2. Write query to identify gaps between `EVAlertEvent` and `EVActualStat`
3. Build daily script using existing ESPN fetch patterns as template
4. Add logging (failures, skipped alerts, processing summary)
5. Test on 1-2 days of alerts before scheduling
6. Set up 2 AM EST cron job
7. Future: Evaluate adding game_id column to `EVAlertEvent` and refactor matching logic
