# RAG Document Collection — Build Plan

**Goal:** Build a comprehensive internal knowledge base of DD context, operations, strategy, and foundations. These docs will serve as the source material for member-facing education content.

**Status:** In Progress (Section 1 starting 2026-03-17)

**Total estimated sections:** 6

---

## Sections

### Section 1: Foundations (Core Betting & EV Theory)
**Goal:** Document the fundamental concepts that all DD education is built on.

**Sources to pull from:**
- `context/operations/business/brand-voice-and-messaging.md` — core positioning (profitable betting, EV focus)
- Meeting notes from `/context/meetings/strategy/` — strategic direction
- `context/operations/business/bet-tracking-requirements.md` — tracking concepts
- Discord channel guides — context on tools and their uses

**Documents to create:**
- `ev-and-value.md` — What is expected value? Why it matters. How to identify it.
- `kelly-criterion.md` — Bankroll sizing, unit sizing, risk management
- `bet-types-and-structure.md` — Straights vs parlays vs teasers. When each makes sense.
- `the-sharp-mindset.md` — Discipline, process-oriented thinking, emotional control
- `line-movement-and-timing.md` — How to read line movement. When to bet.

**Dependencies:** None (can start immediately)

**Effort:** 3-4 hours to synthesize and write

---

### Section 2: What is Dropout Degens?
**Goal:** Internal docs on mission, positioning, who we are, and how the community actually works.

**Sources to pull from:**
- `context/operations/business/brand-voice-and-messaging.md` — Who we are, what we're not
- `context/operations/business/dax-content-guide.md` — How DD is structured
- `context/operations/discord/README.md` — Community structure
- Meeting notes — strategic positioning sessions

**Documents to create:**
- `mission-and-philosophy.md` — Why DD exists. Education > Picks. What we believe.
- `how-community-works.md` — Discord structure, tiers (free/premium), where members live
- `the-dd-curriculum.md` — What we teach (in order). The learning path.
- `brand-voice.md` — How we talk about DD internally vs externally
- `success-metrics.md` — How we measure if we're doing this right

**Dependencies:** Section 1 (may reference foundation concepts)

**Effort:** 2-3 hours

---

### Section 3: Tools & Integrations
**Goal:** Understand what tools members have access to and why each one matters.

**Sources to pull from:**
- `context/operations/discord/` — Channel inventory, EV tools listed
- Partner docs and affiliate agreements (need to ask Dax)
- Meeting notes on partnership strategy
- Supabase schema for partner tracking

**Documents to create:**
- `partners-overview.md` — 40+ partners. What each does. Why we chose them.
- `ev-tools-guide.md` — OddsJam, Outlier, Daily Grind Fantasy. When to use each.
- `sportsbook-comparison.md` — FanDuel vs DraftKings vs Bet365 etc. Pros/cons.
- `affiliate-and-promo-structure.md` — How member signups work. Payouts. Value for DD.
- `data-sources-and-feeds.md` — Where our EV alerts come from. Accuracy/limitations.

**Dependencies:** Section 2 (context on why partnerships exist)

**Effort:** 4-5 hours (some requires external research/Dax input)

---

### Section 4: Discord & Community Navigation
**Goal:** Map the actual server for both member experience and ops reference.

**Sources to pull from:**
- `context/operations/discord/channel-map.md` — Channel structure
- `context/operations/discord/examples/` — Existing message patterns
- Bot code — how automated features work
- Ticket system docs

**Documents to create:**
- `channel-guide.md` — Which channel does what. Free vs premium. When to post where.
- `ticket-system.md` — How new members are onboarded. Support flow.
- `roles-and-access.md` — Free vs All Access vs Premium tiers. What each unlocks.
- `community-features.md` — Daily polls, POTD, karma system, ladder challenge.
- `best-practices.md` — How to use the server effectively. Dos and don'ts.

**Dependencies:** Section 2

**Effort:** 2-3 hours

---

### Section 5: Getting Started & Onboarding
**Goal:** New member experience. How to walk through joining, setting up, and first steps.

**Sources to pull from:**
- Welcome ticket template (`context/operations/business/welcome-ticket-messaging.md`)
- `context/operations/discord/new-invites/` — How invites work
- Onboarding flow (need to audit)
- Bot messages

**Documents to create:**
- `onboarding-first-steps.md` — You're new. Here's what to do first (in order).
- `claim-trial.md` — How to claim free days. No payment needed.
- `finding-your-first-bets.md` — Once you're in, where do you go? Tools walkthrough.
- `premium-walkthrough.md` — What does premium unlock? Is it worth it? How to upgrade.
- `common-questions.md` — FAQ. "What sport should I start with?" "How many bets should I make?" etc.

**Dependencies:** Sections 1, 2, 3, 4

**Effort:** 3-4 hours

---

### Section 6: Operations & Decision-Making
**Goal:** How DD actually runs. Internal knowledge for running things.

**Sources to pull from:**
- `context/operations/business/` — Compensation, revenue, conversion bonuses
- `context/operations/staff-onboarding/` — How staff is trained
- Meeting notes — strategic decisions
- Supabase schema — data tracking

**Documents to create:**
- `revenue-model.md` — How DD makes money. Partner CPA. Subscription. Conversion bonuses.
- `member-journey-map.md` — How a member goes from invite → free user → premium. Economics.
- `staff-roles-and-responsibilities.md` — Who does what. Communication channels.
- `data-and-analytics.md` — What we track. Why. How it drives decisions.
- `decision-making-framework.md` — How we decide on new features, partnerships, positioning changes.

**Dependencies:** Sections 1-5 (context)

**Effort:** 3-4 hours

**Note:** Some of this may be sensitive. Coordinate with Dax on what's documented.

---

## Related Builds (Things to Create While Gathering Context)

As we pull context for the RAG docs, we'll likely identify:

1. **Missing internal documentation** — If Supabase schema isn't documented well, we should document it
2. **Outdated context** — Some files in `/context/` may be stale; flag for updates
3. **Gaps in knowledge** — Things that should exist but don't (e.g., partner affiliate breakdown)
4. **Process friction** — If something is hard to find or understand, it should be documented

**Template for flagging these:**
- Create a section in `context/yodai/rag-documents/RELATED-BUILDS.md`
- List as: Item | Source Found | Priority (High/Medium/Low) | Estimated Effort

---

## Process Notes

- **Branch:** All files commit to `yodai/2026-03-17` (daily branch) until final review
- **Pull from context first:** Every source should come from the existing `/context/` repo. If we need data, query Supabase.
- **Synthesize, don't copy:** These are internal docs written for understanding, not copy-paste from existing files
- **Link relationships:** Use markdown links to cross-reference concepts (e.g., EV section links to bet-types section)
- **Assume medium knowledge:** Writer knows sports but might be new to EV. Explain clearly but not condescendingly.

---

## Current Progress

| Section | Status | Started | Completed |
|---------|--------|---------|----------|
| 1. Foundations | Planning | — | — |
| 2. What is DD? | Queued | — | — |
| 3. Tools & Integrations | Queued | — | — |
| 4. Discord Navigation | Queued | — | — |
| 5. Getting Started | Queued | — | — |
| 6. Operations | Queued | — | — |
| Related Builds | Tracking | — | — |

---

*Plan created: 2026-03-17*
*Branch: yodai/2026-03-17*
