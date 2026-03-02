# Create Discord Invites — Notes

## What This Script Does

Connects to Discord using the Dropout Degens bot token and generates one or more permanent invite links for a specified channel. Each invite is unique, never expires, and has unlimited uses. All generated invites are printed to the console and saved to a local `exports/` folder as a JSON file.

## How to Run

**Setup (first time only):**
1. Copy this script to a working directory on the local machine
2. Run `npm install discord.js dotenv` in that directory
3. Create a `.env` file with the DD bot token — `DISCORD_TOKEN=your_token_here`

**Run:**
```bash
node create_invites.js [CHANNEL_ID] [COUNT]
```

- `CHANNEL_ID` — the Discord channel ID to generate the invite for (right-click channel → Copy Channel ID)
- `COUNT` — how many unique invite links to generate (default is 1 if omitted)

**Example — create 10 invites for a channel:**
```bash
node create_invites.js 1102118618097012776 10
```

## Output

- Prints each invite URL to the console as it's created
- Saves all invites to `exports/invites_[channelId]_[timestamp].json`
- Each invite object includes: url, code, channel name, channel ID, maxAge, maxUses, createdAt

## Notes

- Uses the **Dropout Degens bot token** (not the asiad bot). Token goes in `.env` as `DISCORD_TOKEN`.
- Invites are permanent (maxAge = 0) and unlimited use (maxUses = 0) by default.
- A 500ms delay is added between each invite creation to avoid Discord rate limiting.
- The bot only needs the `Guilds` intent — no message reading or other permissions required.
- The `exports/` folder is created automatically if it doesn't exist.
