# Zack (Bellcube) — Current Context

**Last Updated:** January 17, 2026
**Role:** Lead Developer
**Status:** Active — more time available now that main job reduced to 40 hrs/week

---

## Background

Zack (Discord: Bellcube) is the head developer for Dropout Degens. Working for DD is his side job — his main employment recently went from 53 to 40 hours per week, freeing up more time for DD work. He's based in Pittsburgh, Pennsylvania.

He manages all the technical infrastructure including the Discord bot, database (SuperBase), website backend (Next.js), and integrations with Stripe, PostHog, and Cloudflare.

## Current Role & Responsibilities

**Lead Developer** — owns all code and infrastructure

### Day-to-Day
- Code reviews on all pull requests
- Merging code to production
- Debugging infrastructure issues
- Managing database schemas and migrations
- Discord bot maintenance and feature development

### Technical Ownership
- Discord bot (TypeScript, Discord.js)
- SuperBase/PostgreSQL database
- PostHog analytics integration
- Cloudflare configuration
- GitHub repository management
- Google Cloud logging

### Code Review Process
- All code goes through PR review before merge
- Zack handles the merge to main
- Emergency exception: direct push to main allowed for critical fixes (database down, etc.)

## Work Arrangement

- **Side job:** DD is not his primary employment
- **Availability:** More flexible now with reduced main job hours
- **Communication:** Available in general dev channel on Discord
- **Meeting cadence:** Syncs with Dax as needed (roughly monthly working sessions)

## Technical Preferences

### Code Style
- Prefers existing codebase patterns over rewrites
- Wants AI-generated code to match existing structure
- Dislikes "tutorial-like" code (console logs everywhere, no error handling)
- Changes to architecture should be discussed before implementation

### Documentation
- Created Claude.md file (~4800 lines) for the Discord bot repo
- Each repo should have its own Claude.md for AI context
- READMEs are often out of date — code is source of truth

### Infrastructure Philosophy
- Database stores current state
- PostHog stores historical/time-based analytics
- Manual schema for human-managed data (separate from code-managed schemas)

## Recent Work (as of Jan 2026)

- Fixed welcome ticket race condition (Discord Elasticsearch needs 2-second delay)
- Set up ticket types system (expired sub -20, premium walkthrough -30)
- Created comprehensive Claude.md documentation
- Offboarded Frosted and Amlan from GitHub
- Ongoing: Framer/Cloudflare redirect issues

## Upcoming Priorities

- Calculator bots (odds converter, parlay, hedge)
- Premium walkthrough ticket automation
- First-time subscription detection (Stripe webhook complexity)
- Weekly rewards timing updates

## Unique Considerations

- Has deep knowledge of Discord API quirks (rate limits, Elasticsearch timing, pagination issues)
- Manages his own projects on same Cloudflare account (Bellcube Consortium)
- Familiar with MCP connections but notes industry is moving away from them
- Prefers discussing changes before implementation rather than reviewing surprise rewrites

---

## Meeting History

| Date | Type | Key Outcome |
|------|------|-------------|
| 2025-12-02 | Working session | Database schema walkthrough. PostHog analytics setup. Created manual schema for human-managed data. |
| 2025-12-28 | Working session | Amlan code review and offboarding decision. VS Code/Git tutorial for Dax. Cloudflare routing fixes. |
| 2026-01-17 | Working session | Welcome ticket race condition fixed. Claude.md created. Ticket types configured. Calculator bots planned. |
