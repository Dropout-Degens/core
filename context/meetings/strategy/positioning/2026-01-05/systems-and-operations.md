# Positioning Session — Systems & Operations — January 5, 2026

---

## Discord Channel Architecture

### Support Category
| Channel | Purpose | Automation |
|---------|---------|------------|
| **Support** | General support hub — directs to specific channels, open a ticket for general help | Manual tickets |
| **Free Access** | Members submit proof of partner signup to claim free premium days | Manual tickets (staff can also create) |
| **Subscription Help** | FAQ + ticket: billing issues, refunds (48hr), trials, discounts | Manual tickets |
| **Premium Walkthrough** | Auto-ticket for every new subscriber/trial — personalized onboarding | Automated (late Jan–mid Feb target) |
| **Partnership Inquiry** | External parties wanting to become DD partners | Manual tickets |
| **Staff Application** | Community members applying for staff roles | Manual tickets |
| **Bug Report** | Report bugs with bots/website/systems | Manual tickets |
| **Server Welcome** | Auto-ticket for members from high-converting invite sources | Automated (source-specific) |
| **Expired Sub** | Auto-ticket when subscription/trial ends — re-engagement | Automated (in progress) |
| **Responsible Gaming** | Resources, tips, bankroll management, ticket for support | Manual tickets |

### General Chat Category
| Channel | Purpose |
|---------|---------|
| **Announcements** | General server updates |
| **Daily Poll** | Vote/engage to earn server karma |
| **Daily Free Picks** | Free picks and DFS partner of the day |
| **General Chat** | Betting-related discussion |
| **Community Pics** | Share betting slips |
| **Greened Out** | Share wins with the community |
| **Bad Beats** | Share near misses |
| **Selfies** | Community selfies to claim weekly rewards |

### Resources & Partners Category
- **Partners channel:** "Help support the server by using our code on signup with any of our partners"
- **Betting Tips:** Terms, tips, strategies, and resources for the betting journey
- **Server Guide:** Directory of all channels in the Discord (needs updating)

## Ticketing System Design Philosophy

### Personalized > Self-Service
- Every major member lifecycle moment gets a **personalized ticket** with staff interaction
- Welcome → Premium Walkthrough → Expired Sub: three automated touchpoints covering the full member lifecycle
- Goal is 1-on-1 engagement at every conversion-relevant moment
- Staff should be hands-on, especially in premium walkthrough

### Free Access Flow
1. Member signs up for a partner
2. Creates ticket in Free Access channel (or staff creates for them)
3. Submits proof of signup
4. Staff verifies and grants free premium days
5. Premium walkthrough ticket auto-opens for the new access period

### Welcome Flow (High-Converting Sources)
1. Member joins from a tracked high-converting invite link
2. Server welcome ticket auto-opens
3. Staff offers 3-day free trial in the ticket
4. Member also receives DM with 7-day free trial link (puts them on billing)
5. Total possible: up to 10 free days of all-access
6. If they start the 7-day trial from DM, that's preferred (billing capture)

## Staff Bonus Points System

### Structure
- **5% of all partnership revenue** goes into a staff bonus pool
- Points earned per conversion, weighted by partner value:

| Tier | Points | Partner Examples |
|------|--------|-----------------|
| Low-value | 1 point | Reel, Props Cash, Picket, Layup |
| Mid-value | 3 points | Standard CPA partners |
| High-value | 5 points | Onyx, Thrills, Sleeper, ParlayPlay |

### Mechanics
- Any staff member who makes a partner conversion OR converts a member to premium earns points
- Points translate to share of the 5% bonus pool
- Potential for double-points weeks on specific partners
- Referral points also included (bringing new members who convert)

## Weekly Rewards

- Weekly rewards channel exists but prize distribution needs updating
- Karma earned through daily poll engagement
- Selfies channel tied to weekly reward claims
- Specific reward structure TBD
