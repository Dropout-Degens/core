# Dev Sync - 2026-02-10 Summary

## Overview

Extended working session between Zack (Bellcube) and Dax (AsiaD) covering welcome ticket fixes, invite tracking messaging, premium walkthrough tickets, EV alert channel routing, local development setup, and educational tangents on software engineering concepts.

## Participants

- **Zack (Bellcube)** - Lead developer
- **Dax (AsiaD)** - Founder

## Main Topics Covered

1. **Code Comments Education** - Zack taught Dax about "why" comments vs "what" comments, split brain problem
2. **GitHub Context Storage** - Dax storing meeting transcripts and AI context in core repo
3. **Welcome Ticket Fix** - Removed required join method field that was blocking ticket creation
4. **Invite Source Messaging** - Built bot message showing where new members joined from (e.g., "from Discord.me")
5. **Premium Walkthrough Tickets** - Discussed first-paid vs first-trial ticket creation, Stripe `trial_will_end` webhook
6. **Flif EV Channel Routing** - EV alerts sending to wrong channel; needs filter update
7. **EV Logging Bug** - Wrong variable being logged for sportsbook name (Object Promise error)
8. **Subscription Platform Expansion** - Planning to list on WAP, Dub Club, Winnable/Unwinnable
9. **Calculator Bot PR** - Dax's Claude Code branch needs Prisma schema updates before it can merge
10. **Local Development Setup** - Installed Scoop, Docker Desktop, Supabase CLI, configured .env
11. **Git Workflow Training** - Stash/pop workflow, branch creation, PR process
12. **Greened Out Channel Tracking** - Planning to store bet images in Supabase storage buckets
13. **Layup Bet Tracking Demo** - Showed Bankroll Capital's bet tracking bot, discussed blob URLs vs proper image serving

## Key Outcomes

- Welcome tickets now working (removed required join method field)
- Invite source messaging built via Claude Code (live in prod)
- EV logging bug identified and fixed (wrong variable name)
- Dax's local development environment set up (Docker, Supabase CLI, .env configured)
- Dax learned git stash/pop workflow for branch management
- Identified Stripe `customer.subscription.trial_will_end` webhook for future email marketing
- Premium walkthrough tickets still need implementation (Zack's priority)