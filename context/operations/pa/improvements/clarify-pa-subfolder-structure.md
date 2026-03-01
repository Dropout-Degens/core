# Clarify PA Subfolder Structure in System Prompt

## Issue
The system prompt's "Repository structure" section lists `pa/` as just "this bot" with no guidance on where improvements should be saved. This caused the first improvement file to be placed in `context/operations/pa/` directly instead of in a dedicated `improvements/` subfolder.

The pattern should match how `yodai/voice-notes/` is structured with type subfolders (brainstorms, ideas, thoughts).

## Required Change

**In `context/operations/pa/system_prompt.md`**, update the Repository structure section:

**Current:**
```
context/
  operations/
    data/       — findings, analysis, data processing notes
    pa/         — this bot
  yodai/
    voice-notes/
      brainstorms/  — brainstorm docs from voice notes
      ideas/        — idea docs from voice notes
      thoughts/     — thought docs from voice notes
```

**New:**
```
context/
  operations/
    data/       — findings, analysis, data processing notes
    pa/         — this bot
      improvements/  — bot improvements and system changes
        brainstorms/   — improvement brainstorms
        ideas/         — improvement ideas
        thoughts/      — improvement thoughts
  yodai/
    voice-notes/
      brainstorms/  — brainstorm docs from voice notes
      ideas/        — idea docs from voice notes
      thoughts/     — thought docs from voice notes
```

## Also Update
Add explicit instruction in the "Writing files" or new "PA Improvements" section:

> **PA Improvements:** When documenting improvements to YoDai or the bot system, save to `context/operations/pa/improvements/{type}/` using the same type classifications (brainstorms, ideas, thoughts). Use kebab-case filenames.

## Impact
- YoDai will now save improvement docs to the correct location
- Matches established pattern used elsewhere in the repo
- Keeps PA improvements organized and discoverable
