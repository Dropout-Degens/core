# Discord Bot Scripts

Scripts and explorations for the Dropout Degens Discord bot. All original source files live at `H:\dropout_degens\claude\discord_bot\` on the local machine — this folder holds context copies, examples, and documentation for use in Claude sessions where the local machine isn't accessible.

---

## Local Setup

1. Copy the target script to a working directory
2. Run `npm install discord.js dotenv`
3. Create a `.env` file: `DISCORD_TOKEN=your_token_here`
4. Run the script

**Use the YodAI bot token for all local testing — never the production DD bot.** YodAI is a separate bot used for development and exploration. Its token is stored separately from the production DD token. Point test scripts at YodAI's Discord channels (not live DD channels). See `core/context/yodai/improvements/discord-channel-mapping.md` for YodAI channel IDs.

---

## Folder Contents

### `channel-map.md`
Full map of every permanent channel in the DD server — name, ID, and type, organized by category. Use this to look up a channel ID before writing any script that targets a specific channel. Ticket threads are excluded (they're temporary per-member threads). Generated March 2026.

### `examples/`
Basic working scripts to use as building blocks. Start here when building something new.

| Script | What it does |
|--------|-------------|
| `get-channels.js` | Fetches all channels in the server, grouped by category with ID, name, and type. Saves to JSON. |
| `get-server-info.js` | Fetches server metadata — member count, boost level, channel count, all roles with IDs. Saves to JSON. |

Run either with: `node get-channels.js` or `node get-server-info.js`

### `new-invites/`
Script for generating permanent Discord invite links. See `new-invites/notes.md` for full setup and run instructions.

---

## Other Explorations (source in local `discord_bot/` folder)

These have full scripts and/or PRDs in `H:\dropout_degens\claude\discord_bot\`. Not copied here but documented for reference.

| Exploration | Script | What it does |
|-------------|--------|-------------|
| Server Data Exporter | `index.js` | Exports full server structure and message history to JSON + markdown. `node index.js structure` or `node index.js export [CHANNEL_ID] [LIMIT]` |
| Invite Tracker | `invite_tracker.js` | Persistent bot that detects joins, matches the invite used, and replies to the Discord join message with the code and creator. |
| Arbitrage Calculator | `arbitrage_calculator.js` | Discord slash command `/arbitrage-calculator` — takes two odds + a stake, calculates the hedge bet needed for guaranteed profit. Ephemeral result with shareable Components V2 output. |
| Odds Calculator | PRD only | Discord slash command `/odds-calculator` — converts between American, Decimal, and Implied Probability formats. |
| Parlay Calculator | PRD only | Discord slash command `/parlay-calculator` — takes wager + up to 12 legs, calculates combined odds, payout, and profit in units. |
| Media Scanner | PRD only | Scans a channel for messages with image/video attachments, extracts user ID + timestamp + URLs. |
| Count Messages | `count_messages.js` | Utility — message count for a channel. |
| Explore Channel | `explore_channel.js` | Utility — channel data exploration. |

PRDs are in `H:\dropout_degens\claude\discord_bot\PRD_[name].md` — full specs including UI mockups, calculation logic, and database schemas.
