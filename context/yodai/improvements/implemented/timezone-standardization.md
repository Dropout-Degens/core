# Timezone Standardization

## Problem
YodAI displays times in multiple formats and timezones without consistency. Calendar events return times in CT (Central Time) but context is unclear, making it harder to parse schedules at a glance.

## Solution
Standardize all time displays to EST (Eastern Standard Time) consistently across:
- Calendar events
- Database timestamps
- Any time-based output

When displaying times, always show: `HH:MM AM/PM EST`

## Examples
- Current: "8:45 AM - 9:00 AM CT"
- Improved: "9:45 AM - 10:00 AM EST"

- Current: "2026-03-01T08:45:00-05:00"
- Improved: "9:45 AM EST"

## Implementation
Whenever times are displayed, convert to EST and format consistently without timezone abbreviation after each time (just note EST once if needed, or assume EST as default).

## Note
This applies to all time displays across calendar, database queries, Discord timestamps, and any other time-sensitive output.
