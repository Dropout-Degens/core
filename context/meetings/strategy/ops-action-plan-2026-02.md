# Ops Action Plan — Feb 2026
**Source:** Feb 7 & Feb 27, 2026 strategy sessions
**Purpose:** Concrete task breakdown from the two strategy sessions, organized for execution

---

## Priority Order

1. Publish EV (unlock credibility + validation)
2. Update education stack (unlock value narrative)
3. Fix ticketing system (unlock conversion)
4. Staff onboarding (unlock execution capacity)
5. Discord cleanup (unlock onboarding quality)
6. Pricing increase to $50/month (unlock revenue)
7. Marketing push (unlock growth)

---

## 1. Publish EV

**Goal:** Make DD's methodology visible and credible before NHL season resumes (late March window).

**Tasks:**
- [ ] Purge EV info channel entirely
- [ ] Rewrite EV info with historical methodology explanation
  - Include: how edge is found, how we validate it, what the current algorithm does (at a high level)
  - Show: the 18+ months of OddsJam data that backs this up
- [ ] Publish NHL EV specifically (that's the season we're working with)
- [ ] Fix Flif EV: currently routing to wrong channels — isolate to Flif-only channel
- [ ] Decide: Google Sheets vs AWS for EV display
  - If AWS is too complex to stand up quickly → use Google Sheets
  - Objective: same data, just needs to be viewable
- [ ] Contact Bellcube to coordinate EV channel fixes

**Timeline:** Must complete before NHL season resumes (late March).

---

## 2. Education Stack

**Goal:** Make every channel meaningful for member education. Rewrite stale content.

**Tasks:**
- [ ] Create/update `betting-tips` channel content
  - Bankroll & unit sizing framework
  - Straights over parlays explanation
  - Time-value of research concept
  - Live betting basics
- [ ] Create `responsible-gaming` channel
  - Variance primer
  - "Daily unit cap" reminder format
  - Mental framing for downswings
- [ ] Create or update `strategies` channel
  - Full framework from education doc
  - Diminishing returns on volume
  - Live betting deeper dive
- [ ] Add methodology context to pick channels
  - When picks are posted, brief line of "why this edge exists"
- [ ] Update all betting-related educational content in every relevant channel

**Dependencies:** Education content should be written before pricing increase.

---

## 3. Ticketing System

**Goal:** Fix conversion pipeline end-to-end.

**Premium Walkthrough Ticket (ASAP):**
- [ ] Redesign the premium walkthrough experience
- [ ] Use mom test framework: ask "what are your pain points" before pitching
- [ ] Show value stack clearly (education, EV, tools, community, partners)
- [ ] Offer trial structure as first ask, not paid conversion

**Expired Sub Ticket (Re-engagement):**
- [ ] Trigger message: "We failed you somewhere — tell us where"
- [ ] Discovery question flow (what was wrong?)
- [ ] Re-engagement offer: 14 free days with partner signup (vs standard 7)
- [ ] Make it human, not automated

**Notes:**
- Can't delete old channel structure until Zach is on call — schedule this
- Premium walkthrough is highest priority (new member flow)

---

## 4. Staff Onboarding

**Goal:** Staff knows what they're doing, why they're doing it, and is accountable.

**Infrastructure (with Zach):**
- [ ] Schedule ASAP call with Zach — agenda around:
  - Old channel deletions (can't do without him)
  - Staff permissions audit (does staff have git-profile vs git-profile-admin?)
  - Building dev tasks that are blocked
- [ ] Update `get-profile` command to show demographic info:
  - State
  - Age range (18+, 21+)
  - Bankroll status
  - Where they came from (invite source)
  - Membership history (paid or free, how many times)
- [ ] Audit log: update staff tags per channel (different staff groups for different channels)

**Analyst Team:**
- [ ] Onboard all analysts on conversion tracking + percentages
- [ ] Talk to Luke (only analyst not yet fully onboarded)
- [ ] Schedule weekly analyst meeting — propose Mon/Wed/Fri options in group chat
  - If they can't make weekly: mandatory 1-on-1 instead
- [ ] Set expectation: analysts should be proactive in Discord, not passive
- [ ] Weekly with JP — start next week

**Staff Docs:**
- [ ] Update staff-facing documents (stored in Routine currently)
  - Official docs (Word format)
  - Context docs (GitHub format)
  - Staff docs (working documents)
- [ ] Clarify communication channels: where does Dax want staff to flag things?
  - Consider: does Discord work as the only staff communication layer?
  - Or does the operational burden need better separation from Discord channel clutter?

---

## 5. Discord Cleanup

**Goal:** Clean server, clean first impression, accurate structure.

**Quick wins (can do immediately):**
- [x] Message all staff with role → login to website + remove roles
- [x] Update EV backend rolls
- [x] Purge + redo all invite links with tracking parameters
- [ ] Delete old threads
- [ ] Purge obsolete roles: notify, old bot roles, legacy staff roles
- [ ] Remove old channels (after Zach call)

**Content refresh:**
- [ ] Lobby/rules channel — rewrite
- [ ] Update onboarding to capture state, age range, bankroll level, why they joined
- [ ] Display "where they're from" when a new member joins (conversion context)
- [ ] Separate free vs. premium value proposition in channel structure

**Timing note:** $200 Hive Index promotion is incoming (~200 new members). They will land in the server. Server needs to be presentable before they arrive.

---

## 6. Pricing to $50/Month

**Gates (do not raise until all of these are true):**
- [ ] EV methodology is published and explainable
- [ ] Education stack is live
- [ ] Ticketing walkthrough tells the value story
- [ ] Discord looks like a $50/month product

**Action:**
- [ ] Update pricing when all gates are met
- [ ] Update all marketing materials, invite links, partner comms

---

## 7. Re-Engagement Campaign

**Goal:** Reach every past member we can find and bring them back.

**Steps:**
- [ ] Pull list of past subscribers from database
- [ ] Draft re-engagement DM (human tone, not form email)
  - Acknowledge radio silence
  - Show what's changed (infrastructure, staff, EV, education)
  - Offer re-entry deal
- [ ] Message everyone individually via Discord DM
- [ ] Track responses (who engaged, who converted)

---

## 8. Marketing (Post-Pricing)

**Timeline:** After pricing is at $50 and value stack is validated.

**Questions to answer before spending:**
- Who are we targeting? (Low-bankroll Flif market vs. serious sports bettor?)
- What specific problem are we claiming to solve in the ad?
- What does our conversion path look like end-to-end?

**Known:**
- $200 Hive Index spend already in flight — ~200 new members incoming
- Must convert this cohort to test positioning (it's a live test of the full stack)

---

## Open Dependencies / Blockers

| Item | Blocker | Who |
|------|---------|-----|
| Old channel deletions | Zach call required | Zach |
| EV publish | Pipeline complexity, AWS vs Sheets | Dax |
| Analyst weekly | Luke hasn't been onboarded yet | Dax |
| Staff permissions audit | Zach call required | Zach |
| Marketing targeting | Need to define who converts best | Dax |
| Alex conversation | Needs validated EV + $50 pricing | Dax |

---

## Quick Wins (No Dependencies)

1. ~~Message staff roles → website login + remove~~ (done)
2. ~~Clean up EV backend roles~~ (done)
3. ~~Purge + redo invite links~~ (in progress)
4. Draft Luke onboarding message
5. Propose analyst weekly times in group chat
6. Start re-engagement DM drafting

---

*Last updated: March 2026 | Source: Feb 7 & 27 strategy sessions*
