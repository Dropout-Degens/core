# Dev Sync - 2026-02-10 Systems Context

## GitHub Context Storage

### Structure
- Dax storing AI context in `core/` repo (which is a submodule of all other repos)
- Zack confirmed this is the right location — context gets included in all repositories
- Contains: meeting transcripts, processed meeting notes, Claude.md draft, channel documentation

### Two Context Tiers
1. **Internal (AI context):** Meeting transcripts → AI processes into summary, technical decisions, systems context, active development → feeds back into Claude.md and agent context
2. **External (team context):** Routine workspace with goals, projects, partner info → shared with staff for business visibility

### Workflow
- Meeting transcripts → Claude processes → distilled documentation → Claude.md updates → better AI assistance
- "AI is gonna get all of my vibes... distill them into quick bits of documentation"

## Invite Link Management

### Current State
- Purged all old/corrupted invite links
- Stored purge history in manual schema (which links were from where, relevance)
- Turned off vanity link
- All active invites tracked with source attribution
- If an invite gets corrupted → kick it, create new one

### Manual vs Private Schema
- Currently in manual schema
- If bot starts actively using invite data → move to private schema
- Dax can manually edit data but cannot change schema (no columns/tables)

## EV Alert Channel System

### File Structure
Located in `source/ev-alert-handling/`:
- `hard-coded-channels` — one object per channel containing: filter, channel ID, ping configuration
- `hard-coded-data` — supporting data for filters
- `hard-coded-paintings` — additional filter configuration

### Channel Configuration
- Each channel object is self-contained: filter + channel ID + ping config
- No jumping between files needed for a single channel
- Code editor provides autocomplete for filter options
- New EV channels being ingested: 5-6 additional channels added

### Current Issue
- Flif alerts going to basketball EV channel instead of Flif-specific channel
- All channel IDs need updating (new channels created)

## Supabase Storage Buckets

### What They Are
- Separate from the database — not in any schema
- Simple file storage: give files a name, dump them in
- Accessible via Supabase client library
- Found under Storage in Supabase dashboard sidebar

### Planned Usage
- Greened Out channel bet slip images
- Use message ID as storage key (matches database primary key)

## Prisma ORM Context

### How It Works
- Stores database schema in text files
- Generates JavaScript library for database queries (no SQL needed)
- Generates database schema from those text files
- Requires database connection to generate types (quirk: needs live Postgres for custom SQL type inference)

### Prisma vs Drizzle
- Zack prefers Drizzle for most use cases
- Drizzle advantages: schema stored in JavaScript (more flexible), SQL-like query syntax, same type safety
- Prisma advantage: already in use in DD codebase
- Both are ORMs (Object Relational Mapping) — map between programming objects and relational database records

### Migration System
- Incremental SQL files generated from schema changes
- Each migration captures only the diff since last migration
- Cannot be run without properly updating schema files first

## Local Development Setup (Dax's Machine)

### Installed This Session
- **Scoop** — Windows package manager (via PowerShell)
- **Docker Desktop** — required for local Supabase (needed BIOS virtualization enabled)
- **Supabase CLI** — installed via Scoop
- **WSL update** — Docker required updated Windows Subsystem for Linux
- **PNPM** — package manager, installed via `corepack use pnpm`

### Environment Configuration
- `.env` file created in Discord bot folder
- Values populated from local Supabase instance (not production credentials)
- `example.env` already existed in repo (maintained by automated tests)
- Claude Code discovered the example.env and helped populate

### BIOS Configuration
- Had to enable virtualization support in BIOS for Docker
- Required restart and motherboard-specific BIOS navigation

## Subscription Platform Expansion

### Planned Platforms
- **WAP** — returning to (code never removed from codebase)
- **Dub Club** — new listing
- **Winnable/Unwinnable** — new listing

### Strategy
- Use these platforms as acquisition channels
- Eventually migrate users to DD's own site
- Not merging all members over — just using as marketing funnels
- Need to be cognizant of how subscription data from these platforms gets ingested
- Users joining via these platforms will need premium walkthrough tickets created

## Stripe Webhook Events

### Currently Handled
All subscription events handled to prevent crashes:
- `subscription.created`, `subscription.deleted`, `subscription.updated`
- `subscription.paused`, `subscription.pending_update_applied`
- `subscription.pending_update_expired`, `subscription.resumed`
- `subscription.trial_will_end` (new — useful for email marketing)

### Email Marketing Opportunity
- `trial_will_end` event → send email: "Your trial is expiring, here's a 7-day trial with payment info, or get free access through our partners"
- Funnel: 3-day free trial (no payment) → 7-day trial (payment info required) → partner signup for free access

## Components V2

- Discord's current message formatting system
- Used for all bot messages (embeds, interactive elements)
- Standard across the DD codebase — "literally everywhere"
- When building new bot messages, use Components V2 format