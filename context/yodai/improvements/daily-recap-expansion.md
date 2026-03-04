# Daily Recap Expansion

## Problem
The current daily recap is missing key operational metrics that provide visibility into how the day was spent and what got done.

## Solution
Expand the daily recap to include:

1. **Credits Spent During the Day**
   - Total credits consumed from the day's activities
   - Breakdown by category if applicable

2. **Top 5 Most Worked On Topics**
   - Table format showing topics discussed/worked on and frequency
   - Pulled from session logs and voice notes

3. **Number of Discord & Telegram Calls**
   - Count of calls made on each platform
   - Helps track communication volume and engagement

4. **Daily Calendar Events Summary**
   - Recap of completed calendar tasks for the day
   - Quick overview of scheduled vs. actual completion

## Implementation Details

**Metrics to collect:**
- Credit usage tracking (per session/tool call)
- Topic frequency from logs (brainstorms, ideas, session context)
- Call counts from Discord/Telegram transcripts
- Calendar event completion status

**Format:**
- Credits: Simple total + daily average
- Topics: Table with topic name | frequency | time spent
- Calls: Separate counts for Discord and Telegram
- Calendar: Bulleted list of completed events with times

**Timing:**
- Recap runs at 11:30 PM EST
- Data collected throughout the day and aggregated for display

## Status
Ready for implementation

---

## Scheduling Logging

**What it does:**
Create structured logs for all recap scheduling interactions (success/fail, timestamps, errors).

**Why:**
When recaps fail silently, there's no trail to diagnose what went wrong. Logging provides visibility into timing issues, merge conflicts, API failures, etc.

**What to log:**
- Recap trigger time (scheduled vs. actual execution)
- Branch merge status (success/fail)
- Message post status (success/fail)
- Duration of each step
- Error details if anything fails

**Log format example:**
```
[2026-03-04 23:30:00 EST] RECAP_SCHEDULED | triggered
[2026-03-04 23:30:15 EST] BRANCH_MERGED | yodai/2026-03-04 → main (success)
[2026-03-04 23:30:45 EST] MESSAGE_POSTED | Discord recap sent (msg_id: xxx)
[2026-03-04 23:31:00 EST] RECAP_COMPLETE | duration: 61s
```

---

## Debug Daily Scheduling Issues

**What it does:**
Build tools to diagnose why recaps fail and surface actionable info.

**Why:**
Manual troubleshooting is slow. Need systematic way to identify failure points (scheduling, merge, post, etc.).

**Health checks to run:**
- Is the daily branch available?
- Does it have commits ready to merge?
- Are there merge conflicts with main?
- Can the merge complete cleanly?

**During execution:**
- Track timing at each step
- Measure merge and post latencies
- Capture any API errors or timeouts

**On failure:**
- Identify exact failure point
- Capture error message/stack trace
- Suggest remediation (retry, manual merge, etc.)

**Optional:**
- Quick status check command (last recap time, next scheduled time, current branch status)
- Automatic retry logic on failure
- Manual debug trigger (e.g., `/debug-recap` command)

---

## Message Formatting & Polish

**What it does:**
Improve recap message output with better Discord formatting, visual hierarchy, and readability.

**Why:**
Current output lacks polish and is hard to scan quickly. Better formatting improves usability and perceived quality.

**Formatting improvements:**
- Use Discord markdown: bold headers, bullet points, code blocks
- Add category emojis (✅ completed, 🔄 in-progress, 📋 pending, ⚠️ issues, etc.)
- Use horizontal dividers between sections
- Add consistent spacing for visual clarity

**Message structure:**
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

📊 **Metrics & Stats**
[structured data]

⚠️ **Blockers/Issues**
[if any]

👉 **Next Steps**
[action items]
```

**Considerations:**
- Keep sections under Discord's character limit per message
- Consider splitting into multiple threaded messages if needed
- Define consistent template for daily use
- Match any existing Dropout Degens brand/style preferences

---
