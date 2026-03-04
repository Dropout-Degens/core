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
