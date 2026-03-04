# Uptime Logging & Missed Schedule Recovery

**Status:** Open  
**Date Created:** 2026-03-04  
**Priority:** High

## Problem
The daily schedule (e.g., noon user join count) is missed when the device is offline. There's no visibility into when the bot is running vs. offline, and no mechanism to detect and resend missed scheduled tasks.

## Solution
Implement two complementary features:

### 1. Uptime Logging
- Log bot start/stop timestamps locally (store in a local uptime log file, path TBD with ops)
- Format: Simple timestamp + event (START | STOP) per line
- Runs automatically on bot startup and shutdown
- Provides audit trail of device availability

### 2. Missed Schedule Detection & Recovery
- On bot startup, check which scheduled tasks were supposed to run while offline
- Compare scheduled times against uptime log
- If a scheduled task's time window passed while bot was offline, flag it as missed
- Auto-send missed schedule items on next startup (or queue for immediate send)
- Works for recurring schedules (e.g., daily noon report)

### 3. Message Batching (Secondary)
- If a single schedule would produce >3 messages, combine them into one before sending
- Applies to all schedules

## Technical Notes
- Uptime log lives locally (exact path TBD — other AI will define)
- Missed schedule detection should reference the schedule registry (identify which schedules are recurring and when they run)
- Recovery should preserve original send destination and format (Discord channel, email, etc.)
- Batching rule: >3 messages = combine into single message with formatted sections

## Example Flow
1. Bot starts at 1:15 PM EST
2. Uptime log checked — sees bot was offline from 10:00 AM to 1:15 PM
3. Noon schedule was supposed to run at 12:00 PM — marked as missed
4. Missed task is queued and sent at 1:15 PM with note: "Scheduled for noon, sent now (device was offline)"
5. Batching applied if message count > 3

## Next Steps
- Define local uptime log location and format
- Identify all recurring schedules and their triggers
- Design missed schedule queue and recovery priority
- Implement batching logic for multi-message schedules
