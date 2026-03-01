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
│   │   ├── allnewbasketball.csv                    ← basketball input
│   │   ├── allnewfootball.csv                      ← football input (49,731 rows: NFL/NCAAF/CFL)
│   │   └── hockey/
│   │       ├── 2026 data - NewMoneyline.csv
│   │       └── ... (other hockey CSVs)
│   └── processed/
│       ├── processed_basketball_points.csv          ✅ 26,199 rows  55.31% WR
│       ├── processed_basketball_assists.csv         ✅ 12,765 rows  55.91% WR
│       ├── processed_basketball_rebounds.csv        ✅ 17,936 rows  55.94% WR
│       ├── processed_basketball_threes.csv          ✅  9,274 rows  53.19% WR
│       ├── processed_basketball_steals.csv          ✅  (steals/player steals)
│       ├── processed_basketball_blocks.csv          ✅  (blocks/player blocks)
│       ├── processed_basketball_blks_stls.csv       ✅  4,692 rows total  51.22% WR
│       ├── processed_basketball_pra.csv             ✅ 45,509 rows  (PRA + Pts+Rebs+Asts)
│       ├── processed_basketball_pr.csv              ✅ 38,137 rows  (PR + Pts+Rebs)
│       ├── processed_basketball_ra.csv              ✅ 20,804 rows  (RA + Rebs+Asts)
│       ├── processed_basketball_pa.csv              ✅ 16,530 rows  (PA + Pts+Asts)
│       ├── processed_basketball_moneyline.csv       ✅
│       ├── processed_basketball_point_spread.csv    ✅
│       ├── processed_basketball_total_points.csv    ✅
│       ├── processed_basketball_team_total.csv      ✅
│       ├── processed_football_receiving_yards.csv   🔲 script ready
│       ├── processed_football_receptions.csv        🔲 script ready
│       ├── processed_football_longest_reception.csv 🔲 script ready
│       ├── processed_football_kicking_points.csv    🔲 script ready
│       ├── processed_football_fg_made.csv           🔲 script ready
│       └── ... (hockey output files)
└── scripts/
    ├── fetch_basketball_points.py            ✅ done
    ├── fetch_basketball_assists.py           ✅ done
    ├── fetch_basketball_rebounds.py          ✅ done
    ├── fetch_basketball_threes.py            ✅ done
    ├── fetch_basketball_defensive.py         ✅ done — steals, blocks, blks+stls (3 output files)
    ├── fetch_basketball_combos.py            ✅ done — all 8 combo bet type strings (4 output files)
    ├── fetch_basketball_team_markets.py      ✅ done — moneyline, spread, total, team total
    ├── fetch_football_receiving.py           🔲 ready to run — receiving yards, receptions, longest reception
    ├── fetch_football_kicking.py             🔲 ready to run — kicking points, FG made
    ├── fetch_moneyline.py                    ✅ done
    ├── fetch_puck_line.py                    ✅ done
    ├── fetch_1p_all.py                       ✅ done
    └── ... (other hockey scripts)
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

## actualStat Mapping by Bet Type

`actualStat` is always the **raw measurable stat** — what actually happened, independent of whether the bet won or lost. The `difference` column handles the win/loss calculation. This is what gets stored in the DB.

### Hockey

| Bet Type | actualStat | difference | Example |
|---|---|---|---|
| `Moneyline` | Signed goal margin (`bet_team - opp`) | Same as actualStat | Lost 3-8 → actualStat=-5 |
| `Puck Line` | Spread-covered margin (`margin + spread`) | Same as actualStat | Won 4-1, bet +1.5 → actualStat=4.5, diff=4.5 |
| `Total Goals` | Total goals scored (both teams) | Over: `total - line` / Under: `line - total` | 5 goals, line=7.5 → actualStat=5 |
| `1st Period Moneyline` | Signed 1P goal margin | Same as actualStat | |
| `1st Period Puck Line` | Spread-covered margin (`margin + spread`) | Same as actualStat | |
| `Player Goals` | Player's goals scored | Over: `stat - line` / Under: `line - stat` | Scored 1, line=0.5 → actualStat=1 |
| `Player Assists` | Player's assists | Over/Under vs line | |
| `Player Points` | Player's points (G+A) | Over/Under vs line | |
| `Player Shots on Goal` | Player's shots on goal | Over/Under vs line | |
| `Player Saves` | Goalie's saves | Over/Under vs line | |
| `Player Blocked Shots` | Player's blocked shots | Over/Under vs line | |
| `Goals` (team) | Team's goals scored | Over/Under vs line | |
| `Assists` (team) | Team's assists | Over/Under vs line | |
| `Shots on Goal` (team) | Team's shots on goal | Over/Under vs line | |

