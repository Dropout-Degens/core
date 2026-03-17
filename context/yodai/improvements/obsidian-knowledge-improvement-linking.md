# Improvement: Obsidian Knowledge + Improvement Linking
**Status:** Open  
**Date:** March 17, 2026  
**Category:** Knowledge management system  

---

## Problem

Currently, AI context and improvements live in GitHub. When you implement something and build knowledge around it in Obsidian, there's no connection between:

- What was built (the implementation)
- Why it was built (the improvement doc)
- How it's used (the knowledge/process docs)

This creates fragmented context — you implement something, document how it works in Obsidian, but the reasoning lives separately in GitHub. If you need to understand why a decision was made, you have to jump between systems.

---

## Solution

**Move the entire context system to Obsidian** (improvements, decisions, reasoning, implementation details) and **link implementation knowledge back to the improvement that justified it**.

### The Structure

**Improvements folder in Obsidian:**
- Each improvement gets its own note (same format as current GitHub docs)
- Title, Problem, Solution, Implementation Details, Status
- Lives permanently in Obsidian (source of truth, not GitHub)

**Knowledge/Process folder in Obsidian:**
- How-tos, processes, features, systems
- Every knowledge note references the improvement(s) that created it
- Format: `[Improvement: telegram-session-web-archive]` or similar backlink

**The linking pattern:**
```
# How to Use Session Archive

Created by: [[Improvement: telegram-session-web-archive]]

Steps:
1. Open the Session Archive in the web app
2. Filter by date or keyword
3. Tag sessions you want to keep
...

See also: [[Session Storage System]], [[Web App UI Patterns]]
```

---

## What This Enables

- **Traceability:** Every process, feature, and system links back to why it exists
- **Reasoning preserved:** The improvement doc stays with its implementation — not lost in GitHub history
- **Single source of truth:** Obsidian is the system, no jumping between tools
- **Decision history:** When you implement something, the "why" is right there in a backlink
- **Easier onboarding:** New team member reads a feature doc, clicks the improvement link, understands the full context

---

## Implementation Details

### Migration
1. Export all improvement docs from GitHub to Obsidian (same format)
2. Create `Improvements/` folder in Obsidian vault
3. Create `Knowledge/` folder for all process/how-to docs
4. As you implement or update things, add backlinks to the improvement that created it

### Linking Format

**In knowledge/process docs, reference the improvement:**
```markdown
# Feature Name

Created by: [[Improvement: feature-name-slug]]

Description:
...

Implementation:
...

Related:
- [[Improvement: related-improvement]]
- [[Knowledge: related-process]]
```

**In improvement docs, add "Implemented in" section once complete:**
```markdown
# Improvement: Feature X

...

## Status
Implemented ✓

## Knowledge References
- [[Knowledge: How to use Feature X]]
- [[Knowledge: Feature X troubleshooting]]
- [[Knowledge: System integration]]
```

### Benefits Over GitHub

- **Faster access:** Open Obsidian, search, and read the improvement + knowledge together
- **Backlinks work both ways:** Click an improvement, see what knowledge depends on it
- **Better for thinking:** Obsidian vault grows with your system, improvements are part of the knowledge base, not a separate tracking system
- **Local + portable:** Vault stays with you, syncs however you want (Git, iCloud, Sync, etc.)

---

## Example

**Improvement note:**
```
# Improvement: Discord Analytics Dashboard

Problem: No real-time view of member activity, vote patterns, or community health

Solution: Build a dashboard that pulls live data from Discord and displays:
- Daily member count
- Poll participation rate
- Message velocity
- Cohort analysis

Status: Implemented ✓

Knowledge References:
- [[Knowledge: Discord Analytics Dashboard Guide]]
- [[Knowledge: Interpreting member activity metrics]]
```

**Knowledge note:**
```
# Discord Analytics Dashboard Guide

Created by: [[Improvement: Discord Analytics Dashboard]]

The dashboard shows:
1. **Daily Active Members** — count of unique message authors per day
2. **Poll Participation** — % of members voting on daily polls
3. **Message Velocity** — messages per hour by channel
4. **New Member Cohorts** — join date, activity level, retention

How to access:
...

Metrics explained:
...

Troubleshooting:
...
```

---

## Next Steps

1. Set up Obsidian vault structure (Improvements/, Knowledge/, Systems/)
2. Migrate GitHub improvements to Obsidian format
3. Establish linking convention (standardize backlink format)
4. Create a template for new improvements
5. Create a template for knowledge docs with improvement reference section
6. As you build, link knowledge back to improvements

---

*Created: March 17, 2026*
