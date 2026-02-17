# Meeting Transcript Processing Guide

This guide defines how to process meeting transcripts in the `meetings/` folder. Different meeting types require different documentation structures.

---

## Internal Meetings (`meetings/internal/`)

### Type 1: 1-on-1 Meetings (analysts, mods)

**File Structure (4 files):**
1. `summary.md` - Meeting overview, participants, topics, outcomes
2. `action-items.md` - Tasks organized by timeframe and assignee
3. `current-business-context.md` - Business state, revenue model, strategy
4. `ongoing-expectations.md` - Role responsibilities, compensation, behavioral expectations

**Processing Rules:**
- Each meeting date gets its own folder with these 4 files
- Each person folder should have a `{name}-context.md` file summarizing their current role/status
- Process each transcript INDEPENDENTLY - do not mix context between meetings
- Focus on: Role clarity, compensation structure, expectations, business context

### Type 2: Weekly Syncs (`internal/analysts/weekly-meeting/`)

**Indicators:** Group call with multiple analysts, Dax presenting updates, Q&A format

**File Structure (4 files):**
1. `summary.md` - Meeting overview, all participants, topics covered, key outcomes
2. `action-items.md` - Tasks organized by person (Dax, then each analyst), grouped by timeframe
3. `current-business-context.md` - Business state updates shared during the meeting (partners, tools, growth, revenue)
4. `ongoing-expectations.md` - Expectations that apply to ALL analysts from this meeting (not individual)

**Processing Rules:**
- These are group update meetings — primarily Dax presenting to the analyst team
- Content is broader and less personal than 1-on-1s (business updates, tool demos, growth strategy)
- Action items should be broken out per person where applicable
- Ongoing expectations apply to the group, not individuals — individual expectations belong in their 1-on-1 files
- Do NOT update individual `{name}-context.md` files from weekly syncs — those are updated from 1-on-1s only

---

## Development Meetings (`meetings/development/`)

### Type 1: Syncs (`development/syncs/`)

**File Structure (4 files):**
1. `summary.md` - Meeting overview, participants, topics, outcomes
2. `technical-decisions.md` - Architecture choices, implementation approaches
3. `systems-context.md` - Database schemas, infrastructure, technical details
4. `active-development.md` - What was completed, in progress, upcoming tasks

**Processing Rules:**
- These are technical working sessions between Zack (developer) and Dax (founder)
- Process each transcript INDEPENDENTLY - do not mix context between meetings
- Focus on: Technical implementations, debugging sessions, architecture decisions
- Include code references with `file_path:line_number` format when mentioned

### Type 2: Onboarding (`development/testing-amlan/` or similar)

**File Structure (4 files):**
1. `summary.md` - Meeting overview, what was accomplished
2. `business-context.md` OR `access-setup.md` - Business model OR system access details
3. `role-expectations.md` OR `git-workflow.md` - Role clarity OR development process
4. `onboarding-checklist.md` OR `project-workflow.md` - Tasks/setup OR project management

