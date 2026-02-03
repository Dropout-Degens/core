# Dev Sync - 2025-12-28 Systems Context

## Development Environment Setup (For Dax)

### Required Tools
- VS Code (or Cursor for AI features)
- Node.js (latest LTS version)
- pnpm via corepack

### Setup Steps Performed
1. Clone repo via VS Code GitHub integration
2. Install Node.js LTS
3. Run `Set-ExecutionPolicy Unrestricted` (as admin on Windows)
4. Run `npm install -g corepack@latest --force`
5. Run `corepack enable`
6. Run `corepack use pnpm`
7. VS Code auto-save is OFF by default - must save manually (Ctrl+S)

### Git Workflow in VS Code
- Bottom left shows current branch
- Create new branch: Click branch name → "Create new branch from" → select main
- Stage changes: Click + next to file in Git panel
- Commit: Enter message → click checkmark
- Push: Three dots menu → Push → "Publish branch" for new branches

## Codebase Structure

### Welcome Message Location
- File: `welcome.ts` (found via search)
- Function: `generateWelcomeMessage()` - contains literal text strings (orange = string)
- Function: `sendWelcomeMessage()` - in data sync

### Ticket Types
- Stored in database, not code
- Field: `instructions_to_user` - pulled directly into bot messages
- Editing existing types: Immediate effect
- Adding new types: Requires Discord command refresh (known to-do)

### Tagging in Bot Messages
- Tag user: `<@USER_ID>`
- Tag role: `<@&ROLE_ID>` (note the ampersand)

## Data Stats

- Users in database: ~20,000+
- Banned users: 11,658
- JSON file of bans: ~2MB, ~71 pages

## Offboarding Process (Documented)

1. Reroute their @dropoutdgens.com email to owner
2. Cancel/access their subscriptions via magic link
3. Remove from Cloudflare
4. Remove from SuperBase
5. Remove from Google Cloud
6. Remove from GitHub
7. (PostHog - wasn't added)
8. Cancel Notion seats

## AI Code Quality Observations

### Problems with AI-Generated Code
- "Tutorial-like" quality
- Lots of console.logs
- Useless comments
- Doesn't handle edge cases
- Assumes errors never happen
- May not use existing data structures
- May not even be signed into GitHub properly
- Tendency to copy/paste entire files rather than targeted changes
