# Dev Sync - 2025-12-02 Active Development

## Completed This Session

- [x] Added `created_at` column to users table
- [x] Created `manual` schema for human-managed data
- [x] Built PostHog client integration
- [x] Added Discord events to PostHog tracking
- [x] Added karma_modified event
- [x] Added author_id field to reactions tracking
- [x] Pushed PostHog integration live

## Tasks Identified (Not Yet Done)

### Database
- [ ] Add `is_banned` flag to users table
- [ ] Track actual Discord join date (separate from record created_at)
- [ ] Investigate: More people have all-access role than active subscriptions (membership expiration bug?)

### Analytics
- [ ] Set up PostHog visualizations once data starts flowing
- [ ] Figure out bar chart for EV data (-500 to positive range)

### Future Considerations
- [ ] Build CMS/admin dashboard for ticket types (so non-devs can manage)
- [ ] Exit ticket automation when subscription expires
- [ ] Weekly rewards needs more incentivization (low usage currently)

## Message Volume Context

From Google Cloud logs query:
- ~55,751 total messages/month (including bots)
- ~2,079 messages/month excluding Dropout Degens bot and Outliers bot
- TicketTool contributes ~28 messages
