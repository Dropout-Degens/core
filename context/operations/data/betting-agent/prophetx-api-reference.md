# ProphetX Market Maker API — Reference

**Date:** 2026-03-02
**Source:** docs.prophetx.co, github.com/betprophet1, github.com/Apsteward8/market-maker

---

## Overview

ProphetX is a peer-to-peer prediction exchange operating under a sweepstakes model in ~39 US states. The Market Maker API is designed for automated trading — the platform explicitly markets it for algorithmic players who want to "connect their own software to trade automatically."

**Access:** Requires partner onboarding. Get credentials from ProphetX account Settings → Token.

---

## State Restrictions

ProphetX is **NOT available** in:
AZ, CA, CT, ID, LA, MI, MT, NV, NJ, NY, TN, WA

Available in ~39 other states.

---

## Environment

| Environment | Base URL |
|---|---|
| Sandbox (paper trading) | `https://api-ss-sandbox.betprophet.co/partner/` |
| Production | `https://api.prophetx.co/partner/` (or similar — confirm in docs) |

---

## Authentication

### Login

**POST** `/auth/login`

```json
{
  "access_key": "your_access_key",
  "secret_key": "your_secret_key"
}
```

Response:
```json
{
  "data": {
    "access_token": "...",
    "access_expire_time": 1234567890,
    "refresh_token": "...",
    "refresh_expire_time": 1234567890
  }
}
```

**Critical:** `access_token` expires every **10 minutes**. Must refresh proactively.

### Refresh

**POST** `/auth/refresh`

```json
{
  "refresh_token": "your_refresh_token"
}
```

Returns a new `access_token`. The refresh token has its own separate expiry.

### Usage

Pass `access_token` in every subsequent request:
```
Authorization: Bearer <access_token>
```

---

## Wager Endpoints

### Place Single Wager

**POST** `/mm/place-wager`

```json
{
  "line_id": "string",      -- market line identifier
  "stake": 10.00,           -- wager amount (nonzero, max ~100,000,000)
  "odds": 1.909,            -- decimal odds format (must be > 1.0)
  "external_id": "unique-string-per-wager"
}
```

Response — wager object with enum fields:
- `status`
- `matching_status`
- `winning_status`
- `update_status`

**Note on odds format:** ProphetX uses decimal odds (European format), not American.
- American -110 → Decimal 1.909
- American -120 → Decimal 1.833
- American +150 → Decimal 2.500

### Place Multiple Wagers

**POST** `/mm/place-multiple-wagers`

Batch up to 20 wagers in one request. Same fields as above, wrapped in an array.

### Cancel Wagers

| Endpoint | Scope |
|---|---|
| `POST /mm/cancel-wager` | Single wager |
| `POST /mm/cancel-all-wagers` | All open wagers |
| `POST /mm/cancel-wagers-by-event` | All wagers on an event |
| `POST /mm/cancel-wagers-by-market` | All wagers on a market |

---

## Other API Capabilities

- **WebSocket** — real-time market data, order book streaming
- **Wallet** — balance queries, transaction history
- **Market data** — query available lines/odds
- **Sport events** — event listings by sport/league
- **Parlay quoting** — callback-based flow for parlay price requests (separate integration)
- **Affiliate API** — read markets/odds (Swagger: partner-docs.prophetx.co/swagger/affiliate/index.html)

---

## Sports and Markets Covered

- NFL, NBA, MLB, NHL
- NCAA Football, NCAA Basketball
- UFC/MMA
- Golf (PGA, DP World Tour)
- Soccer (EPL, La Liga, Serie A, Bundesliga, MLS, UCL, Europa, Ligue 1)

**Bet types:**
- Moneyline, spread, totals (over/under)
- Player props: NFL (pass/rush/rec yards, TDs), NBA (points, rebounds, assists)
- Same-game parlays
- Live wagering
- Boosters (promotional props)

**Limitation:** ProphetX focuses on standard/major markets. Does not offer the full prop depth of DraftKings or FanDuel.

---

## Paper Trading Strategy (While in a Restricted State)

Since we are currently in a state where ProphetX is not available, the approach is:

### Option A — Sandbox environment
Use the sandbox base URL (`api-ss-sandbox.betprophet.co`). Same API, no real money. Simulate all bet placement calls against the sandbox. Log sandbox responses to `EVAlertDecision.kalshi_order_id` (or a dedicated column).

### Option B — Intercept and log
Call the real API to read market data (lines, odds) but intercept before `place-wager`. Instead of posting the wager, write the "would-have-placed" bet to Supabase `EVAlertPlacedBet` with a `paper_trade = true` flag. Track actual outcomes via EVActualStat as normal.

### Implementation toggle
```python
PAPER_TRADE_MODE = os.getenv("PROPHETX_PAPER_TRADE", "true").lower() == "true"

def place_wager(line_id, stake, odds, external_id):
    if PAPER_TRADE_MODE:
        # Log to Supabase instead of hitting ProphetX
        log_paper_bet(line_id, stake, odds, external_id)
        return {"status": "paper_trade", "external_id": external_id}
    else:
        # Real placement
        return api_post("/mm/place-wager", {...})
```

Flip `PROPHETX_PAPER_TRADE=false` in `.env` when in an eligible state and ready to go live.

---

## Community Reference

A public GitHub repo implements an automated market maker that copies odds from Pinnacle (via The Odds API) and posts them to ProphetX:
- **Repo:** github.com/Apsteward8/market-maker
- Uses access_key + secret_key auth
- Polls Pinnacle every 60 seconds
- Updates ProphetX positions when odds move by a configurable threshold
- Useful reference for token refresh logic and polling patterns
