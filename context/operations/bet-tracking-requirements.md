# Bet Tracking Requirements

**Last Updated:** February 6, 2026
**Owner:** Dax (CEO)

---

## Purpose

Bet tracking serves four functions:

1. **Accountability:** Creates a verifiable record of every analyst's performance over time
2. **Transparency:** Members can reference analyst track records — builds trust
3. **AI Integration:** Data feeds into the Bankroll Capital (Layup) AI chatbot, enabling performance queries per analyst
4. **Evaluation:** Dax uses tracking data to assess analyst value and inform compensation decisions

---

## Required Fields

| Field | Description | Format | Example |
|-------|-------------|--------|---------|
| Date | Date the bet was placed | YYYY-MM-DD | 2026-02-06 |
| Calendar Day | Day of the week | Text | Thursday |
| League | Sport or league | Text | NBA, NFL, NHL, MLB, NCAAB, UFC, Tennis |
| Bet Type | Type of wager | Text | Moneyline, Spread, Over/Under, Prop, Parlay, SGP |
| Odds | American odds at time of placement | Number | -110, +150, +250 |
| Unit Size | Number of units wagered | Number | 1, 1.5, 2, 0.5 |
| Result | Outcome of the bet | W / L / P | Win, Loss, Push |
| Units Won/Lost | Net units gained or lost | Number (signed) | +1.5, -1, 0 |

### Optional but Encouraged
- **Book:** Which sportsbook the bet was placed on (helps track partner usage)
- **Reasoning:** Brief note on why the pick was made (helps with review)
- **Confidence Level:** High / Medium / Low (useful for Kelly criterion analysis)

---

## Update Frequency

### The Rule
**Update the spreadsheet IMMEDIATELY when picks are posted.** Do not wait until results come in to add the play.

### Why Immediate Entry Matters
- Retroactive entry leads to missed entries and snowballing backlogs
- Dante's feedback: "Once a play is in the spreadsheet, marking win/loss/push is easy. Missing one day of entry snowballs into multiple missed days."
- If the play is in the spreadsheet before the game starts, marking the result is a 5-second task
- If you wait days to enter plays, you will forget details, mix up odds, and eventually stop tracking

### Workflow
1. Post pick in Discord channel
2. Immediately add the pick to the tracking spreadsheet (date, league, bet type, odds, units)
3. After the game: mark result (W/L/P) and calculate units won/lost
4. Before next day's picks: ensure all previous day's results are marked

---

## Spreadsheet Format

### What Dax Provides
- A **pre-formatted Google Sheets spreadsheet** for each analyst
- Pre-populated with 2026 dates and formulas for:
  - Cumulative unit tracking
  - Win rate calculation
  - ROI per league
  - Running P&L

### ChatGPT Auto-Formatter
- Dax will send each analyst a **ChatGPT link** that can auto-format raw bet data (from chat messages, screenshots, etc.) into the spreadsheet structure
- This reduces manual data entry — paste your plays in natural language and the formatter structures them

### Analyst Responsibility
- Dax provides the initial spreadsheet and formatter
- **Keeping it updated is the analyst's responsibility**, not Dax's
- If the spreadsheet falls behind, the analyst is expected to catch up

---

## Current State Per Analyst

### Mark
- Awaiting 2026 updated spreadsheet from Dax (action item from Feb 6 meeting)
- Previously used personal tracking methods
- Dax committed to pre-populating and sending

### Kaiden
- Currently uses a **26-page Google Doc** tracking every day and bet
- Manually calculates all data with separate tabs for daily records, units, and DV info
- Has an overview section with unit size methodology, trend analysis, and model performance
- Will transition to standardized spreadsheet format once Dax provides it
- Google Doc approach is detailed but not machine-readable or standardized

### Dante
- Stepped back from analyst role
- Provided valuable feedback on tracking: the system works, the problem is personal consistency
- Recommended entering plays immediately to prevent backlog

---

## Integration with Bankroll Capital AI

- Bet tracking data will feed into the **Bankroll Capital (Layup) AI chatbot**
- Data is tracked per analyst so the AI can answer performance queries (e.g., "What's Mark's NBA record this month?")
- Requires consistent, standardized data entry to be useful
- The AI chatbot is also available to analysts as a personal tool for their own analysis

---

## Tools Evaluated but Not Adopted

| Tool | Verdict | Reason |
|------|---------|--------|
| myodds.bet | Rejected | Better visualization than spreadsheets, but too much manual work to maintain |
| Pickett | Rejected | Wanted too much money for pro features. Nanu evaluated and prefers Google Sheets. |
| Google Doc (Kaiden's method) | Transitioning away | Detailed but not standardized. 26 pages of manual tracking is not sustainable or machine-readable. |
| Google Sheets | **Adopted** | Simple, accessible, main limitation is personal consistency (per Dante's feedback). Formulas handle calculations. |

---

## Expectations Summary

1. Every posted pick goes into the spreadsheet **immediately** when posted
2. Results are marked as soon as they are final
3. No gaps — if you post picks, they must be tracked
4. The spreadsheet is the analyst's responsibility, not Dax's
5. Data format must match the standardized template for Bankroll Capital ingestion
6. If you fall behind, catch up before posting the next day's picks

---

## Change Log

| Date | Change | Source |
|------|--------|--------|
| Dec 2025 | Dante feedback on tracking consistency — enter immediately, prevent backlog | Dante 2025-12-27 meeting |
| Jan 2026 | Kaiden's 26-page Google Doc identified, transition planned | Kaiden 2026-01-29 meeting |
| Feb 2026 | myodds.bet and Pickett evaluated and rejected | Dante 2026-02-01, Nanu 2026-02-01 meetings |
| Feb 2026 | Standardized spreadsheet + ChatGPT formatter planned for all analysts | Mark 2026-02-06 meeting |
| Feb 2026 | Bankroll Capital AI integration noted as target use case | Mark 2026-02-06 meeting |

---

## Cross-References

- `analyst-requirements.md` — Bet tracking as part of overall analyst duties
- `staff-compensation.md` — Tracking performance supports compensation evaluation
