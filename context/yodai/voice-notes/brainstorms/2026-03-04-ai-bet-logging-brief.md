# AI Autonomous Bet Logging
Type: brainstorm
Date: 2026-03-04

## Summary
When YodAI gains the ability to place bets autonomously, use Discord's "I placed this bet" button (which writes to `EVAlertPlacedBet`) as the native logging mechanism instead of updating a spreadsheet. This keeps all bet records in Discord and the database, maintaining a single source of truth.

## Key Points
- Current system: Manual button clicks to log placed bets in `EVAlertPlacedBet` table
- Proposed: YodAI triggers the same button action when placing bets autonomously
- Benefit: Native Discord logging instead of spreadsheet maintenance
- Removes dependency on manual spreadsheet updates as a tracking mechanism

## Context (from clarifying questions)
**Q2 Answer:** When YodAI is placing bets autonomously, the Discord button becomes the logging method instead of spreadsheet updates.

## Next Steps
- Determine what permissions/API access YodAI needs to trigger the "I placed this bet" button handler
- Design bet placement workflow that includes automatic logging to Discord
- Coordinate with Zach on enabling this functionality
