# Dev Sync - 2025-12-28 Summary

## Overview

Working session between Zack (Bellcube) and Dax (AsiaD) covering developer offboarding, roadmap review, VS Code/Git tutorial, and various infrastructure issues.

## Participants

- **Zack (Bellcube)** - Lead developer
- **Dax (AsiaD)** - Founder

## Main Topics Covered

1. **Amlan Code Review & Offboarding** - Reviewed poor quality work, decided to offboard
2. **Roadmap Overview** - Discussed pivot to education-focused model
3. **PostHog Data Warehouse Limitations** - Dashboard filter limitations discovered
4. **is_banned Flag Implementation** - Discord API issues make this difficult
5. **VS Code/Git Workflow Tutorial** - Full walkthrough for Dax to make code changes
6. **Cloudflare/Framer Website Issues** - Domain routing problems fixed

## Key Outcomes

- Decided to offboard Amlan (revoked email access, rerouted to Dax)
- Dax made first manual Git commit (removed linked roles from welcome message)
- Added is_banned data to manual table in database
- Fixed Cloudflare routing issues with Framer
- Established workflow: Dax can edit ticket type instructions directly in database

## Problems Identified

- Amlan's code didn't use existing data structures, created branch incorrectly
- PostHog can't do dashboard-level filters on data warehouse tables
- Discord API doesn't provide ban timestamps or reliable pagination for bans
- AI-generated code tends to be "tutorial-like" (console logs, no error handling)
