# Amlan Setup Session - 2025-11-08 Git Workflow

## Standard Development Process

### 1. Create a Branch
- Create locally or on GitHub (doesn't matter which)
- Check out the branch before working

### 2. Make Changes
- Work in your branch, not main
- Break changes into smaller commits (recommended but not required)
- Push when ready

### 3. Create Pull Request
- Go to GitHub
- Create PR: your branch → main
- Include description of changes

### 4. Code Review
- Zack reviews the PR
- Discussion happens in PR comments if needed
- Changes requested if necessary

### 5. Merge
- Zack handles the merge to main (typically)
- Code goes live after merge

## Emergency Exception

If there's a critical issue (e.g., database down):
- Amlan CAN push directly to main
- Only in genuine emergencies
- Zack prefers this not to happen under normal circumstances

## Code Style Guidelines

### Keep It Consistent
- Follow existing codebase structure
- Match current patterns for actions/interactions
- Use same conventions the bot already uses

### Proposing Changes
If you think something could be done better:
1. Write up a quick spec (can use AI to help)
2. Share with Zack BEFORE implementing
3. Discuss to ensure it fits with existing architecture

Example from Zack:
> "If he tries to implement his own audit logging somewhere, I could note like, hey, we already have a built-in function just to send an audit log message."

### Using AI (Claude)
- Encouraged to use Claude for development
- Make sure Claude understands the codebase structure
- AI should also follow the existing code patterns

## Pull Request Descriptions

From Zack:
> "You pretty much have to write a description of your changes for GitHub anyway... That should be a good reminder to be like, hey, here's all the things."

This serves double duty as:
- Git history documentation
- Communication to Zack about what changed

## Resources for Getting Started

- Explore the 4 GitHub repositories
- Check infrastructure diagram in general dev channel
- READMEs are out of date (warning from Zack)
- Best to just look around the code to understand structure
