# Meetings — Navigation Guide

This folder contains processed notes from every meeting Dax has had — internal team, external contacts, developer syncs, and solo strategy sessions. Each meeting is broken into focused files by topic. Transcripts (transcript.txt) are kept but rarely need to be read.

**Canonical processing guide:** `PROCESSING-GUIDE.md` — defines file patterns for every meeting type. Read this before processing any new meeting.

---

## Folder Structure

```
meetings/
├── PROCESSING-GUIDE.md         # How to process meetings (read first)
├── CLAUDE.MD                   # This file
├── internal/                   # DD team members
│   ├── analysts/               # Analyst 1:1s and group meetings
│   │   ├── dante/              # Dante — analyst
│   │   ├── kaiden/             # Kaiden — analyst
│   │   ├── kronos/             # Kronos — analyst
│   │   ├── luke/               # Luke — analyst
│   │   ├── mark/               # Mark — analyst
│   │   └── weekly-meeting/     # Full analyst group weekly sync
│   └── mods/                   # Moderator 1:1s
│       ├── jp/                 # JP — moderator
│       └── nanu/               # Nanu — moderator
├── external/                   # Outside parties
│   ├── arsam-analyst-position/     # Arsam — analyst candidate (hiring)
│   ├── bob-twitter-outreach/       # Bob — Twitter outreach contact
│   ├── cayden-reachpoint-media/    # Cayden — Reachpoint Media (marketing/media partnership)
│   ├── deadshot-community-ambassador/ # Deadshot — community ambassador candidate (hiring)
│   ├── jake-real-community/        # Jake — Discord community partnership
│   ├── jay-community-moderator/    # Jay — community moderator candidate (hiring)
│   ├── layup-onboarding-questioning/  # Layup — member onboarding research
│   ├── sv-discord-community/       # SV — Discord community partnership
│   ├── taylor-relationship/        # Taylor (NotGreg) — exploratory business relationship
│   └── turtle-daddy-relationship/  # Turtle Daddy — exploratory business relationship
├── development/                # Developer meetings
│   ├── syncs/                  # Zach (main developer) recurring syncs
│   └── testing-amlan/          # Amlan — developer/tester onboarding
└── strategy/                   # Solo Dax strategy sessions
    ├── positioning/            # Brand, pricing, how DD presents itself, big-picture direction
    └── projects/               # Specific project scoping and planning
```

---

## File Types and What They Contain

### Universal (every meeting type)

**`summary.md`**
The full picture of what happened. Participants, date, what was discussed, key decisions, and anything notable. Read this first when catching up on a meeting. Written to stand alone — does not reference "first call," "second call," or other meetings.

---

### Internal — Analysts and Mods (`internal/analysts/[name]/`, `internal/mods/[name]/`)

**`[name]-context.md`** — lives at person folder root, not in a date subfolder
Stable background on the person. Role, track record, working style, personality, communication preferences. Updated as the relationship evolves. Read before any meeting with this person.

**`action-items.md`**
Checklist of what needs to happen after the meeting — split by who owns each item (Dax vs. the team member). Includes open items that weren't resolved.

**`current-business-context.md`**
Snapshot of where DD stood at the time of the meeting — what was live, what was being built, what the business priorities were. Gives AI context for why certain things were being discussed.

**`ongoing-expectations.md`**
Standing expectations for this person's role — recurring responsibilities, standards, how Dax wants them operating week to week. Updated when expectations change.

---

### External — Hiring Candidates (`external/[name]-[role]/`)
Used for: arsam-analyst-position, deadshot-community-ambassador, jay-community-moderator

**`candidate-evaluation.md`**
Assessment of the candidate — what's strong, what's weak, whether they're a fit for DD. Dax's honest read, not a sanitized summary.

**`compensation-structure.md`**
What was proposed or agreed to — commission %, flat pay, trial period terms, W9 setup, etc.

**`role-definition.md`**
What the role actually requires — scope, responsibilities, what success looks like, how the role fits into DD's current structure.

---

### External — Partnership / Community (`external/[name]-[entity]/`)
Used for: cayden-reachpoint-media, jake-real-community, sv-discord-community, turtle-daddy-relationship

**`partnership-terms.md`**
Deal structure — what each side is offering, any financial terms, rev share, referral fees, etc.

**`integration-plan.md`**
How the two sides actually work together — logistics, who does what, timing.

**`collaboration-scope.md`**
What's in scope vs. out of scope for the partnership.

**`technical-integration.md`**
Any tech overlap — API connections, bot access, Discord integrations, shared tools.

