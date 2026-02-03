# Dev Sync - 2026-01-17 Technical Decisions

## Welcome Ticket Race Condition Fix

### Problem
- Bot was querying Discord's Elasticsearch before data was indexed
- Join event received, but user data not available yet (500ms too fast)
- Result: "User not in guild" error, no welcome ticket created

### Solution
- Added 2-second wait before querying Discord for join data
- Added more debug logging to prod
- Merged fix to main

### Root Cause
- Discord's join event fires before their Elasticsearch indexes the user
- Had to reverse-engineer Discord's undocumented API to get invite data

## Ticket Type Configuration

### Hard-coded IDs (Negative Numbers)
- **-20** = Expired subscription ticket (now active)
- **-30** = Premium walkthrough ticket (created, needs wiring)

### Database Rules
- Updating CONTENTS of ticket_type table: Safe, do anytime
- Updating SCHEMA: Dangerous, gets overwritten by code deploys
- Negative IDs reserved for special/hard-coded ticket types

## Calculator Bot Specifications

### Ephemeral Messages
- Spelling: E-P-H-E-M-E-R-A-L
- Only visible to user who triggered command
- Disappear on reload/channel switch/Discord's whim
- Can be "published" to channel if user chooses

### Three Calculators Planned
1. **Odds Converter** - American ↔ Decimal ↔ Probability
2. **Parlay Calculator** - Combined odds for multiple bets
3. **Hedge/Arbitrage Calculator** - Find middle ground between opposing bets

### Input Validation
- Must be explicit about constraints
- Look at `collectNumericDataFor` function for reference
- Probability: Accept 0 to 0.9999 range

## Claude.md File Strategy

### Purpose
- Saves tokens by preventing Claude from exploring entire codebase
- Provides accurate context so Claude doesn't guess wrong
- Final size: ~4800 lines

### Creation Process
1. Initial prompt to document codebase
2. Review output
3. Tell Claude "go back and make sure you looked at everything"
4. Repeat 4-5 times until minimal new findings
5. Each repo gets its own Claude.md file

### GitHub Copilot Tip
- Access Claude via GitHub Copilot = 300 free requests/month
- Opus 4.5 charged at 3x rate (100 effective requests)
- Not charged by token, only by request

## Discord API Notes

### New Invite Features (As of Jan 13)
- Invites can now grant roles automatically
- Can restrict invites to specific users
- Decision: Not using for now (already have manual table solution)

### Security Discussion
- 2FA doesn't stop stolen session tokens
- Passkeys don't stop stolen tokens either
- Only defense: User logs out (kills token)
- Bot accounts getting hacked are often compromised by sketchy downloads
