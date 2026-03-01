#!/usr/bin/env python3
"""
[SPORT] [BET TYPE] - Actual Results Fetcher
============================================
Processes: [input filename].csv
BetType:   "[BetType]" ONLY (all other bet types are ignored)

betPrediction format:
  "Player Name Over 6.5"  — player name + Over/Under + line

Win/Loss logic:
  actualStat  = player's actual [stat]
  difference  = (actualStat - line)  if Over
              = (line - actualStat)  if Under
  Win  if difference > 0
  Loss if difference < 0
  Push if difference == 0

Output columns:
  playerPrediction  = the player being bet on
  playerLine        = the stat line (e.g. 6.5)
  actualStat        = actual stat recorded
  difference        = covered margin
  status            = Win, Loss, or Push

RUN:
    py H:/dropout_degens/claude/newdata/scripts/fetch_[sport]_[bettype].py

OUTPUT:
    H:/dropout_degens/claude/newdata/data/processed/processed_[sport]_[bettype].csv
"""

import csv
import os
import re
import sys
import time
import requests
from collections import defaultdict
from datetime import datetime, timedelta

# Ensure UTF-8 output (important for non-ASCII player/team names)
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# ============================================================================
# CONFIG — CHANGE THESE 6 THINGS WHEN CREATING A NEW SCRIPT
# ============================================================================

SCRIPT_DIR   = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

# [1] Input CSV path
INPUT_CSV  = os.path.join(PROJECT_ROOT, "data", "raw",       "allnewbasketball.csv")

# [2] Output CSV path
OUTPUT_CSV = os.path.join(PROJECT_ROOT, "data", "processed", "processed_basketball_example.csv")

# [3] The exact betType string from the CSV (must match exactly, case-sensitive)
TARGET_BET_TYPE = "Assists"

# [4] The ESPN boxscore label for the stat you want
#     Basketball labels in order: MIN, PTS, FG, 3PT, FT, REB, AST, TO, STL, BLK, OREB, DREB, PF, +/-
#     Common values: 'PTS' = Points, 'AST' = Assists, 'REB' = Rebounds, 'STL' = Steals, 'BLK' = Blocks
STAT_LABEL = "AST"

ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports"

# [5] Map from the league value in the CSV (lowercase) to the ESPN sport/league path
#     Basketball example below. For hockey, use: {'nhl': 'hockey/nhl'}
LEAGUE_ESPN_PATH = {
    'nba':              'basketball/nba',
    'ncaab':            'basketball/mens-college-basketball',
    'wnba':             'basketball/wnba',
    'ncaaw':            'basketball/womens-college-basketball',
    'australia - nbl':  'basketball/nbl',
}

API_DELAY = 0.35   # seconds between ESPN requests — do not reduce significantly

# [6] Set to a game string to test a single game. Set to None for full run.
#     Example: "Minnesota Timberwolves vs Los Angeles Lakers"
GAME_FILTER = None

# ============================================================================
# HELPERS — no changes needed here
# ============================================================================

def ts_to_date(ts_str):
    """
    Converts a Unix timestamp string (seconds) to a datetime object.
    Used for basketball where receivedTime is always a Unix timestamp.
    """
    try:
        return datetime.fromtimestamp(int(ts_str))
    except (ValueError, TypeError):
        return None


def extract_teams(game_str):
    """
    Splits "Team A vs Team B" into ("Team A", "Team B").
    Returns (None, None) if the format doesn't match.
    """
    parts = re.split(r'\s+vs\.?\s+', game_str.strip(), flags=re.IGNORECASE)
    return (parts[0].strip(), parts[1].strip()) if len(parts) == 2 else (None, None)


def parse_bet_prediction(s):
    """
    Parses "Player Name Over 6.5" into ("Player Name", "Over", 6.5).
    Parses "Player Name Under 5"  into ("Player Name", "Under", 5.0).
    Returns (None, None, None) on failure.
    """
    if not s:
        return None, None, None
    m = re.match(r'^(.*?)\s+(Over|Under)\s+([\d.]+)$', s.strip(), re.IGNORECASE)
    if m:
        return m.group(1).strip(), m.group(2).capitalize(), float(m.group(3))
    return None, None, None


