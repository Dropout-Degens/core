# Dev Sync - 2025-12-02 Systems Context

## Database Structure (SuperBase)

### Users Table
- Stores jurisdiction_id (from partner promo bot)
- latest_join_method - how they joined
- latest_discord_join_invite_code - what invite code used
- latest_discord_join_inviter_username - who invited them
- has_joined_discord - flag indicating they got welcome message
- karma - current karma amount
- weekly rewards data (last claimed, streak, last best)
- bankroll/unit size data
- age range (min/max from partner promos)

### Tickets Table
- discord_thread_id
- created_at / updated_at
- human_id - ticket number for humans (not Discord snowflake)
- user_control_message_id - first message at top
- type_id - references ticket_types table
- started_for_id - user the ticket is for
- started_by_id - user who created it (null if bot/automatic)
- started_by_staff - if staff created via slash command
- status

### Ticket Transcripts Table
- Full JSON dump of all messages when ticket deleted
- Always saved on deletion (no option to skip)
- For auditing purposes

### Other Tables Referenced
- partner_promo_claims - when users claim promos
- poll_votes - compound key (poll_id + user_id)
- auth_sessions - website login sessions
- memberships - subscription records
- coupons - weekly rewards coupons
- ticket_types - types of tickets (future CMS candidate)

## Memberships Table Structure
- backend_id - internal database ID
- subscription type
- positive_flags - bit field (3 = all access, combines player props + sportsbook bits)
- expiration date

## User Journey Data Flow

1. User joins server → user record created
2. Welcome message sent → has_joined_discord = true
3. Welcome ticket created → ticket record with timestamps
4. User interacts with bots → various data captured
5. User signs into website → auth_sessions record
6. User subscribes → memberships record
7. Subscription expires → (should create exit ticket, may be bugged)

## Bot Interactions Catalogued

| Bot | Data Captured |
|-----|---------------|
| Partner Promo Bot | Jurisdiction, age range, which partners claimed |
| Polls Bot | Vote records (who, when, what) |
| Karma | Current karma in user record |
| Weekly Rewards | Last claimed, streak, coupons |
| Bankroll Bot | Unit size changes |
| EV Bot | Sports followed, betting preferences |
| Props Cache Bot | Slash command (auto-tracked) |
| Carl Bot | Role selections (via reactions) |
| Tickets | Creation, status, transcripts |

## Infrastructure

- **Google Cloud** - Logs for bot activity
- **PostHog** - Analytics events (Data Warehouse > Sources > PostHog > Events)
- **SuperBase** - PostgreSQL database
- Discord bot runs locally during dev, uses Claude Code
