# EVActualStat Data Import Process

## Overview

This document describes the process for importing `actualStat` data from Google Sheets exports into the `manual."EVActualStat"` table in Supabase.

The `EVActualStat` table stores two columns:
- `id` — the EV alert ID
- `actualStat` — the actual result for that alert (e.g. player stat, or game margin as a signed value)

**Note on actualStat values:** Values can be negative. For moneyline/game-level bets, the value represents the margin (e.g. `-3.0` = lost by 3, `5.0` = won by 5). For player prop bets, the value is the raw stat achieved.

All `actualStat` values must be stored to **one decimal place** (e.g. `2.0`, `-3.0`).

---

## Source Files

Sheet exports are downloaded from Google Sheets as CSVs, named in the format:

```
2026 data - Sheet{N}.csv
2026 data - Sheet{N} (1).csv   ← re-downloaded/updated copy
```

Files are located in the user's `Downloads` folder.

Each sheet CSV contains the columns:
`id, alertProvider, sport, league, game, EV, oddsToHit, sportsbook, eventTime, receivedTime, odds, betSizeRecommendationFor1kBankroll, betType, betPrediction, playerName, playerPrediction, playerLine, actualStat, difference, status`

Only `id` and `actualStat` are imported.

---

## Process (Per Sheet)

1. **Check for the file** in `Downloads` matching the sheet number.
2. **Check for existing IDs** — query `manual."EVActualStat"` to see if any IDs from the sheet are already present. Skip if all already exist.
3. **Filter valid rows** — skip any rows where `actualStat` is blank/empty.
4. **Format values** — ensure `actualStat` is formatted to one decimal place (`.1f`).
5. **Insert** via `INSERT INTO manual."EVActualStat" (id, "actualStat") VALUES (...)`.

---

## Sheets Processed

| Sheet | Rows in File | Rows Inserted | Notes |
|-------|-------------|---------------|-------|
| Sheet69 | 564 | 564 | All new, all valid |
| Sheet71 | 706 | 0 | All already existed in EVActualStat |
| Sheet73 | 403 | 0 (original) | Original had no matches; re-downloaded copy used |
| Sheet73 (1) | 247 | 247 | Re-downloaded copy; inserted but values were incorrect — overwritten by Sheet79 |
| Sheet74 | 153 | 153 | All new, all valid |
| Sheet76 | 217 | 49 | 168 rows had blank `actualStat` and were skipped |
| Sheet79 | 247 | 0 inserted, 247 updated | Same IDs as Sheet73 (1) but correct values — overwrote all 247 rows |
| Sheet80 | 148 | 148 | All new, all valid |

---

## Supabase Project

- **Project:** dropout-degens
- **Project ID:** `sctugnxbqxrrnkxydcss`
- **Table:** `manual."EVActualStat"`
- **Region:** us-west-1
