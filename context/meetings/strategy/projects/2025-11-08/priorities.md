# Strategy Session — EV Filter Publishing — Priorities — November 8, 2025

---

## Priority Sequence

1. **Create filters** — Analyze retrospective data to identify profitable markets per sport (baseball strikeouts at odds-to-hit ≥56.1, etc.)
2. **Break down by sport** — Filters need to be created for overall markets AND per-sport (baseball, football, basketball, etc.) across all sportsbook markets
3. **Route notifications** — Send filtered EV alerts from the backlog into sport-specific public channels
4. **Pass to dev team** — Hand filters to Bellcube for implementation in the bot
5. **Future: Build algorithm** — Move from static filters to a dynamic algorithm (not immediate)

## Dependencies

- Filter creation blocks everything else — can't route notifications without knowing which markets to include
- Dev implementation blocks public release — filters need to be coded into the bot
- Admin dashboard (future) would need to show: how many notifications sent per day, what those notifications are, ability to cycle through them