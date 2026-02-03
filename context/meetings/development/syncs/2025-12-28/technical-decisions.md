# Dev Sync - 2025-12-28 Technical Decisions

## Database Decisions

### is_banned Implementation
- Added to manual schema (not private, since private gets overwritten)
- Pulled list of ~11,658 banned users via Claude script
- Discord API limitations:
  - No ban timestamp provided
  - Sorted by user ID (not date) - useless for pagination
  - No way to get total count of banned users
  - Can miss bans that happen during fetch
- Decision: "Done poorly is all we need" - just need current banned list for analytics filtering

### Ticket Type Instructions
- Stored in database in `instructions_to_user` field
- Can be edited directly in SuperBase - changes reflect immediately
- Caveat: Adding NEW ticket types won't immediately reflect in Discord commands (requires manual command update)
- To-do exists in codebase: "automatically update the options when the ticket type table changes"

### Database Migrations
- Currently using Prisma's "development only" command (magic sync)
- Goal: Move to SQL migration files for better control and transparency
- SQL files allow: error prevention, readability, potential automation

## Git Workflow Decisions

### Branch Naming Convention
- Use kebab-case (dashes) - "skewer case"
- Example: `testing-evbot-link`

### Branching Rules
- Always create new branches FROM main
- Don't branch off of feature branches
- Keep changes small - even tiny diffs warrant caution before pushing to prod
- Commit and push as separate steps to catch mistakes

## PostHog Limitations Discovered

### Dashboard Filters
- Can't apply dashboard-level filters to data warehouse tables
- Have to add filters on individual series
- Makes EV alerts analysis impractical in PostHog
- Conclusion: PostHog isn't the right tool for EV alert analysis unless piped as native events

### Data Warehouse Sync
- Tables not auto-updating (month+ stale)
- Postgres has replication feature that PostHog uses - only copies changes
- Materialized views in manual schema for custom queries

## Website/Domain Decisions

### Framer/Cloudflare Setup
- www.dropoutdegens.com → Framer (landing page)
- dropoutdegens.com → Real website (handled by Cloudflare)
- Don't add root domain to Framer - causes redirect issues
- Removed duplicate routing that was causing 404s