### Basketball

| Bet Type | actualStat | difference | Example |
|---|---|---|---|
| `Points` / `Player Points` | Player's points scored | Over/Under vs line | Scored 24, line=22.5 → actualStat=24 |
| `Assists` / `Player Assists` | Player's assists | Over/Under vs line | |
| `Rebounds` / `Player Rebounds` | Player's total rebounds | Over/Under vs line | |
| `3-PT Made` / `Player Made Threes` | Player's 3-pointers made | Over/Under vs line | Made 3, line=2.5 → actualStat=3 |
| `Steals` / `Player Steals` | Player's steals | Over/Under vs line | |
| `Blocks` / `Player Blocks` | Player's blocks | Over/Under vs line | |
| `Blks + Stls` | Blocks + Steals combined | Over/Under vs line | 1 BLK + 2 STL = 3 → actualStat=3 |
| `Player Points + Rebounds + Assists` / `Pts + Rebs + Asts` | PTS + REB + AST combined | Over/Under vs line | 20+7+4=31 → actualStat=31 |
| `Player Points + Rebounds` / `Pts + Rebs` | PTS + REB combined | Over/Under vs line | |
| `Player Points + Assists` / `Pts + Asts` | PTS + AST combined | Over/Under vs line | |
| `Player Rebounds + Assists` / `Rebs + Asts` | REB + AST combined | Over/Under vs line | |
| `Moneyline` | Signed point margin (`bet_team - opp`) | Same as actualStat | Lost by 5 → actualStat=-5 |
| `Point Spread` | Spread-covered margin (`margin + spread`) | Same as actualStat | Lost by 3, bet +5.5 → actualStat=2.5 |
| `Total Points` | Combined final score (both teams) | Over/Under vs line | 189 pts total → actualStat=189 |
| `Team Total` | Bet team's final score | Over/Under vs line | Team scored 112 → actualStat=112 |

### Football

| Bet Type | actualStat | difference | Notes |
|---|---|---|---|
| `Receiving Yards` / `Player Receiving Yards` | Player's receiving yards | Over/Under vs line | ESPN `receiving` category, `YDS` label |
| `Receptions` / `Player Receptions` | Player's receptions | Over/Under vs line | ESPN `receiving` category, `REC` label |
| `Longest Reception` / `Player Longest Reception` | Player's longest reception in yards | Over/Under vs line | ESPN `receiving` category, `LONG` label |
| `Kicking Points` / `Player Kicking Points` | Kicker's total points scored | Over/Under vs line | ESPN `kicking` category, `PTS` label |
| `FG Made` | Field goals made (int, not made/att) | Over/Under vs line | ESPN `kicking` category, `FG` label — parse "3/4" → 3 |

### Key Rules
- **actualStat is always a single number** — never a score like "3-8". Raw scores are a bug.
- **Combo bets**: always sum the components, store the sum as actualStat
- **Spread/puck line**: actualStat = covered margin (margin + spread). `difference` = same as actualStat.
- **Totals**: actualStat = actual total (not vs line). `difference` = how far over/under the line.
- **Moneyline**: actualStat = signed margin. Positive = won, negative = lost.

---

## Win/Loss Logic

### Player props and totals (Over/Under)
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

