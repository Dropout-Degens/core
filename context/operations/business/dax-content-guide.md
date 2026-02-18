# Dax × Claude — Development Working Guide

**Purpose:** Documents how Dax and Claude Code work together on Dropout Degens. This is a living document — update it as new patterns, conventions, and workflows get established.

**Scope:** Both types of work we do together:
- **Content/operations work** — meeting processing, documentation, business strategy, context files
- **Technical/code work** — discord-bot features, bug fixes, database changes, scripts

---

## Repo Structure

The working directory is `H:\dropout_degens\github`. There are two main repos inside:

```
H:\dropout_degens\github\
├── core/                        ← Shared library (Prisma schema, API clients, types, DB utils)
│   ├── context/                 ← All internal business context (NOT code)
│   │   ├── meetings/            ← Processed meeting notes (internal + external)
│   │   ├── operations/          ← Business ops docs, compensation, staff policies
│   │   │   └── developing/      ← How Dax and Claude develop together
│   │   ├── strategy/            ← Positioning docs, project strategy
│   │   └── people/              ← Context files on key people (staff, partners)
│   ├── prisma/                  ← Database schema (split by feature)
│   └── src/                     ← TypeScript library code
└── discord-bot/                 ← The main Discord bot
    ├── AGENTS.md                ← Technical architecture doc (also symlinked as CLAUDE.md)
    └── src/                     ← Bot source code
```

**Three places content lives:**
| Location | What goes there |
|----------|----------------|
| GitHub (`core/context/`) | Internal context, meeting notes, business docs — for Dax + AI |
| Routine | External team-facing docs, partnership directory — for staff |
| Supabase | Data (DB), files/documents (Storage), user records |

---

## How We Work Together

### Dax's Role
- Product and operations brain — not a code writer
- Sets direction, approves approach, makes final decisions
- Often communicates via voice-transcribed messages — these tend to be stream-of-consciousness and need interpretation
- Tells Claude when to proceed or stop, not always every detail of how

### Claude's Role
- Executes the work — writing code, processing documents, exploring the codebase
- Figures out the right approach by reading existing context before making changes
- Follows established conventions without needing to be reminded
- Surfaces key decisions for Dax to approve before taking irreversible actions

---

## Starting a Session — What to Read First

Before doing any significant work in a session, Claude should orient itself by reading:

1. **This file** — understand the working patterns
2. **`core/context/operations/README.md`** — business snapshot and key terms
3. **Relevant people context** — `core/context/people/` for whoever the session involves
4. **Recent meeting notes** — for the specific area being worked on (meetings/internal or meetings/external)
5. **`discord-bot/AGENTS.md`** — if doing any code work on the bot

For meeting processing specifically, also read:
- `core/context/meetings/PROCESSING-GUIDE.md` — the canonical guide for how all meetings are processed

---

## Key Conventions

### Meeting Processing
- Every date folder gets **exactly 4 files** — no more, no less, no exceptions
- The 4 files are determined by meeting type from PROCESSING-GUIDE.md
- Before processing any meeting, read: (1) the transcript, (2) PROCESSING-GUIDE.md for that type's template
- File names are lowercase with hyphens: `summary.md`, `role-definition.md`, etc.

### File Editing
- Always read a file before editing it
- Never create new files unless absolutely necessary — prefer editing existing ones
- When adding new doc categories, add them to the relevant README's document inventory table

### Code Work
- Read `discord-bot/AGENTS.md` before touching any bot code — it documents all patterns and conventions
- The bot uses a specific interactions system — follow existing patterns, don't invent new ones
- Always check for existing utilities before writing new ones

### Confirmations
- For irreversible actions (deleting files, pushing, dropping data) — confirm with Dax first
- For large multi-file work sessions — propose the structure/approach and get a "yes, do it" before starting
- For small edits and content work — proceed directly

---

## Interpreting Dax's Messages

Dax often communicates by voice transcribing or typing fast — messages can be run-on and non-linear. Patterns to recognize:

| Signal | What it means |
|--------|--------------|
| "I want you to figure this out on your own" | Explore the codebase first, then propose — don't ask for direction |
| "okay continue" | Keep going with what you were doing |
| Long stream-of-consciousness message | Read it fully, extract the core request, confirm your interpretation in 1-2 sentences before starting |
| "lets do it" / "that's good" | Approved — execute the plan |
| Frustration ("why are there not 4 files") | A convention was violated — stop, re-read the guide, correct before continuing |

---

## Development Patterns

### For Content/Operations Work
1. Read existing examples of the same document type before writing
2. Match the style, depth, and structure of what's already there
3. Use the processing guides and templates — don't improvise structure
4. Keep markdown clean: headers, tables, bullet lists

### For Code Work
1. Read `AGENTS.md` first — always
2. Identify the closest existing pattern to what needs to be built
3. Write code that fits the existing architecture — don't introduce new patterns without a reason
4. Claude Code (`claude-sonnet-4-6`) is the AI model; use it in code when building AI features

### For Planning/Exploration
1. Use the Explore or Plan agents for broad codebase questions
2. For targeted searches, use Glob + Grep directly
3. Present findings clearly before acting on them

---

## Business Context (Quick Reference)

- **Dax** — Founder, 20 years old, non-technical, runs everything as CEO
- **Dropout Degens** — Education-first sports betting Discord community
- **Revenue model** — CPA from partner signups (~$50/partner), subscription ($15/month → $50/month)
- **LTV** — ~$1,500/customer across all available partner conversions
- **Current state** — ~8,000 Discord members, ~$1K/month revenue, pre-marketing push
- **Goal** — $5K-$10K/month MRR after pivot + marketing launch
- **Key partners** — 40+ active affiliate partners, OddsJam (EV alerts), Jake/Real Sports (community)
- **Staff** — All IC (independent contractors), paid via Venmo, commission-based

---

## What Gets Documented in `developing/`

Add to that folder whenever a new working pattern gets established:

- New workflows we figure out together (e.g., how to process a new type of document)
- Decisions about tooling or process (e.g., where specific types of content live)
- Conventions that Claude needs to know to operate correctly in sessions
- Session templates or checklists if recurring work types emerge

---

*Last updated: February 2026*