def names_match(a, b):
    """
    Fuzzy name match — checks if one name contains the other.
    Handles cases where ESPN uses full name but CSV has shortened version (or vice versa).
    """
    return b.lower().strip() in a.lower().strip() or a.lower().strip() in b.lower().strip()


# ============================================================================
# ESPN API — no changes needed here
# ============================================================================

def espn_scoreboard_url(league_key):
    """Returns the scoreboard URL for the given league, or None if unsupported."""
    path = LEAGUE_ESPN_PATH.get(league_key.lower())
    if not path:
        return None
    return f"{ESPN_BASE}/{path}/scoreboard"


def espn_summary_url(league_key):
    """Returns the game summary URL for the given league, or None if unsupported."""
    path = LEAGUE_ESPN_PATH.get(league_key.lower())
    if not path:
        return None
    return f"{ESPN_BASE}/{path}/summary"


def get_games_for_date(league_key, date_obj):
    """
    Fetches all games for a given league and date from ESPN scoreboard.
    Returns list of dicts: [{'id': event_id, 'home': name, 'away': name}, ...]
    Returns [] on failure or unsupported league.
    """
    url = espn_scoreboard_url(league_key)
    if not url:
        return []
    date_str = date_obj.strftime('%Y%m%d')
    try:
        resp = requests.get(url, params={'dates': date_str}, timeout=15)
        resp.raise_for_status()
        result = []
        for event in resp.json().get('events', []):
            comps = event.get('competitions', [{}])[0]
            home, away = '', ''
            for comp in comps.get('competitors', []):
                name = comp.get('team', {}).get('displayName', '')
                if comp.get('homeAway') == 'home':
                    home = name
                else:
                    away = name
            result.append({'id': event['id'], 'home': home, 'away': away})
        return result
    except Exception as e:
        print(f"      [WARN] Scoreboard error {date_str} ({league_key}): {e}")
        return []


def find_game_for_teams(league_key, date_obj, team_a, team_b):
    """
    Searches the scoreboard for a game matching both team names.
    Returns the game dict {'id', 'home', 'away'} or None if not found.
    """
    for g in get_games_for_date(league_key, date_obj):
        if (names_match(g['home'], team_a) or names_match(g['away'], team_a)) and \
           (names_match(g['home'], team_b) or names_match(g['away'], team_b)):
            return g
    return None


def get_player_stat(league_key, event_id):
    """
    Fetches the boxscore for a game and returns {player_name: stat_value} for all players.
    Uses STAT_LABEL (set in CONFIG above) to find the right column.
    Returns None on failure.

    ESPN boxscore structure:
      response['boxscore']['players'][]          <- one per team
        ['statistics'][0]['labels'][]            <- column headers like ['MIN','PTS','AST',...]
        ['statistics'][0]['athletes'][]
          ['athlete']['displayName']             <- player name
          ['stats'][]                            <- values aligned to labels
          ['didNotPlay']                         <- True if DNP, skip these
    """
    url = espn_summary_url(league_key)
    if not url:
        return None
    try:
        resp = requests.get(url, params={'event': event_id}, timeout=15)
        resp.raise_for_status()
        data = resp.json()
        players_data = data.get('boxscore', {}).get('players', [])
        if not players_data:
            return None
        result = {}
        for team_group in players_data:
            stats_cat = team_group.get('statistics', [])
            if not stats_cat:
                continue
            labels = stats_cat[0].get('labels', [])
            try:
                stat_idx = labels.index(STAT_LABEL)   # find the column for our stat
            except ValueError:
                continue   # this team's data doesn't have the label — skip
            for athlete in stats_cat[0].get('athletes', []):
                name  = athlete.get('athlete', {}).get('displayName', '')
                stats = athlete.get('stats', [])
                if not stats or athlete.get('didNotPlay'):
                    continue   # skip DNP players (their stats array is empty or irrelevant)
                try:
                    val = int(stats[stat_idx])
                    result[name] = val
                except (ValueError, IndexError):
                    pass
        return result if result else None
    except Exception as e:
        print(f"      [WARN] Summary error event {event_id} ({league_key}): {e}")
        return None


# ============================================================================
# MAIN — only update the print labels if you change bet type
# ============================================================================