Win  if actualStat > 0
Loss if actualStat < 0
Push not possible in NHL
```

### Puck Line / Point Spread
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

#### Basketball ✅ Built
| ESPN path | Notes |
|---|---|
| `basketball/nba` | |
| `basketball/mens-college-basketball` | NCAAB |
| `basketball/wnba` | |
| `basketball/womens-college-basketball` | NCAAW |
| `basketball/nbl` | Australia NBL |

Not supported: EuroLeague, France LNB Pro A, Germany BBL

#### Hockey ✅ Built
| ESPN path | Notes |
|---|---|
| `hockey/nhl` | |
| `hockey/mens-college-hockey` | Not yet built |

Not supported: AHL, KHL

#### Tennis ⚠️ Partially supported — see Tennis notes below
| ESPN path | Notes |
|---|---|
| `tennis/atp` | |
| `tennis/wta` | |

#### Baseball 🔲 Not yet built
| ESPN path | Notes |
|---|---|
| `baseball/mlb` | |
| `baseball/college-baseball` | |

Not supported: KBO, NPB

#### Football ✅ Built (receiving + kicking scripts ready)
| ESPN path | League | Notes |
|---|---|---|
| `football/nfl` | NFL | 30,420 rows in allnewfootball.csv |
| `football/college-football` | NCAAF | 18,850 rows |
| `football/cfl` | CFL | 461 rows |
| `football/xfl` | XFL | Not yet built |

Not supported: USFL

#### Soccer 🔲 Not yet built
| ESPN path | Notes |
|---|---|
| `soccer/eng.1` | Premier League |
| `soccer/usa.1` | MLS |
| `soccer/esp.1` | La Liga |
| `soccer/ger.1` | Bundesliga |
| `soccer/fra.1` | Ligue 1 |
| `soccer/ita.1` | Serie A |
| `soccer/ned.1` | Eredivisie |
| `soccer/por.1` | Primeira Liga |
| `soccer/mex.1` | Liga MX |
| `soccer/bra.1` | Brasileirao |
| `soccer/arg.1` | Argentina Primera |
| `soccer/uefa.champions` | Champions League |
| `soccer/uefa.europa` | Europa League |
| `soccer/uefa.europa.conf` | Conference League |
| `soccer/fifa.world` | FIFA World Cup |
| `soccer/concacaf.champions` | CONCACAF Champions |
| `soccer/conmebol.libertadores` | Copa Libertadores |
| `soccer/jpn.1` | J-League |
| `soccer/aus.1` | A-League |
| `soccer/sco.1` | Scottish Premiership |
| `soccer/tur.1` | Super Lig (Turkey) |
| `soccer/eng.w.1` | WSL (Women's England) |

Not supported: K-League, NWSL

#### MMA 🔲 Needs investigation before building
| ESPN path | Notes |
|---|---|
| `mma/ufc` | Fight result structure differs from team sports |
| `mma/bellator` | |

#### Golf 🔲 Needs investigation before building
| ESPN path | Notes |
|---|---|
| `golf/pga` | |
| `golf/lpga` | |

Not supported: European Tour, College Golf

#### Available but no alert data yet
| ESPN path | Notes |
|---|---|
| `racing/f1` | Formula 1 |
| `lacrosse/pll` | |
| `lacrosse/nll` | |
| `lacrosse/mens-college-lacrosse` | |
| `volleyball/mens-college-volleyball` | |
| `volleyball/womens-college-volleyball` | |
| `australian-football/afl` | |

#### Not supported by ESPN
- NASCAR, IndyCar, MotoGP (only F1 works in motorsports)
- Rugby (all formats — NRL, Six Nations, Super Rugby, Top 14)
- Cricket (all — IPL, Big Bash, World Cup)
- Boxing
- Softball
- Skiing, Swimming, Cycling, Horse Racing
- Darts, Snooker
- Handball, Water Polo, Field Hockey
- Esports (all)

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

#### Football stat structure — DIFFERENT from basketball

Football stats are **organized by named categories**. The path is:
```
response.boxscore.players[]           ← one entry per team
  .statistics[]                       ← LIST of categories (not just index [0])
    .name                             ← category name: 'passing', 'rushing', 'receiving', etc.
    .labels[]                         ← stat column headers for this category
    .athletes[]
      .athlete.displayName            ← player name
      .stats[]                        ← values, aligned to labels
      .didNotPlay                     ← skip if true