**Processing Rules:**
- These are onboarding sessions for new developers/contractors
- Tailor file names to meeting content (don't force standard names)
- Focus on: Access setup, process explanation, role definition
- Include a `final-thoughts.md` if person was offboarded

---

## External Meetings (`meetings/external/`)

### Type 1: Community Partnership/Acquisition

**Indicators:** Onboarding external community owner, discussing server merge, partnership operations

**File Structure (4 files):**
1. `summary.md` - Meeting overview, partnership details, logistics discussed
2. `partnership-terms.md` - Compensation, conversion attribution, operational responsibilities
3. `integration-plan.md` - Technical setup, invite links, channel access, bot configuration
4. `next-steps.md` - Action items, timeline, follow-up meetings

**Focus Areas:**
- Partnership structure and compensation
- Community size and demographics
- Integration logistics (Discord roles, channels, bots)
- Conversion tracking and attribution
- Timeline for launch/announcement

### Type 2: Product Research/Customer Discovery

**Indicators:** Testing ideas, finding pain points, "mom test" style questioning, building features

**File Structure (4 files):**
1. `summary.md` - Meeting overview, research questions explored
2. `research-findings.md` - Pain points discovered, user behaviors, insights
3. `product-ideas.md` - Potential features discussed, validation status
4. `follow-up-actions.md` - What to build, what to test next, who does what

**Focus Areas:**
- User pain points and problems
- Product hypotheses being tested
- Insights about user behavior
- Feature ideas and validation
- Testing methodologies

### Type 3: Recruiting/Hiring

**Indicators:** Discussing potential role, explaining company, evaluating fit, negotiating terms

**File Structure (4 files):**
1. `summary.md` - Meeting overview, candidate background, role discussed
2. `role-definition.md` - Responsibilities, expectations, time commitment
3. `compensation-structure.md` - Payment terms, bonuses, commission details
4. `candidate-evaluation.md` - Skills/experience, fit assessment, concerns, decision

**Focus Areas:**
- Candidate background and skills
- Role responsibilities and expectations
- Compensation and incentive structure
- Culture fit and availability
- Next steps in hiring process

### Type 4: Partnership/Vendor Collaboration

**Indicators:** Working with external companies (Layup, Chalkboard, etc.), integration discussions, co-marketing

**File Structure (4 files):**
1. `summary.md` - Meeting overview, companies involved, collaboration discussed
2. `collaboration-scope.md` - What each party is contributing, shared goals
3. `technical-integration.md` - API details, data sharing, implementation plan
4. `business-terms.md` - Revenue sharing, marketing commitments, timeline

**Focus Areas:**
- Partnership objectives and mutual benefits
- Technical integration requirements
- Business terms and agreements
- Marketing/promotion plans
- Success metrics and timeline

---

## General Processing Instructions

### Universal Rules
1. **Read fresh for each meeting** - Do not carry context from previous meetings unless explicitly told
2. **Adapt file structure** - If content doesn't fit standard structure, create appropriate files
3. **Be specific** - Include dates, names, numbers, specifics (not vague summaries)
4. **Capture action items** - Always extract who does what by when
5. **Maintain context** - These files are for AI/future reference, not just humans

### How to Determine File Structure
1. Read the first 100-200 lines of transcript
2. Identify meeting type based on:
   - Participants (internal staff vs external partners)
   - Topics (technical vs business vs recruiting)
   - Purpose (working session vs discovery vs onboarding)
3. Choose appropriate file structure from guide above
4. Adapt if needed (prioritize usefulness over rigid structure)

### File Naming Conventions
- Use lowercase with hyphens: `technical-decisions.md`
- Be descriptive but concise
- Standard files: summary, action-items, context, expectations
- Specialized files: partnership-terms, research-findings, integration-plan, etc.

### Content Guidelines
- **Summary:** Always include participants, date, overview, key outcomes
- **Action items:** Organize by timeframe (immediate, short-term, ongoing)
- **Technical details:** Include code references, architecture decisions, system explanations
- **Business context:** Revenue model, strategy, market positioning, challenges
- **People context:** Role clarity, expectations, compensation, communication patterns

---

## Pre-Processing Steps (REQUIRED)

Before writing any files for a meeting, you MUST do the following:

### 1. Read existing processed meetings for style and tone
- Read 2-3 recently processed meetings of the **same type** (e.g., if processing an analyst 1-on-1, read another analyst 1-on-1)
- Match the heading structure, depth, formatting, and tone
- This ensures consistency across all processed meetings

### 2. Read `{name}-context.md` files for every person mentioned
- Read the context file for every person who appears in the transcript
- This prevents misspellings, wrong names, and missing background context
- If a context file is empty or doesn't exist, note that it needs to be created after processing

### 3. Read the most recent `current-business-context.md` for accurate facts
- Read the most recently processed `current-business-context.md` from any meeting type
- Compensation structures, partner counts, revenue numbers, staff status, and tool states change between meetings
- Even though each transcript is processed independently, business facts must be accurate to the current state
- When the transcript contradicts a previous meeting's context (e.g., new compensation terms), the transcript takes priority

## Processing Command Structure

When processing a new meeting folder:

```
1. Read 2-3 existing processed meetings of the same type (style reference)
2. Read {name}-context.md files for all participants mentioned
3. Read the most recent current-business-context.md (facts reference)
4. Identify meeting type from folder path and transcript preview
5. Select appropriate file structure from this guide
6. Read entire transcript (in chunks if needed)
7. Create all files for that meeting
8. Verify files are in correct folder: meetings/{category}/{subcategory}/{date}/
9. Update or create {name}-context.md files for participants (see below)
```

## Context File Maintenance (REQUIRED)

After processing a meeting, you MUST update or create `{name}-context.md` files for participants:

- `internal/analysts/{name}/{name}-context.md` - Analyst's current role and status
- `internal/mods/{name}/{name}-context.md` - Moderator's current role and status
- `development/syncs/zach-context.md` - Developer's current context

**Rules:**
- If the context file is empty or doesn't exist, **create it** after processing the meeting
- If the context file already exists, **update it** with any new information from the meeting (new role details, compensation changes, access setup, etc.)
- Update the `Last Updated` date at the top of the file
- Context files should include a **Meeting History** table at the bottom (see existing context files for format)
- Context files are updated from **1-on-1 meetings only** — do NOT update individual context files from group/weekly meetings
- Read existing context files (e.g., `kaiden-context.md`, `mark-context.md`) for the standard structure before creating a new one
