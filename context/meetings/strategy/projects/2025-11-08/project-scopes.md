# Strategy Session — EV Filter Publishing — Project Scope — November 8, 2025

---

## EV Filter Publishing

### Opportunity
DD has been receiving EV and custom optimizer data from OddsJam and Daily Grind Fantasy. The retrospective data shows which markets are profitable — e.g., when DGF rates an event at 56.1% odds-to-hit, it actually hits ~65% of the time, and they're correct ~80% of the time. By applying filters based on this data, DD can send only the most profitable alerts to users instead of the full firehose.

### What Is Being Built
Not a new system — an update to the existing bot. Taking notifications from the EV backlog section and routing them into sport-specific public channels with filters applied:
- NFL notifications → football channel
- MLB → baseball channel
- NCAA basketball / NBA → basketball channel
- And so on per sport

### How It Works
1. Analyze retrospective data to find profitable market thresholds per sport
2. Define static filters (e.g., baseball + strikeouts + odds-to-hit ≥ 56.1)
3. Apply filters to incoming EV notifications
4. Route filtered notifications to the appropriate sport-specific channel
5. Users see only high-probability alerts in channels they care about

### KPI Impact
- **Number of filters applied** — how many profitable market filters are active
- **Filter performance** — how the filtered alerts actually perform (win rate)
- **Notification volume** — enough alerts per day to be useful, not so many it's noise
- **Future: Admin dashboard** — ability to see how many notifications sent, what they are, cycle through them

### Long-Term Potential
- Opens the possibility of embedding major sportsbook affiliate links (FanDuel, DraftKings) into EV alerts → increases conversions
- Unblocks a marketing push around validated EV data
- Creates a provable track record for DD's betting edge
- Future transition from static filters to dynamic algorithm
- Currently only have ProfitX link and daily DFS partnerships linked — this expands partnership revenue potential significantly