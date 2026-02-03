# Dev Sync - 2026-01-17 Summary

## Overview

Working session between Zack (Bellcube) and Dax (AsiaD) focused on debugging welcome tickets, setting up Claude.md documentation, and planning new calculator bot features.

## Participants

- **Zack (Bellcube)** - Lead developer (side job; his main job went from 53 to 40 hrs/week, freeing up more time)
- **Dax (AsiaD)** - Founder

## Main Topics Covered

1. **Welcome Ticket Debugging** - Found race condition with Discord API, fixed with 2-second wait
2. **Invite Link System** - Updated tracking in manual table with source attribution
3. **Claude.md File Creation** - Generated ~4800 line documentation file for the codebase
4. **Calculator Bot Planning** - Discussed odds converter, parlay calculator, hedge calculator
5. **Ticket Types Setup** - Configured expired sub (-20) and premium walkthrough (-30)
6. **Framer/Cloudflare Troubleshooting** - Ongoing redirect issues

## Key Outcomes

- Fixed welcome ticket race condition (merged to prod)
- Created comprehensive Claude.md file in Discord bot repo
- Set up expired sub ticket type (now active)
- Created premium walkthrough ticket type (needs wiring)
- Offboarded Frosted from GitHub
- Dax pushed branch with new invite codes

## Technical Discoveries

- Discord's Elasticsearch needs ~2 seconds to index new joins before querying
- New Discord API feature: invites can now grant roles (as of Jan 13)
- MCP connections burn lots of tokens during setup
