# Amlan Setup Session - 2025-11-08 Project Workflow

## Notion Structure Overview

The only section Amlan needs to focus on: **Project Planning**

(Company Home page exists but not relevant for daily work)

## Project Lifecycle

### 1. Backlog
- Where all projects start
- Contains full project context

### 2. In Progress
- Projects actively being worked on
- Shows up in "Active" section
- Only in-progress projects have assignable tasks

### 3. Review
- Completed work awaiting Zack's code review
- Tag Zack with link to pull request

## Project Structure

Each project contains:

| Section | Purpose |
|---------|---------|
| Opportunity | What is being built |
| How it works | Technical context |
| What we're measuring | Success metrics (e.g., number of filters, click rates, conversion rates) |
| Potential | Why this matters |
| Tasks | Individual work items |

## Task Flow

### How Tasks Get Assigned
1. Dax creates project with full context
2. Dax breaks down into tasks
3. Some tasks are Dax's (e.g., finding filter criteria)
4. Some tasks assigned to Amlan (e.g., implementing filters)
5. Tasks only assigned when Amlan is unblocked

### Development Board Statuses

| Status | Meaning |
|--------|---------|
| Blocked | Waiting on prerequisite work (usually Dax) |
| Not Started | Unblocked and ready to begin |
| In Progress | Currently being worked on |
| Review | Work complete, awaiting Zack's review |

### Example Flow (EV Filters Project)

1. **Dax's tasks:** Find the filters, document criteria
2. **Amlan blocked:** Waiting for filter specifications
3. **Dax completes:** Filters documented and shared
4. **Amlan unblocked:** Task moves to "Not Started"
5. **Amlan works:** Moves to "In Progress"
6. **Amlan finishes:** Pushes to branch, creates PR
7. **Amlan updates Notion:** Moves to "Review", comments with PR link
8. **Zack reviews:** Handles merge to production

## Communication

### For Zack Questions
- General dev channel in Discord (once tagging is fixed)
- Or direct message

### For Project Questions
- Comment in Notion task
- Or message Dax directly

## Key Principle

From Dax:
> "Projects will have all context provided upfront so Amlan isn't blocked"

Everything needed to complete a task should be documented in the project before assignment.
