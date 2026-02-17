# Strategy Session — Project Backlog — Project Scopes — November 12, 2025

---

## 1. Partner Promo Bot Update

### Opportunity
The bot is already built and functional. Users can select their state and age range to see available partner offers. But the vanity/UX aspects need updating to improve conversion rates — make links easier to access, add partner logos, update emojis.

### What Is Being Built
Updates to the existing bot interaction (not core functionality):
- Add partner emojis to the bot display
- Add partner logo images to the details pages
- Make partner names clickable hyperlinks (currently just text)
- Bold partner names in the unclaimed promos view

### How It Works
Same user interaction flow — bot shows personalized partner offers by state/age. Just looks better and converts better.

### KPI Impact
- Total bot usage (how many people interact with it)
- Conversion rate impact (do more people claim partners after the update)

### Long-Term Potential
- Easier to scale conversions as partner list grows
- Unlocks demographic data collection (state, age range) for targeting
- Enables transition from "check out all our partners" to personalized recommendations
- Supports premium price increase by improving the free-access-through-partners funnel

### Next Steps
1. [ ] Update all partner emojis
2. [ ] Add partner assets/logos to details pages
3. [ ] Make partner names clickable hyperlinks + bold
4. [ ] Publish updated bot in the free access channel

---

## 2. Weekly Rewards Update

### Opportunity
Weekly rewards already exist as a bot command. Users spin for a prize weekly. Want to integrate karma to create an engagement loop — spend karma to refresh your timer, chance to win karma back.

### What Is Being Built
Updates to prize distribution and karma integration:
- New prize distribution (TBD — Dax needs to determine specifics)
- Ability to spend 500 karma to refresh weekly rewards timer
- ~25% chance of winning 500 karma back as a prize

### How It Works
User runs `/weekly-rewards` → sees dashboard with possible rewards → spins → gets reward. New: option to spend karma to reset the timer and spin again.

### KPI Impact
- Volume of usage (how many people use it per week)
- Engagement impact

### Long-Term Potential
- Creates a karma sink that gives karma more meaning
- Gets people engaging weekly on a consistent cadence
- Limited standalone potential but supports broader engagement strategy

### Next Steps
1. [ ] Determine new prize distribution
2. [ ] Add karma refresh mechanic (500 karma to reset timer)
3. [ ] Publish updates

---

## 3. Greened Out Channel

### Opportunity
Users share winning bet slips in this channel. It's important for social proof, community morale, and future social media content. But the data isn't being tracked — no one knows the total amount won, and there's no systematic way to surface these numbers.

### What Is Being Built
Three components:
1. **Auto-react bot** — Dropout Degens bot automatically reacts to every message with fire + money bag emojis (seed engagement)
2. **Historical win tracking** — Calculate total winnings shared in the channel from 2023 through present
3. **Updated graphics** — New camera graphic with updated logo showing community win totals

### How It Works
- Bot listens for messages in Greened Out channel → auto-reacts (no user interaction needed)
- Historical data: manually or programmatically calculate dollar amounts from past messages
- Future possibility: image parsing to automatically derive dollar amounts from bet slip screenshots (potentially its own project)

### KPI Impact
- Number of months with accurate win data collected (target: all 20 months of operation)
- Currently have ~5 months of data

### Long-Term Potential
- Social media content: "Our community has shared $X in wins over 3 years"
- Updated monthly for ongoing marketing material
- If image parsing works: automated real-time win tracking per user and per month

### Next Steps
1. [ ] Build auto-react NaN integration (fire + money bag on every message)
2. [ ] Calculate historical win totals for 2024 and 2025 (2023 already done)
3. [ ] Update Greened Out graphics with new logo and win totals
4. [ ] Explore feasibility of automated image parsing for dollar amounts (may be separate project)

---

## 4. Responsible Gaming Channel

### Opportunity
As DD positions toward education-first, a responsible gaming channel reinforces that positioning. It's the right thing to do in a dangerous space, and it differentiates DD from pure picks services.

### What Is Being Built
A read-only channel with:
- Methods for monitoring gambling responsibly (bankroll tracking, unit systems, bankroll management)
- Educational videos on responsible gambling
- Hotline/support phone numbers
- Alternative ways to enjoy sports without gambling (e.g., Layup as a sports saving app)
- A support ticket for members who need someone to talk to (staff available as resource)

### How It Works
Read-only channel. Users browse resources. May include the bankroll/unit finder bot. Support ticket option for private conversations with staff.

### KPI Impact
- Depth and quality of resources provided (qualitative measure)

### Long-Term Potential
- Reinforces education-first brand positioning
- Differentiator in the market
- Layup integration opportunity (sports saving as alternative to betting)
- Staff support tickets create deeper member relationships

### Next Steps
1. [ ] Create list of responsible gambling resources
2. [ ] Create list of responsible gambling habits and strategies
3. [ ] Populate the channel with content and add a support ticket

---

## 5. Website Improvement (Deferred)

### Opportunity
Website isn't a major landing page right now but should be. Needs redesign inspired by Layup's website (animations, storytelling). Also needs an admin dashboard section.

### Status
**Deferred — needs more scoping.** Sub-projects include:
- Redesign with Layup-style transitions and content storytelling
- Admin dashboard for staff (statistics, user data, operational metrics)
- Framer page expansion

---

## 6. Finances in Database

### Opportunity
Operating income and expenses aren't tracked in the backend. Need Stripe and WAP subscription data historically, plus categorized expenses for the past two years.

### What Is Being Built
Database tables for:
- **Subscription income:** All Stripe and WAP subscription data from day one
- **Expenses:** Categorized (operating, advertising, subscription), who's paying, full history

### How It Works
Stripe and WAP connections to pull historical subscription data. Manual expense entry with categorization.

### KPI Impact
- Completeness of financial data in database
- Enables admin dashboard financial views

### Long-Term Potential
- Prerequisite for admin dashboard
- Enables real financial reporting and statistics
- Better understanding of unit economics

### Next Steps
1. [ ] Connect Stripe historical subscription data
2. [ ] Connect WAP historical subscription data
3. [ ] Categorize and import 2 years of expenses
4. [ ] Build database schema for financial data

---

## 7. Invite Link Rotation

### Opportunity
Bot spam is a problem — invite links get grabbed and abused. Need auto-rotating links that switch out automatically.

### Next Steps
1. [ ] Design rotation system
2. [ ] Implement auto-switching of invite links