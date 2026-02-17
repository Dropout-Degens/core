# Dev Sync - 2026-02-10 Active Development

## Completed This Session

- [x] Fixed welcome tickets — removed required join method field, tickets now create for all joins
- [x] Built invite source messaging via Claude Code (bot posts where new member joined from)
- [x] Deployed invite source messaging to prod (live as of this session)
- [x] Fixed EV alert logging bug — wrong variable for sportsbook name ("Object Promise" error)
- [x] Set up Dax's local development environment (Scoop, Docker Desktop, Supabase CLI, WSL, BIOS virtualization)
- [x] Configured .env file for Discord bot local development
- [x] Installed project dependencies via PNPM
- [x] Learned git stash/pop/branch workflow
- [x] Published welcome-messaging branch and created PR

## Still In Progress

- [ ] Premium walkthrough tickets — need to store ticket IDs on user record, trigger on first paid + first trial (Zack's priority)
- [ ] Flif EV channel routing — alerts going to wrong channel, needs filter + channel ID update (Dax's task)
- [ ] Calculator bot PR — needs Prisma schema updates before merge (Dax to fix with Claude Code)
- [ ] Invite source messaging — may have a bug (test user joined but no message appeared; needs log investigation)
- [ ] New EV alert channels — 5-6 new channels being ingested, need proper routing

## Upcoming Tasks

### Zack (Priority Order)
1. [ ] Premium walkthrough tickets — store ticket IDs on user table, trigger on first paid + first trial subscription
2. [ ] Review Dax's calculator bot PR and provide feedback
3. [ ] Review other Claude Code PRs from Dax

### Dax
1. [ ] Update Flif EV channel routing (filter + channel IDs) in `source/ev-alert-handling/`
2. [ ] Fix calculator bot Prisma schema issues so PR can merge
3. [ ] Update welcome ticket DM content (markdown/Components V2 format)
4. [ ] Investigate invite source messaging bug (check logs for missing join event)
5. [ ] Update partner promo bot state availability data (6 months outdated — use Claude for SQL)
6. [ ] Plan Greened Out channel image tracking (storage buckets + database table)
7. [ ] Set up WAP, Dub Club, Winnable/Unwinnable subscription listings
8. [ ] Continue building AI context in core repo

## PR / Code Review Process

- Dax makes PRs for all Claude Code work
- Links Routine PRD document in PR description
- Zack reviews on GitHub
- Dax should tag Zack in general dev chat if blocked or has questions

## Future Planning

### Email Marketing (Not Started)
- Use Stripe `customer.subscription.trial_will_end` webhook
- Funnel: 3-day free trial → email before expiry → offer 7-day trial (with payment info) or partner signup for free access
- Noted for future implementation

### Greened Out Channel Tracking (Not Started)
- Store bet slip images in Supabase Storage Buckets
- Database table with message ID as primary key
- Track per-user win totals
- Sum monthly shared wins (e.g., "X amount of shared wins in February")

## Next Sync

- Target: 1-2 weeks out
- Focus: Premium walkthrough tickets, calculator PR review, Flif EV routing verification
- Communication: Dax tags Zack in general dev chat for async questions