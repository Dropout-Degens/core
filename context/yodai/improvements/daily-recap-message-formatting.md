# Daily Recap Message Formatting Improvement

## Problem
The current daily recap message output lacks visual polish and consistent formatting. This makes it harder to scan quickly and reduces perceived quality of the summary.

## Solution
Improve the recap message with better formatting, visual hierarchy, and readability.

## What Needs to Happen
1. **Visual structure** — Use Discord formatting effectively:
   - Headers with bold/underline for major sections
   - Bullet points for list items
   - Code blocks for structured data (JSON, queries, etc.)
   - Horizontal dividers between sections
   - Emojis for category indicators (✅ completed, 🔄 in-progress, 📋 pending, etc.)

2. **Message layout** — Organize recap into clear sections:
   ```
   ═══════════════════════════════════════
   📋 DAILY RECAP — {DATE}
   ═══════════════════════════════════════
   
   ✅ **Completed Tasks**
   • Item 1
   • Item 2
   
   🔄 **In Progress**
   • Item 1
   • Item 2
   
   📊 **Metrics/Stats**
   [structured data here]
   
   ⚠️ **Issues/Blockers**
   [if any]
   
   👉 **Next Steps**
   [action items]
   ```

3. **Consistency** — Define and apply a recap message template so every day's output looks similar

4. **Readability** — Optimize for Discord's display:
   - Keep sections under Discord's character limit per message
   - Use spacing/blank lines for clarity
   - Avoid walls of text

## Dependencies
- Recap content generation (the source of what gets summarized)

## Questions to Resolve
1. Should the recap be one message or split across multiple threaded messages?
2. What specific sections/metrics should always appear in the recap?
3. Should recap messages be pinned or ephemeral?
4. Any brand/style preferences (color scheme via embed, specific emoji set)?

## Next Steps
Define the recap template, then update the message generation logic.
