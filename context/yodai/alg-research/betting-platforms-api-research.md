# Betting Platforms — API Research

**Date:** 2026-03-02
**Scope:** All 27 platforms in the DD ecosystem evaluated for programmatic bet placement

---

## Summary: Platforms with APIs

| Platform | API Type | Can Place Bets? | Docs | US Legal |
|---|---|---|---|---|
| **ProphetX** | Official REST + WebSocket (partner) | Yes | docs.prophetx.co | 39 states (sweepstakes) |
| **Novig** | Official REST + WebSocket + GraphQL | Yes | docs.novig.us | 42 states + DC |
| **Kalshi** | Official REST (CFTC-regulated) | Yes | docs.kalshi.com | ~44 states |
| **OddsJam** | Official REST (paid, data only) | No — odds data only | developer.oddsjam.com | All 50 |
| **Sleeper** | Official REST (free, read-only) | No — cannot submit lineups | docs.sleeper.com | ~30 states (DFS) |
| **Underdog Fantasy** | Unofficial (reverse-engineered) | No — read-only scraper | GitHub only | ~40 states |

---

## All 27 Platforms — Full Breakdown

### Peer Exchanges

#### ProphetX
- **API:** Yes — official REST + WebSocket, Market Maker API
- **Bet placement:** Yes — `place_wager`, `place_multiple_wagers` endpoints
- **Auth:** access_key + secret_key → JWT token (expires 10 min, needs refresh)
- **Markets:** NBA props (points, rebounds, assists), NFL props, NHL, moneylines, spreads, totals, live
- **US:** 39 states — NOT available in AZ, CA, CT, ID, LA, MI, MT, NV, NJ, NY, TN, WA
- **Notes:** Sweepstakes/prediction exchange model. Automation explicitly supported and marketed. Partner onboarding required for credentials. Sandbox environment available.
- **Docs:** docs.prophetx.co

#### Kutt
- **API:** None found
- **Notes:** Peer-to-peer model, ~40 states. Acquired by Bitcoin Depot on 2026-03-02 — API future unknown.

#### Novig
- **API:** Yes — official REST + WebSocket + GraphQL (NBX API)
- **Bet placement:** Yes — full order placement, management, account endpoints
- **Auth:** Self-serve token via docs.novig.us
- **US:** 42 states + DC — NOT available in CO, ID, LA, MI, MT, NV, TN, AL
- **Notes:** Trading exchange model. Self-serve access — no partner onboarding required.
- **Docs:** docs.novig.us

---

### Additional Sportsbooks (Offshore)

#### MyBookie
- **API:** None
- **Legal:** Offshore (Curacao license), unlicensed in US — legal gray area
- **Notes:** 46 US states accept players but no consumer protections. ToS prohibits automation.

#### Bet105
- **API:** None
- **Legal:** Offshore, unlicensed — "arbitrage-friendly" positioning
- **Notes:** All 50 states accept players but no state licenses. No developer program.

---

### Social Sportsbooks (Sweepstakes)

All social sportsbooks below: **No API, ToS explicitly prohibits bots/automation.**

| Platform | Available States | Notes |
|---|---|---|
| Onyx Odds | 36 states | CA banned Jan 2026 |
| Stimi Games | ~40 states | ToS explicitly bans automated play |
| Thrillzz | 38 states | Consumer app only |
| Chalkboard Social Picks | 31 states (DFS), broader (sweepstakes) | SharpSports BetSync integration (read-only sync, not placement) |
| Bracco | ~45 states | CA banned Jan 2026 |
| Sportzino | 46 states | No developer program |
| Fliff | 45 states | ToS explicitly bans bots. DFS ("Superstars") launched Jan 2026 in 11 states. |

---

### Daily Fantasy Sports

#### Wanna Parlay
- **API:** None. ~22 states for paid contests.

#### ParlayPlay
- **API:** None. ~27 states.

#### Sleeper
- **API:** Yes — official, free, public, **read-only**
- **Bet placement:** No — cannot submit lineups via API
- **Rate limit:** Stay under 1,000 calls/min
- **Docs:** docs.sleeper.com
- **Notes:** Community Python wrapper: sleeper-api-wrapper on GitHub

#### Chalkboard (DFS)
- **API:** None. ~30 states + DC.

#### Dabble
- **API:** None (uses OpticOdds internally as data vendor — not user-facing). 29+ states.

#### Boom Fantasy
- **API:** None. ~26 states.

#### Underdog Fantasy
- **API:** Unofficial only (reverse-engineered REST — read-only scraper)
- **Bet placement:** No
- **ToS:** Explicitly prohibits automated access (updated Sept 2025)
- **States:** ~40 states + DC + Canada
- **GitHub:** github.com/aidanhall21/underdog-fantasy-pickem-scraper

---

### Bet Tracking

#### Pikkit
- **API:** None public. Integrates with 20+ sportsbooks via internal sync (not user-facing).
- **Notes:** Uses OpticOdds on backend. ToS prohibits bots.

#### Real
- **API:** Unknown. Very limited public information. Early-stage platform.

---

### Betting Tools

#### OddsJam
- **API:** Yes — official, paid, commercial REST
- **Bet placement:** No — odds data and EV computation only
- **Auth:** API key (email api@oddsjam.com)
- **Pricing:** ~$500-1,000+/month for commercial tiers
- **Coverage:** 100+ sportsbooks, moneylines, spreads, totals, player props, live odds
- **Docs:** developer.oddsjam.com
- **Notes:** This is already the source of our EVAlertEvent data. Python wrapper: oddsjam-api on PyPI.

#### DailyGrind Fantasy (DGF)
- **API:** None public.
- **Notes:** Subscription analytics/optimization tool. AI slip generator for PrizePicks/DraftKings/FanDuel/Yahoo. No developer program. Already a DD partner — alerts feed directly into EVAlertEvent.

#### Props.Cash
- **API:** None. Uses SportsDataIO as backend. All 50 states (research tool).

#### Outlier.Bet
- **API:** None. AI-powered prop research tool. All 50 states.

---

### Get Funded

#### The Funded Sports Trader
- **API:** None. Simulated challenge model (virtual bankroll). Legal status evolving — regulators scrutinizing funded challenge models for sportsbook licensing requirements.

#### FundedStake
- **API:** None. Same challenge model. ~43 states. Claims to operate as "virtual sports betting education platform."

---

### Sports Saving

#### Layup
- **API:** None. Prize-linked savings account (not betting). 48 states. FDIC-insured funds at nbkc bank. American Savings Promotion Act of 2014.

---

## Recommendation

**For automated bet placement (US-legal):**
1. **ProphetX** — best market coverage, mature Market Maker API, explicit automation support. Paper trade now (sandbox + restricted state), go live when eligible.
2. **Novig** — self-serve access, no partner onboarding, backup option.
3. **Kalshi** — CFTC-regulated, official API, but shallow player prop menus (~5 players/game max). Good for game-level markets.

**For odds data:**
- OddsJam already feeds EVAlertEvent — no additional integration needed.

**Do not automate:**
- DraftKings (ToS explicit ban + balance forfeiture risk)
- Any sweepstakes social sportsbook (same ToS risk)
- Offshore books (MyBookie, Bet105) — no API, legal risk
