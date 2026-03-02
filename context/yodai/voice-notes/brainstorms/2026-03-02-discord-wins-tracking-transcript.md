# Discord Wins Tracking System
Type: brainstorm
Date: 2026-03-02

## Raw Transcript
Planning conversation about building a wins tracking system for the #1089370397004279939 channel (wins-only channel).

Key concept: Extract individual bets from Discord win screenshots, store images in Supabase, and create manual table records with full bet details.

Constraints identified:
- One message might have multiple images
- One image might have multiple bets
- Cannot reliably auto-parse image content — user will manually extract bet details

User will handle content extraction from images. System needs to support:
- One record per individual bet (even if multiple bets in same image)
- Link each record to source image in Supabase storage
- Attribution by Discord user snowflake (message author)

Storage structure planned:
- `wins/greened-out/{year_month}/{day}/`
- Need unique ID per image to reference in database
- Clarification pending on ID format

Fields under review:
- Bet identification (bet_id, placement_time)
- Wager details (amount, odds_format, odds_value)
- Result (payout, profit/loss)
- Bet composition (num_legs, bet_type)
- Sport/event (sport, league, event_name, teams)
- Sportsbook (app_name, state)
- Metadata (screenshot_timestamp, bet_status)

Pending decisions:
1. Which fields are essential vs. nice-to-have
2. Unique ID naming scheme for images
3. Table schema design
