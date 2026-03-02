# Discord Wins Tracking System
Type: brainstorm
Date: 2026-03-02

## Summary
Building a system to track individual bets from win screenshots posted in the #1089370397004279939 Discord channel. User manually extracts bet data from images; system stores images in Supabase and creates database records linking each bet to its source image.

## Key Points
- **Channel scope**: wins-only channel, narrowing field possibilities
- **Parsing approach**: Manual extraction by user (not automated vision) — all fields will be user-provided
- **Granularity**: One table record per individual bet, even if multiple bets appear in same image
- **Image storage**: Supabase storage at `wins/greened-out/{year_month}/{day}/` with unique ID per image
- **User attribution**: By Discord snowflake (message author)
- **Backfill**: No historical data — start fresh from first image in channel once planning complete
- **Data linking**: Each bet record includes image URL/path reference

## Potential Fields Under Review
Bet identification, wager details, result (payout/profit), bet composition (legs/type), sport/event info, sportsbook, metadata (timestamp, status)

## Next Steps
1. Confirm which fields are essential vs. optional
2. Decide on unique image ID naming scheme
3. Design manual table schema
4. Build Supabase storage structure
5. Create workflow for entering records (UI or direct DB?)
