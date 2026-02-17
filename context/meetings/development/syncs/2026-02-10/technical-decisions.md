# Dev Sync - 2026-02-10 Technical Decisions

## Welcome Ticket Fix

### Problem
- Welcome tickets not being created for new members
- Join method field was set to required in the schema but Discord wasn't providing it reliably

### Solution
- Set join method field to not required (empty string default)
- Tickets now create for all joins regardless of join method data availability

## Invite Source Messaging

### Implementation
- Bot sends a message when someone joins showing which invite link/domain they came from
- Built by Dax using Claude Code during the session
- Uses Components V2 format for embed styling (standard across all bot messages)
- Should use `clientPromise.then()` pattern to register handlers, NOT register listeners inside Bot Handler directly

### Bug Found
- Claude Code initially registered a listener inside Bot Handler (old pattern)
- Corrected to use `clientPromise` from client broker file
- Claude Code also added unnecessary import of `Client` from discord.js — removed

## EV Alert Logging Bug

### Problem
- Errors channel getting spammed with "Object Promise is not a known sports book"
- Was logging the wrong variable for sportsbook name

### Solution
- Fixed the variable reference in the logging code
- Just a logging bug — the actual EV alert processing was working fine (DGF plays unaffected)

## Flif EV Channel Routing

### Problem
- Flif sportsbook EV alerts sending to generic basketball EV channel instead of dedicated Flif channel

### Solution (Assigned to Dax)
- Update EV alert channel filters in `source/ev-alert-handling/`
- Three files to edit: `hard-coded-channels`, `hard-coded-data`, `hard-coded-paintings`
- Add filter clause: if sportsbook is Flif AND meets criteria → send to Flif channel
- Also update channel IDs (all new channels created)
- Filter format is simple — code editor provides autocomplete for available options
- Dax to manually update channel IDs (AI not reliable for Discord IDs)

## Premium Walkthrough Tickets

### Requirements
- Create ticket on first paid subscription AND first free trial (two separate tickets per user)
- If user already had a membership, exclude from new ticket
- Store ticket IDs on user record in database (not just a boolean)

### Stripe Webhook Discovery
- `customer.subscription.trial_will_end` event available from Stripe
- Useful for future email marketing: notify users before trial expires, offer 7-day trial with payment info, or direct to partner signups for free access
- Zack already handles all Stripe webhook events to prevent crashes from new event types

### Architecture Decision
- Store paid walkthrough and trial walkthrough ticket IDs directly on user table
- Better than boolean flags — provides audit trail and reference to actual tickets
- Avoids "imperfect detection methods and vibes"

## Calculator Bot PR Issues

### Problem
- Dax's Claude Code branch for calculators wants to add database tables but didn't update Prisma schema
- Build fails — bot won't deploy without matching Prisma files

### Solution
- Claude Code needs to update Prisma schema files to match any new database tables
- Dax needs local Supabase running for Prisma to generate types (requires database connection)

## Database Editing Rules (Reiterated)

- Dax CAN manually edit data in the database
- Dax CANNOT change schema (no adding/removing columns or tables)
- Schema changes break things because code deploys overwrite schema
- Invite links can be managed in manual schema; if bot starts using them, data moves to private schema

## Greened Out Channel — Image Storage

### Architecture
- Store bet slip images in Supabase Storage Buckets (NOT in the database as PNGs)
- Use message ID as primary key for the database table
- Flow: receive image → (1) write metadata to database AND (2) upload image to storage bucket simultaneously → once upload completes, update database record to confirm image stored
- Relations: many-to-one supported (multiple images per user, etc.)

### Layup/Bankroll Capital Analysis
- Their app uses blob URLs (JavaScript-created temporary URLs) for images
- Images stored in Firebase with authentication tokens
- Zack identified this as over-engineered — could use proxy server or query string auth instead
- Likely vibe-coded or template-derived

## Code Comments Philosophy (Educational)

### Good Comments
- "Why" comments — explain why code does something unusual
- Example: using `process.env` directly instead of the validated `env` variable for Google App Engine deployment IDs
- Only needed when doing something that looks wrong or out of place

### Bad Comments
- "What" comments — describe what code does (just read the code)
- AI-style tutorial comments
- Comments longer than the code they describe
- Split brain risk: comment says one thing, code does another after updates

### Code Readability
- Code should read like English given context of function name and program
- If it can't be read, abstract into a separate function
- School teaches tutorial-style comments which are counterproductive in production