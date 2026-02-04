# Kaiden Check-in - 2026-02-03 Current Business Context

## Business State (Q1 2026)

### Primary Focus Areas
1. **Development Features** - Finalizing ticket system, calculator bots, partner promo automation
2. **Community Re-engagement** - Bringing back churned premium members
3. **Partnership Expansion** - Adding 7 new apps to the 40+ existing partnerships

### Staff Goals (Q1)
1. **Culture Adoption** - Staff using partners, gathering conversions, testing if model works
2. **Server Retention** - Increase community engagement and activity (currently very low)

### Current Challenges
- **Low activity:** Server is quiet, not enough active members to sustain engagement
- **Chicken-and-egg problem:** Need active community to attract new members, but need new members to have active community
- **Staff capacity:** Everyone has full-time jobs, limited time for Discord engagement
- **Compensation alignment:** No systems in place to pay staff fairly yet

## Revenue Model

### Subscription Revenue
- Premium access pricing (subject to change, discussed $50/month positioning)
- Free trials: 3 days (no payment info) or 7 days (Stripe link with payment info)
- Preference: Payment info captured = better retention signal

### Partnership Revenue
- 40+ active partnerships (DFS, social sportsbooks, real sportsbooks where legal)
- Commission on conversions (specific rates not disclosed)
- Estimated LTV per converting member: $1,500-$2,500 (from previous context)
- Problem: Conversion rates low, members not claiming partner promos

### Compensation Structure (Under Development)
- Base: Percentage of monthly revenue (specific % varies by role)
- Bonus pool: 20% of revenue distributed by conversion points
- Points from: Partner conversions, promo bot claims, invite link referrals
- Double points: If staff member both invites AND converts someone
- Potential requirement: Minimum 5 conversions/month to receive base pay

## Partnership Infrastructure

### Partners Database
- 40+ partnerships documented in Supabase
- Tracks: State availability, bonus offers, codes, official links
- Currently 6 months outdated on state regulations
- Accessible to staff once team sharing feature released

### Partner Promo Bot
- Shows claimable apps by state (jurisdiction selection)
- Members can mark apps as "claimed" → triggers ticket for free access
- Tracks jurisdiction data for future targeting
- Not fully automated yet (manual attribution required)

### Partner Attribution Channel
Current manual process:
1. Staff posts conversion with user ID tag
2. Include partner name and proof
3. Staff verifies in ticket
4. Points tracked manually for now
5. Future: Fully automated through bot interactions

## Community Acquisition Strategy

### Historical Failures (Summer 2024)
- Acquired 2 Discord servers (MJ Login, Big Bad Betting Man)
- Brought over their analysts and members
- Failed because:
  - New members didn't convert (0% vs. normal 3-5% rate)
  - Analysts didn't push conversions
  - Dax started internship, became less active
  - Staff left to manage became inactive
  - Lost all their premium members when analysts left

### Current Approach (2026)
- Individual outreach to churned members (monthly DM campaigns)
- Email re-engagement campaigns
- Target: 1 returning member per day
- Focus: High-value relationships (previous premium subscribers)
- Word-of-mouth through existing network (FSU friends, frat scene)

### Viral Growth Tactics (Brainstormed)
**Refer-to-earn system:**
- Bring 5 friends → You get 30 days free premium
- Your 5 friends also get 7 days free
- If each of the 5 brings 5 more → Extended premium for everyone
- Alternative: Require partner sign-ups instead of just Discord joins

**Why this works:**
- Word-of-mouth is strongest form of marketing
- Young demographic (college age) dominates sports betting
- Frat environment creates tight social networks
- Financial incentive drives action

## Education-First Positioning

### Market Differentiation
- NOT selling picks (even though analysts post them)
- Teaching members to be smarter bettors
- Focus on strategy, bankroll management, line shopping
- Community of educated bettors, not tail services

### Core Educational Pillars
1. **Partner Promo Optimization** - Claiming free money across 40+ apps
2. **Line Shopping** - Using multiple books for best odds
3. **Bankroll Management** - Unit sizing, variance understanding
4. **Value Identification** - Using outlier data, trends, EV analysis
5. **Arbitrage Opportunities** - Risk-free profit through book mismatches

### Free Money Messaging
Position partner sign-ups as:
- "Free money sitting on the table"
- Investment, not gambling
- Gas money, meal money for college students
- Kickstart to NFL/March Madness/NBA season
- Multiple $200+ bonus offers across apps
- Mail-in sweeps for additional free coins (legal requirement)

## Technology Roadmap

### In Development
- Welcome tickets (auto-created on server join)
- Premium walkthrough tickets (auto-created on first subscription)
- Calculator bots (parlay, odds converter, hedge)
- Ticket system automation (free access granting)
- Commission/points tracking through bot

### Recently Completed
- Claude.md documentation files (AI context for code generation)
- Partners database structure
- Routine workspace with company goals
- Meeting transcript documentation system

### Integrated Tools
- **Supabase:** Database for all Discord/member data
- **PostHog:** Analytics and event tracking
- **Stripe:** Payment processing and subscriptions
- **GitHub:** Code repository and context documentation
- **Claude:** AI assistance for development and documentation
- **Routine:** Project management and goal tracking
- **Bankroll Capital (Layup):** Potential sportsbook integration partner

## Market Timing

### Current Season (Early February)
- NBA season ongoing (Kaiden's model performing well)
- Super Bowl in 5 days (group tail opportunity)
- March Madness approaching (huge betting season)
- NFL offseason coming (historically slow period)

### Seasonal Considerations
- Summer die-off expected (baseball less popular)
- Football season = peak engagement and revenue
- Need to build foundation now for fall 2026 growth

## Social Media Strategy (Not Yet Launched)

### Challenges
- Brand positioning unclear (education vs. picks vs. community)
- Recent pivot to education-first model
- Need to capture differentiation in messaging

### Potential Content Ideas
- Weekly win showcases (transparency without pick-selling framing)
- Game breakdowns and educational content (like Odds Jam TikTok)
- Arbitrage and hedging tutorials
- "How to bet smarter" series
- Community highlights and member success stories

### Platforms Considered
- TikTok (informational short-form)
- Instagram (weekly wins, community highlights)
- Twitter/X (sports talk, engagement)
