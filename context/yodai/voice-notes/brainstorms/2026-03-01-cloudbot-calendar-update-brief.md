# Cloudbot Calendar Update
Type: brainstorm
Date: 2026-03-01

## Summary
Need to update Cloudbot's Google Calendar parsing to recognize two new event patterns: 15-minute events as task reminders (not time blocks), and all-day events as partner promo/content batches that will be coded and tagged later.

## Key Points
- **15-minute events** = task reminders only ("do this today"), not actual time commitments
- Sequential execution — timing/order doesn't matter, will do them back-to-back
- **All-day events** = partner promo content batches (e.g., "Sleeper" promos today)
- Will rebuild recurring partner promo schedule first (was previously set up)
- Refinement on promo coding/tagging to come later
- Cloudbot needs to understand these are different event types

## Context
- Used to have recurring partner promo events per day of week
- Currently rebuilding personal schedule — existing calendar events available for reference
- Will refine cross-reference logic between all-day batches and additional content later
- Specific coding/tag system for promos to be added in follow-up

## Next Steps
1. Rebuild recurring partner promo all-day events (on your end)
2. Update Cloudbot calendar parsing logic to distinguish 15-min reminders vs. actual events vs. all-day batches
3. Refine promo coding and cross-reference logic (TBD)