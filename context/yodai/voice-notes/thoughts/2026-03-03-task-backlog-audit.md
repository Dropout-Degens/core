# Task Backlog Audit
Type: thoughts  
Date: 2026-03-03 05:18 AM EST

## Context
Early morning session reviewing operational tasks scattered across meetings, Discord, and undocumented work. Core issue: everything is siloed and running from memory — no centralized task tracker.

## The Problem
- Team (analysts) can't help because nothing's documented
- Can't delegate because ops work isn't captured anywhere
- Can't grow community without features; can't build features because managing everything manually
- Stuck in a loop: need features to justify activity → need activity to justify features

## Current Backlog (From Feb 7 & Feb 10 Meetings)

### Blockers for $50 Price Increase
1. **Publish EV** — Update info channel + publish NHL data (deadline: late March before season)
   - Fix Flif EV channel routing (alerts going to wrong channels)
   - If AWS doesn't work, fall back to Google Sheets

2. **Premium Walkthrough Tickets** — ASAP, Zack building but blocking price increase
   - New $50/month subscribers need guided onboarding
   - Also need expired sub tickets (offer partner signup for free access)

3. **Content Updates** — Every channel needs refreshed strategy content
   - Betting tips: more depth
   - Onboarding (lobby, rules): updated
   - Education-first positioning

### Operational Tasks
4. **Staff Cleanup**
   - Remove old staff roles from database (after they log in)
   - Update get profile command (add state, age range, bankroll, source, membership history)
   - Audit log: update staff tags per channel

5. **Staff Onboarding** 
   - Schedule weekly analyst meetings (propose Mon/Wed/Fri slots)
   - 1-on-1 with Luke (moving last week, needs catch-up)
   - Weekly 1-on-1 with JP (mod) starting next week
   - Make staff onboarding on conversion system mandatory

6. **Discord Cleanup**
   - Purge and redo all invite links
   - Delete old threads
   - Delete old channels (needs Zach call)

7. **Re-Engagement Campaign**
   - Message every past subscriber individually
   - Apologize for slow period, explain development
   - Share timeline for upcoming features
   - Ask them to tag you in server instead of DMs

### Technical Tasks (Your Work)
8. **EV Channel Routing** — Fix Flif alerts routing to wrong channels
9. **Calculator Bot PR** — Fix Prisma schema issues before merge
10. **Partner Promo Bot** — Update 6-month outdated state availability data
11. **Greened Out Channel Image Tracking** — Plan + build:
    - Store bet slip images in Supabase Storage Buckets
    - Database table (message ID as PK)
    - Track per-user win totals
    - Sum monthly shared wins
12. **Subscription Listings** — Set up WAP, Dub Club, Winnable/Unwinnable
13. **Message Source Detection** — YodAI improvement (just documented)

## Key Insight
You need a **Master Task Tracker** that lives in the repo, organized by:
- Category (Strategic, Operational, Technical)
- Priority (Blocker, Important, Nice-to-Have)
- Status (Not Started, In Progress, Blocked, Done)
- Owner (You, Zack, etc.)

Without this, you can't:
- See the full picture
- Know what's blocking what
- Delegate effectively
- Communicate progress to team

## Next Steps
1. Create centralized task tracker in repo
2. Audit task dependencies (what unlocks what)
3. Identify quick wins vs. longer builds
4. Plan first 1-2 weeks of focused work
5. Document playbooks so analysts can help on ops tasks

## Note on Tool Error
Hit API error during context pull: "tool_use ids were found without tool_result blocks immediately after". This was a message structure issue on the API side (not something to worry about — already fixed in next iteration). The context pull worked fine once retried.