```

To target a category: loop `statistics[]` and filter by `.name == 'receiving'` etc.

#### Football categories and labels

| Category name | Key labels | Notes |
|---|---|---|
| `passing` | `C/ATT`, `YDS`, `AVG`, `TD`, `INT`, `SACKS`, `QBR`, `RTG` | `C/ATT` = "24/35" format |
| `rushing` | `CAR`, `YDS`, `AVG`, `TD`, `LONG` | |
| `receiving` | `REC`, `YDS`, `AVG`, `TD`, `LONG`, `TGTS` | `LONG` is plain int |
| `defensive` | `TOT`, `SOLO`, `SACKS`, `TFL`, `PD`, `QB HTS`, `TD` | |
| `interceptions` | `INT`, `YDS`, `TD` | |
| `kicking` | `FG`, `PCT`, `LONG`, `XP`, `PTS` | `FG` = "3/4" (made/att) format |
| `punting` | `NO`, `YDS`, `AVG`, `NET`, `TB`, `IN 20`, `LONG` | |
| `kickReturns` | `NO`, `YDS`, `AVG`, `LONG`, `TD` | |
| `puntReturns` | `NO`, `YDS`, `AVG`, `LONG`, `TD` | |
| `fumbles` | `FUM`, `LOST`, `REC` | |

#### Special parse cases for football
- `FG` (kicking): `"3/4"` format → `int(raw.split('/')[0])` to get made count
- `C/ATT` (passing): `"24/35"` format → split similarly if needed
- All other football stats are plain integers

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

### Football (NFL / NCAAF / CFL)
- `receivedTime` is always a **Unix timestamp in seconds** — reliable
- `eventTime` is a **Unix timestamp** when populated, or the literal string `'null'` (not Python `None`) when not
- Alerts arrive **0–7.4 days before the game** (median 0.5 days) — much wider gap than basketball
- **When `eventTime` is valid (not 'null'):** parse as Unix timestamp, search offset `[0]` only
- **When `eventTime` is 'null':** use `receivedTime`, search **+0 through +7 days** to ensure the game is found
- CFL and NCAAF use the same logic

---

## Output File Grouping Rule

**One output file per distinct stat** — but different betType strings for the same stat share one file.

> `Rush Yards` and `Player Rushing Yards` are the same stat → same output file `processed_football_rush_yards.csv`
> `Rush Attempts` is a different stat → its own file `processed_football_rush_attempts.csv`

The pattern in every multi-output script is a `BET_TYPE_CONFIG` dict:
```python
BET_TYPE_CONFIG = {
    'Rush Yards':           ('YDS',  'rush_yards'),     # (ESPN label, output key)
    'Player Rushing Yards': ('YDS',  'rush_yards'),     # same output key = same file
    'Rush Attempts':        ('CAR',  'rush_attempts'),  # different key = different file
    ...
}
OUTPUT_CSVS = {
    'rush_yards':    'processed_football_rush_yards.csv',
    'rush_attempts': 'processed_football_rush_attempts.csv',
    ...
}
```

In Step 4, rows are bucketed by `OUTPUT_CSVS[out_key]` and written to separate files.

---

## How to Create a New Script

1. Copy the closest existing script as your template:
   - Single stat, single output → copy `fetch_basketball_assists.py`
   - Multiple stats, multiple outputs → copy `fetch_football_receiving.py`
   - Special parse (e.g. "X/Y" format) → copy `fetch_football_passing.py`
2. Update `BET_TYPE_CONFIG` — map each betType string to `(ESPN_label, output_key)`
3. Update `OUTPUT_CSVS` — one entry per unique output key
4. Set `ESPN_CATEGORY` to the correct category name (e.g. `'rushing'`, `'passing'`, `'receiving'`)
5. Set `LABELS_NEEDED` to the labels you need to fetch from that category
6. Update `LEAGUE_ESPN_PATH` if different sport
7. Update print headers and docstring
8. Test with `GAME_FILTER = "Team A vs Team B"` on a single known game
9. Confirm stats and output files look correct
10. Set `GAME_FILTER = None` and add to todo for full run

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