def main():
    # [UPDATE] Change the title string to match your bet type
    print("=" * 80)
    print("BASKETBALL ASSISTS FETCHER")
    print(f"Input:  {INPUT_CSV}")
    print(f"Output: {OUTPUT_CSV}")
    if GAME_FILTER:
        print(f"GAME FILTER: {GAME_FILTER}  (test mode — set to None for full run)")
    print("=" * 80)

    # -------------------------------------------------------------------------
    # STEP 1: Load CSV and filter to target bet type only
    # -------------------------------------------------------------------------
    print(f"\n[STEP 1/4] Loading CSV ({TARGET_BET_TYPE} only)...")
    with open(INPUT_CSV, newline='', encoding='utf-8-sig') as f:
        reader     = csv.DictReader(f)
        all_rows   = list(reader)
        fieldnames = list(all_rows[0].keys()) if all_rows else []

    target_rows = [
        r for r in all_rows
        if r.get('betType') == TARGET_BET_TYPE
        and (not GAME_FILTER or r.get('game', '').strip() == GAME_FILTER)
    ]
    print(f"  Total rows in file: {len(all_rows):,}")
    print(f"  {TARGET_BET_TYPE} rows: {len(target_rows):,}")

    # -------------------------------------------------------------------------
    # STEP 2: Parse betPrediction into (player, direction, line)
    # -------------------------------------------------------------------------
    print("\n[STEP 2/4] Parsing bet predictions...")
    for row in target_rows:
        player, direction, line = parse_bet_prediction(row.get('betPrediction', ''))
        row['_player']    = player
        row['_direction'] = direction
        row['_line']      = line

    parsed_ok = sum(1 for r in target_rows if r.get('_player') is not None)
    print(f"  Parsed: {parsed_ok:,} / {len(target_rows):,}")

    # -------------------------------------------------------------------------
    # STEP 3: Group rows by (game, date, league) and fetch ESPN once per game
    #
    # KEY DETAIL — Basketball date handling:
    #   - receivedTime = Unix timestamp in seconds (always populated)
    #   - eventTime    = null (never populated for basketball)
    #   - Always search +0 and +1 days because bets may be placed before game day
    # -------------------------------------------------------------------------
    print("\n[STEP 3/4] Fetching results from ESPN (grouped by game)...")

    needs_update  = [r for r in target_rows if not r.get('actualStat', '').strip()]
    print(f"  Need updating: {len(needs_update):,}")

    groups        = defaultdict(list)
    skipped_parse = 0
    unsupported   = 0

    for row in needs_update:
        league = row.get('league', '').strip().lower()
        if league not in LEAGUE_ESPN_PATH:
            unsupported += 1
            continue

        # Basketball always uses receivedTime as Unix timestamp
        anchor_dt = ts_to_date(row.get('receivedTime', ''))
        if not anchor_dt:
            skipped_parse += 1
            continue

        team_a, team_b = extract_teams(row.get('game', ''))
        if not team_a or not team_b:
            skipped_parse += 1
            continue

        row['_anchor_dt'] = anchor_dt
        row['_team_a']    = team_a
        row['_team_b']    = team_b

        # Group key ensures we only make one ESPN call per unique game
        key = (row['game'].strip(), anchor_dt.strftime('%Y-%m-%d'), league)
        groups[key].append(row)

    print(f"  Unique (game, date, league) groups: {len(groups):,}")
    print(f"  Unsupported leagues (skipped):      {unsupported:,}")

    updated_count    = 0
    game_not_found   = 0
    player_not_found = 0

    for (game_str, date_str, league), group_rows in sorted(groups.items()):
        team_a    = group_rows[0]['_team_a']
        team_b    = group_rows[0]['_team_b']
        anchor_dt = group_rows[0]['_anchor_dt']

        print(f"\n  [{date_str}] {game_str}  [{league}]  ({len(group_rows)} rows)")

        # Try receivedTime day (+0), then next day (+1)
        event_id = None
        for offset in [0, 1]:
            check    = anchor_dt + timedelta(days=offset)
            game_obj = find_game_for_teams(league, check, team_a, team_b)
            time.sleep(API_DELAY)
            if game_obj:
                event_id = game_obj['id']
                print(f"    ESPN event {event_id} found on {check.strftime('%Y-%m-%d')}")
                break

        if not event_id:
            print(f"    Game NOT found on ESPN.")
            game_not_found += len(group_rows)
            continue

        player_stats = get_player_stat(league, event_id)
        time.sleep(API_DELAY)

        if not player_stats:
            print(f"    [WARN] Could not get player stats.")
            game_not_found += len(group_rows)
            continue

        for row in group_rows:
            player = row.get('_player', '')

            # Find the player in the boxscore using fuzzy name matching
            val = None
            matched_name = None
            for name, v in player_stats.items():
                if names_match(name, player):
                    val = v
                    matched_name = name
                    break

            if val is None:
                print(f"      [MISS] '{player}' not found in boxscore")
                player_not_found += 1
                continue

            row['actualStat'] = str(val)
            updated_count += 1

            direction = row.get('_direction', '')
            line      = row.get('_line', 0.0)
            diff      = (val - line) if direction == 'Over' else (line - val)
            result    = 'Win' if diff > 0 else ('Loss' if diff < 0 else 'Push')
            print(f"      [OK]   {player} ({matched_name})  {direction} {line}  actual={val}  diff={diff:+.1f}  -> {result}")

    print(f"\n  Done fetching.")
    print(f"    Updated:          {updated_count:,}")
    print(f"    Game not found:   {game_not_found:,}")
    print(f"    Player not found: {player_not_found:,}")
    print(f"    Parse/skip:       {skipped_parse:,}")
    print(f"    Unsupported:      {unsupported:,}")

    # -------------------------------------------------------------------------
    # STEP 4: Calculate final results and write output
    #
    # Output filter: only rows where actualStat was found are written.
    # -------------------------------------------------------------------------
    print("\n[STEP 4/4] Calculating results and writing output...")

    for col in ('playerPrediction', 'playerLine', 'actualStat', 'difference', 'status'):
        if col not in fieldnames:
            fieldnames.append(col)

    wins = losses = pushes = skipped = 0
    output_rows = []

    rows_to_write = target_rows if GAME_FILTER else all_rows

    for row in rows_to_write:
        # Non-target rows: clear result columns and pass through
        if row.get('betType') != TARGET_BET_TYPE:
            row['playerPrediction'] = ''
            row['playerLine']       = ''
            row['difference']       = ''
            row['status']           = ''
            output_rows.append(row)
            continue

        row['playerPrediction'] = row.get('_player') or ''
        line = row.get('_line')
        row['playerLine'] = str(line) if line is not None else ''

        actual_raw = row.get('actualStat', '').strip()
        direction  = row.get('_direction', '')

        if not actual_raw or not row['playerLine'] or not direction:
            row['difference'] = ''
            row['status']     = ''
            skipped += 1
        else:
            try:
                actual = float(actual_raw)
                ln     = float(row['playerLine'])
                diff   = (actual - ln) if direction == 'Over' else (ln - actual)

                row['difference'] = str(round(diff, 4))
                if diff > 0:
                    row['status'] = 'Win'
                    wins += 1
                elif diff < 0:
                    row['status'] = 'Loss'
                    losses += 1
                else:
                    row['status'] = 'Push'
                    pushes += 1
            except (ValueError, TypeError):
                row['difference'] = ''
                row['status']     = ''
                skipped += 1

        # Clean up temp fields before writing
        for k in ('_player', '_direction', '_line', '_anchor_dt', '_team_a', '_team_b'):
            row.pop(k, None)

        output_rows.append(row)

    # Only write rows where we found an actual stat
    output_rows = [r for r in output_rows if r.get("actualStat", "").strip()]

    os.makedirs(os.path.dirname(OUTPUT_CSV), exist_ok=True)
    with open(OUTPUT_CSV, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction='ignore')
        writer.writeheader()
        writer.writerows(output_rows)

    print(f"\n[OK] Written: {OUTPUT_CSV}")
    print(f"\n{'='*80}")
    print(f"FINAL SUMMARY")
    print(f"{'='*80}")
    print(f"Total rows written: {len(output_rows):,}")
    print(f"Missing stats:      {skipped:,}")
    print(f"Wins:               {wins:,}")
    print(f"Losses:             {losses:,}")
    print(f"Pushes:             {pushes:,}")
    if wins + losses > 0:
        print(f"Win Rate:           {wins / (wins + losses) * 100:.2f}%")
    print("=" * 80)


if __name__ == '__main__':
    main()
