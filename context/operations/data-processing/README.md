# Data Processing — ESPN Results Fetcher

**Created:** February 2026
**Owner:** Dax

---

## Purpose

This documents the pattern used to process raw bet tracking CSVs and automatically look up actual game results from the ESPN public API. The scripts match each bet row to its game on ESPN, pull the relevant player/team stat, and calculate Win/Loss/Push.

This context file exists so that any AI or developer on a new device can replicate the pattern for a new sport or bet type without starting from scratch.

---

## Folder Structure

```
newdata/
├── data/
│   ├── raw/
│   │   ├── allnewbasketball.csv        ← basketball input
│   │   └── hockey/
│   │       ├── 2026 data - NewMoneyline.csv
│   │       └── ... (other hockey CSVs)
│   └── processed/
│       ├── processed_basketball_points.csv
│       ├── processed_basketball_assists.csv
│       └── ... (one output file per script)
└── scripts/
    ├── fetch_basketball_points.py
    ├── fetch_basketball_assists.py
    ├── fetch_moneyline.py
    └── ... (one script per bet type)
```

---

## Input CSV Format

All input CSVs share the same column structure:

| Column | Description | Example |
|--------|-------------|---------|
| `betType` | The type of bet — scripts filter to ONE type only | `Points`, `Assists`, `Moneyline` |
| `betPrediction` | The full prediction string | `Anthony Davis Under 25.5` |
| `game` | Both teams separated by "vs" | `Lakers vs Celtics` |
| `league` | League identifier (lowercase) | `nba`, `ncaab`, `wnba` |
| `receivedTime` | Unix timestamp in seconds (basketball) OR formatted string (hockey) | `1740000000` |
| `eventTime` | Game time — often null in basketball; populated in hockey | `Monday Feb 24 2026, 19:00:00` |
| `actualStat` | Filled in by the script after fetching ESPN | (empty on input) |

### betPrediction formats by bet type

- **Player props (Points, Assists, Rebounds, etc.):** `"Player Name Over/Under line"`
  Example: `Jalen Brunson Over 6.5`
- **Moneyline:** Just the team name, no line
  Example: `San Jose Sharks`
- **Puck Line / Spread:** `"Team Name +/- spread"`
  Example: `Detroit Red Wings +1.5`

---

## Output Columns Added by Scripts

Every script appends these columns to the output CSV:

| Column | Description |
|--------|-------------|
| `playerPrediction` | The player or team being bet on |
| `playerLine` | The stat line (empty for moneyline) |
| `actualStat` | The actual stat value fetched from ESPN |
| `difference` | How much the bet covered by (positive = won) |
| `status` | `Win`, `Loss`, or `Push` |

**Output filter:** Only rows where `actualStat` was successfully found are written to the output file. Rows with no match are silently dropped.

---

## Win/Loss Logic

### Player props (Over/Under)
```
difference = (actualStat - line)   if Over
           = (line - actualStat)   if Under

Win  if difference > 0
Loss if difference < 0
Push if difference == 0
```

### Moneyline
```
actualStat = bet_team_score - opponent_score   (signed margin)
difference = actualStat

Win  if margin > 0
Loss if margin < 0
Push is not possible in NHL
```

### Puck Line (spread)
```
actualStat = bet_team_score - opponent_score   (signed margin)
difference = margin + spread

Win  if difference > 0
Loss if difference < 0
Push if difference == 0
```

---

## ESPN API

The scripts use ESPN's **public, unauthenticated** API. No key required.

### Base URL
```
https://site.api.espn.com/apis/site/v2/sports
```

### Endpoints

**Scoreboard** — get all games for a date:
```
GET {BASE}/{sport}/{league}/scoreboard?dates=YYYYMMDD
```
Returns: list of events, each with `id`, `home team`, `away team`

**Summary** — get full game details including boxscore:
```
GET {BASE}/{sport}/{league}/summary?event={event_id}
```
Returns: full boxscore with player stats

### Supported League Paths

#### Basketball
| CSV `league` value | ESPN path |
|---|---|
| `nba` | `basketball/nba` |
| `ncaab` | `basketball/mens-college-basketball` |
| `wnba` | `basketball/wnba` |
| `ncaaw` | `basketball/womens-college-basketball` |
| `australia - nbl` | `basketball/nbl` |

#### Hockey
| CSV `league` value | ESPN path |
|---|---|
| `nhl` | `hockey/nhl` |

**Not supported by ESPN:** EuroLeague, France LNB Pro A, Germany BBL — these return empty results or 400 errors. Rows in those leagues will be skipped with "game not found".

#### Tennis
| ESPN path | Status |
|---|---|
| `tennis/atp` | 200 — works |
| `tennis/wta` | 200 — works |

**Tennis is partially supported — see notes below.**

