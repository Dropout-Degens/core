# Dev Sync - 2026-01-17 Systems Context

## Invite Link Tracking System

### Manual Table Structure
- Stores invite codes with source attribution
- Tracks where each code is currently posted
- Four codes currently live
- All invites now from Dropout Degens bot (can create unlimited)

### How Welcome Tickets Work
1. User joins via invite link
2. Bot receives join event from Discord
3. Bot waits 2 seconds (race condition fix)
4. Bot queries Discord's Elasticsearch for invite data
5. If invite code matches one in list → create welcome ticket
6. Data stored in users table

## Claude.md Documentation

### What It Contains (4800 lines)
- Boot sequence, singleton pattern, broker pattern
- Directory structure
- Web server and data sync info
- Interactions and special messages
- Database access (Prisma, SuperBase real-time)
- How interactions are loaded
- Creating slash commands (guild-specific vs global)
- Debug commands
- Error handling patterns
- Environment validation
- Partner promo system
- Unit size calculator
- EV stream menu system
- Admin user menu
- Unreachable error utility (compile-time exhaustiveness check)

### Location
- Each repo gets its own Claude.md
- Discord bot repo has one now in main branch

## MCP Connections (For Claude)

### Setup
- Can connect to GitHub, SuperBase, Figma, PostHog
- Burns lots of tokens during initial connection
- Industry moving away from MCPs, new standards emerging frequently

### Dax's Setup
- Connected to SuperBase for live database queries
- GitHub personal access token as environment variable
- Using school's Claude enterprise plan (unlimited Claude.ai, no Claude Code)

## Cloudflare Traffic Stats

- Dropout Degens systems: ~12,500 requests/24 hours
- Zack's personal projects (Papyrus Index): ~650,000 requests/24 hours
- Bot contributes ~2,000 requests/day

## Subscription Detection Challenge

### Problem
- Need to detect when someone starts a subscription
- Stripe webhooks aren't clear about "first subscription" vs "renewal"
- Trial vs paid subscription distinction needed

### Considerations for Premium Walkthrough
- Only create ticket on FIRST subscription ever
- What about trial users? (Most leave within a day)
- Some trial accounts are compromised/bot accounts
