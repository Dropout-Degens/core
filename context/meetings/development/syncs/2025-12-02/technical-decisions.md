# Dev Sync - 2025-12-02 Technical Decisions

## Database Schema Decisions

### New Column Added
- **created_at** on users table - Tracks when user record is created (wasn't tracked before)

### Schema Organization
- **private/public schemas** - Code-managed only, manual changes get overwritten on deploy
- **manual schema** - New schema created for human-managed data (partner redemption tracking, views, etc.)
- Rule: Don't put anything in private/public that isn't managed by code

### Existing Column Clarification
- **latest_discord_join_updated** - NOT for analytics, exists only for backend error fixing when Discord API breaks

## Analytics Strategy

### Core Principle
- **Database** = Current state only (what is their karma NOW)
- **PostHog** = Historical/time-based data (karma changes over time)
- Don't duplicate - if it's for analytics queries, use PostHog

### PostHog Pricing
- First million events free
- ~10 million in free tier
- Fractions of a cent per event after that

## Discord Events to Track in PostHog

### Keep (tracking these):
- Guild member add/remove
- Message create/delete
- Invite create/delete (for word-of-mouth tracking)
- Thread create
- Interaction create (slash commands, button clicks)
- Poll votes
- Karma modified (custom event)

### Skip (not tracking):
- Channel CRUD
- Channel pins update
- Presence update
- Message update
- Shard events
- Stage events
- Sticker/soundboard/subscription CRUD
- Scheduled events

## Bot Event Tracking

- All slash commands automatically get events (built-in)
- Partner promo bot already has analytics
- Bankroll bot already has analytics
- Added author_id field to reactions for role selection tracking