### Player Stats Location in Summary Response

```
response.boxscore.players[]           ← one entry per team
  .statistics[0]
    .labels[]                         ← stat column headers
    .athletes[]
      .athlete.displayName            ← player name
      .stats[]                        ← values, aligned to labels
      .didNotPlay                     ← skip if true
```

#### Basketball stat labels (in order)
```
['MIN', 'PTS', 'FG', '3PT', 'FT', 'REB', 'AST', 'TO', 'STL', 'BLK', 'OREB', 'DREB', 'PF', '+/-']
```

To get a specific stat: `labels.index('AST')` → gives the index → `stats[index]`

Common label values:
| Stat | Label |
|------|-------|
| Points | `PTS` |
| Assists | `AST` |
| Rebounds | `REB` |
| Steals | `STL` |
| Blocks | `BLK` |
| Turnovers | `TO` |

---

## Date Handling

### Basketball
- `receivedTime` is always a **Unix timestamp in seconds** (e.g. `1740000000`)
- `eventTime` is always null — don't rely on it
- Always search **+0 and +1 days** from receivedTime because the bet may have been placed before the game

### Hockey
- `eventTime` is a **formatted string**: `"Monday Feb 24 2026, 19:00:00"`
- `receivedTime` uses the same format
- If `eventTime` is present, search only the exact day (no +1 needed)
- If only `receivedTime`, search +0 and +1

---

## How to Create a New Script

1. Copy `fetch_basketball_assists.py` (the cleanest template)
2. Change **6 things** at the top of the file:
   - `TARGET_BET_TYPE` — the exact string from the `betType` column in the CSV
   - `STAT_LABEL` — the ESPN label for the stat (e.g. `'REB'`, `'STL'`)
   - `INPUT_CSV` — path to the raw CSV
   - `OUTPUT_CSV` — path for the output file
   - `LEAGUE_ESPN_PATH` — if different sport, update league→path mapping
   - Print headers (e.g. `"BASKETBALL REBOUNDS FETCHER"`)
3. Update the docstring at the top
4. Test with `GAME_FILTER = "Team A vs Team B"` (a single game you know has data)
5. Confirm stats look correct in the output
6. Set `GAME_FILTER = None` and run the full file

See `example_fetch_script.py` in this folder for a fully annotated template.

---

## Running a Script

```bash
py H:/dropout_degens/claude/newdata/scripts/fetch_basketball_assists.py
```

- Keep screen **locked** (Win+L) while running — Sleep pauses processes, Lock does not
- Large files (300k+ rows, 4000+ games) take 30–90 minutes
- Progress is printed per game group as it runs

---

## Tennis API — Investigation Notes

> **Status: Partially supported. To be built out.**

Tested February 2026. Both `tennis/atp` and `tennis/wta` return 200 from the scoreboard endpoint, but the structure is different from basketball/hockey and the summary endpoint does not work.

### What works
- Scoreboard returns active tournaments and all match results
- Each match has: player names, set-by-set scores (`linescores`), and a `winner: true/false` flag
- Enough data to process **match winner (moneyline-style)** bets

### What doesn't work
- **Summary endpoint returns 400** for all tennis match IDs — no detail page
- `statistics: []` is always empty on competitor objects — no aces, double faults, first serve %, etc.
- No player stat breakdowns available at all through ESPN

### Key structural difference from basketball/hockey
Tennis matches are **not** at the top-level `events[]`. They are nested:
```
response.events[]
  .groupings[]          ← rounds (e.g. Round of 64, Quarterfinals, Final)
    .competitions[]     ← individual matches
      .competitors[]
        .athlete.displayName    ← player name
        .winner                 ← True/False
        .linescores[]           ← set scores, e.g. [{value: 6}, {value: 4}]
        .statistics             ← always empty []
```

The scoreboard is not filtered by date the same way — it returns the full active tournament(s) with all matches. Filtering to a specific match date requires checking `competition.startDate`.

### What you can build with this
- Match winner processing (who won the match) — viable
- Set score margin bets — viable (linescores give games per set)

### What requires a different data source
- Any player stat props (aces, double faults, service games won, etc.) — ESPN does not expose these. Would need the Tennis Abstract API, ATP/WTA official data, or a paid provider.

### Next steps when ready to build
1. Check what `betType` values exist in the tennis CSV
2. If match winner only — adapt the moneyline pattern using `competition.competitors[].winner`
3. If stat props — investigate alternative APIs before building

---

## API Rate Limiting

`API_DELAY = 0.35` seconds between each ESPN request. This is intentionally conservative. The scripts make 2 requests per game (scoreboard + summary), so a run with 4,000 games ≈ ~47 minutes of actual API time. Do not reduce this value significantly or ESPN may start rate-limiting.
