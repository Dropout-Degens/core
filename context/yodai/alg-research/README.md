# data-alg

Research and planning documentation for the EVAlert automated betting agent.

**Date:** 2026-03-02

---

## Contents

| File | Description |
|---|---|
| `ev-alert-agent-plan.md` | Full architecture plan for the scheduled EVAlert processor + betting agent |
| `betting-platforms-api-research.md` | API research across all 27 platforms in the DD ecosystem |
| `prophetx-api-reference.md` | ProphetX Market Maker API — auth, endpoints, paper trading approach |
| `kalshi-market-coverage.md` | Kalshi sports market coverage, player props, liquidity, fees |

---

## Summary

The goal is to build a scheduled agent inside claudebot (YodAI) that:
1. Pulls unprocessed EVAlertEvents from Supabase on a schedule
2. Scores each alert using historical win rate data from EVActualStat
3. Outputs BET / PASS / INSUFFICIENT_DATA decisions into a new EVAlertDecision table
4. Sends a Telegram summary of BETs for the day
5. Eventually places bets programmatically via ProphetX or Kalshi APIs

**Key finding:** ProphetX and Novig are the only platforms from the DD ecosystem with genuine native APIs capable of programmatic bet placement. ProphetX is the primary target due to broader market coverage and a well-documented Market Maker API.

**Current state:** Not in a ProphetX-eligible state — paper trading via sandbox or intercepted API calls to Supabase is the immediate path.
