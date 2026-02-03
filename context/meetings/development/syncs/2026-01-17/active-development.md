# Dev Sync - 2026-01-17 Active Development

## Completed This Session

- [x] Diagnosed welcome ticket race condition
- [x] Fixed race condition with 2-second wait
- [x] Added debug logging to prod
- [x] Merged welcome ticket fix to main
- [x] Dax pushed branch with new invite codes
- [x] Created Claude.md file (~4800 lines) in Discord bot repo
- [x] Set up expired sub ticket type (ID: -20, now active)
- [x] Created premium walkthrough ticket type (ID: -30)
- [x] Offboarded Frosted from GitHub
- [x] Connected MCP to SuperBase

## Still In Progress

- [ ] Welcome ticket testing (bot still churning through backlog updates)
- [ ] Framer/Cloudflare redirect issues (www working, root domain weird)

## Upcoming Tasks

### This Weekend (Dax)
- [ ] Build odds converter calculator with Claude
- [ ] Create PRD documents for all three calculators
- [ ] Test calculators in DDAI/Yoda bot first
- [ ] Send PRDs to Zack for review

### Calculator Bots to Build
1. **Odds Converter** - American/Decimal/Probability conversion
2. **Parlay Calculator** - Calculate combined parlay odds
3. **Hedge Calculator** - Find arbitrage middle ground

### Tickets System
- [ ] Wire up premium walkthrough ticket automation
- [ ] Detect first-time subscription starts (Stripe complexity)
- [ ] Decide: Trial users get walkthrough ticket?

### Other Priorities
- [ ] Fix Framer hosting (www vs root domain)
- [ ] Weekly rewards updates (500 karma to refresh timing)
- [ ] Website pricing page update
- [ ] Send subscription start message to new subscribers

## Code References Shared

- Invite codes location: Found in codebase (Zack showed)
- Numeric data collection: `collectNumericDataFor` function
- For EV alerts reference when building calculators

## Next Sync

- Target: Last week of January
- Focus: Review calculator PRDs, push to bot, premium walkthrough tickets
