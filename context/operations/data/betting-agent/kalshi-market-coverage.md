# Kalshi — Sports Market Coverage

**Date:** 2026-03-02
**Source:** Kalshi self-certifications, Front Office Sports, Next Event Horizon, DRF

---

## Overview

Kalshi is a CFTC-regulated Designated Contract Market (DCM) — the only federally legal prediction market exchange in the US. This gives it nationwide availability (with some state exceptions) and explicit regulatory clearance for automated trading.

---

## State Availability

Available in ~44 states. **NOT available** in:
AZ, IL, MD, MT, NJ, NV, OH (cease-and-desist orders from state regulators — Kalshi disputes state jurisdiction but has geofenced these states)

---

## Sports Leagues Covered

NFL, NBA, MLB, NHL, WNBA, NCAA Football, NCAA Basketball (March Madness), Soccer (EPL, La Liga, Bundesliga, Serie A, MLS, UCL, Europa, Ligue 1), Golf (PGA, DP World Tour), Tennis (ATP, WTA, Grand Slams), Esports, Motorsports

---

## Market Types

| Type | Available |
|---|---|
| Game winner (moneyline equiv.) | Yes |
| Point spreads | Yes |
| Totals / Over-Under | Yes |
| Futures (championship, MVP, draft) | Yes |
| Combos (parlay-style) | Yes (launched Dec 2025) |
| Live/in-game betting | No |
| Same-game parlays (deep) | Limited |

---

## Player Props by Sport

### NBA
- Points, Rebounds, Assists, Three-pointers made ✅
- **Critical limitation: max ~5 players offered per game platform-wide**
- Roughly 50 NBA players active at any time — far less than the hundreds of props on DraftKings/FanDuel

### NHL
Full self-certified template covering:
- Goals, Assists, Points ✅
- Shots on Goal ✅
- Hits, Blocked Shots ✅
- Penalty Minutes, Plus/Minus
- Faceoff Wins, Time on Ice
- Power-play goals/points, Short-handed goals/points
- Game-winning goals, Empty-net goals
- Goalie: Saves, Goals-Against, Save %, Shutouts, Win/Loss/OTL

### NFL
Full self-certified template covering:
- Passing yards, Rushing yards, Receiving yards
- Yards from scrimmage
- Passing TDs, Rushing TDs, Receiving TDs
- Sacks, Interceptions, Passes Defensed
- Return yardage, Punt yardage

### MLB
Futures markets active (HR leaders, etc.). Game-level and player prop coverage developing — less documented than NBA/NFL/NHL.

---

## Liquidity and Depth

| Market | Bid-Ask Spread | Notes |
|---|---|---|
| Popular game winners | ~$0.01-0.02 | Tight, good liquidity |
| Spreads and totals | ~$0.10+ | Noticeably wider |
| Player props | Thin | Newer markets, fewer participants |

**Volume:** $1.7B notional in the final week of Dec 2025 (~$291M/day around Jan 1 2026). Sports account for ~90% of volume.

**Trade maximum:** $10,000 per trade on NBA props.

---

## Fee Structure

Kalshi uses a formula-based fee (not traditional vig):

```
Taker fee = round_up(0.07 × contracts × P × (1 - P))
Maker fee = round_up(0.0175 × contracts × P × (1 - P))
```

Where P = contract price in dollars (e.g., 0.60 = 60¢).

- At even-money (P = 0.50): taker fee ~1.75%, maker fee ~0.44%
- Sports markets saw ~15% fee increase under July 2025 maker fee change
- Cheaper than sportsbook vig (~4-5%) at near-50/50 odds
- Can be worse on illiquid markets

---

## API

- **Docs:** docs.kalshi.com
- **Auth:** API key + RSA-PSS signed requests. Session tokens expire every 30 minutes.
- **Python SDK:** kalshi-python on PyPI; KalshiPythonClient on GitHub
- **Key endpoints:**
  - `GET /markets` — list available markets
  - `GET /events` — list events
  - `POST /orders` — place limit or market order
  - `GET /orders` — retrieve active/historical orders
  - `GET /portfolio` — view positions
- **WebSocket:** real-time order book updates, executions, market status

---

## Assessment for DD Use Case

**Pros:**
- Federally legal, explicit CFTC regulation — zero ToS risk for automation
- Official Python SDK with documented REST API
- NHL props (SOG, goals, assists) align with DD's best historical signals
- NBA props (points, rebounds, assists, threes) also covered

**Cons:**
- Max ~5 players per NBA game — our alerts cover dozens of players per game
- No in-play betting
- Player prop liquidity is thin — fills not guaranteed (peer-to-peer model)
- Several key states restricted (NJ, NV, OH, etc.)
- Whole-number line equivalents not available — Kalshi uses binary Yes/No contracts, not over/under lines with half-point precision

**Verdict:** Good as a secondary auto-placement channel for game-level markets. Not the primary execution layer for player props due to shallow menus and thin liquidity. ProphetX is the better primary target for player prop automation.