**`business-terms.md`**
Commercial terms — pricing, payment, contract structure.

**`next-steps.md`**
What needs to happen next, who owns each item.

---

### External — Exploratory Relationship (`external/[name]-relationship/`)
Used for: taylor-relationship, turtle-daddy-relationship (Type 5 in PROCESSING-GUIDE)
These start as cold outreach or random DMs and evolve into something more intentional.

**`opportunities.md`**
Every specific opportunity on the table — described individually with Dax's read and a status label (Open / Pending / Parked / Off the table / Passive). The place to look when deciding what to act on.

**`relationship-dynamics.md`**
Dax's current read on the person. What they actually want from Dax. What Dax wants from them. Red flags or watch-outs. How to approach future conversations. Actionable, not biographical.

**`next-steps.md`**
Checklist split by Dax / the other person / open items.

**`ongoing-thoughts`** or **`final-thoughts.md`** — lives at person folder root
Living document capturing the overall arc of the relationship. Status, what's working, whether to keep investing. Updated across meetings, not per-meeting.

---

### External — Outreach / One-Off (`external/[name]-[context]/`)
Used for: bob-twitter-outreach, layup-onboarding-questioning

**`next-steps.md`**
What needs to happen, who owns it.

**`follow-up-actions.md`**
Variant of next-steps for research or member-interview contexts.

**`research-findings.md`**
What was learned — member feedback, pain points, product ideas surfaced.

**`product-ideas.md`**
Specific product or feature ideas that came out of the conversation.

---

### Development — Syncs (`development/syncs/`)
Recurring meetings with Zach (main developer).

**`zach-context.md`** — lives at syncs/ root
Stable background on Zach — working style, bandwidth, what he's good at, communication norms.

**`active-development.md`**
What's actively being built right now — features in progress, bugs being fixed, current focus.

**`systems-context.md`**
Current state of the codebase and infrastructure — what exists, how it's structured, what's stable vs. fragile.

**`technical-decisions.md`**
Decisions made about architecture, tools, frameworks, or code approach during this meeting.

---

### Development — Testing / Onboarding (`development/testing-amlan/`)

**`business-context.md`**
What DD's business situation was at the time — why this person was brought on, what was needed.

**`onboarding-checklist.md`**
What needs to happen to get this person set up — access, accounts, tools, walkthroughs.

**`role-expectations.md`**
What Dax expects from this person — scope, deliverables, communication cadence.

**`access-setup.md`**
Specific accounts and access that were granted or need to be granted.

**`git-workflow.md`**
How this person should interact with the codebase — branching, PRs, review process.

**`project-workflow.md`**
How work gets assigned and tracked — where tasks live, how to communicate progress.

**`final-thoughts.md`** — lives at person folder root
End-of-engagement summary — what worked, what didn't, whether to work with this person again.

---

### Strategy — Positioning (`strategy/positioning/`)
Solo Dax sessions focused on brand, pricing, how DD presents itself, and big-picture direction.

**`vision-and-positioning.md`**
Where DD is going and what it stands for. How Dax wants to frame DD to members and the market. What DD is and is not.

**`systems-and-operations.md`**
Operational systems discussed — how DD runs, staffing, workflows, infrastructure decisions.

**`strategies-discussed.md`**
Betting strategies or educational frameworks discussed in depth — formatted and cleaned up as content. Used when the session is heavy on strategy/education rather than operational systems.

**`roadmap.md`**
Sequenced next steps — what needs to happen and in what order. Short-term priorities and what's on hold.

---

### Strategy — Projects (`strategy/projects/`)
Sessions focused on specific projects — scoping, planning, prioritizing.

**`project-scopes.md`**
What each project actually involves — what's being built, what problem it solves, what's out of scope.

**`priorities.md`**
How projects stack rank against each other — what gets done first and why.

**`action-plan.md`**
Concrete next steps for each project — who does what, in what order.

---

## How to Use This Folder

**To catch up on a specific person or relationship:**
1. Read their context file at the person folder root (`[name]-context.md`, `ongoing-thoughts`, etc.)
2. Read the most recent meeting's `summary.md`
3. Check `next-steps.md` or `action-items.md` for open items

**To understand DD's current strategy:**
Read the most recent `strategy/positioning/[date]/` folder — start with `summary.md`, then `vision-and-positioning.md` and `roadmap.md`

**To process a new meeting:**
Read `PROCESSING-GUIDE.md` first. It defines which files to create, in what order, for every meeting type.

**To understand a specific opportunity or deal:**
For external relationships, go straight to `opportunities.md` in the most recent meeting folder.
