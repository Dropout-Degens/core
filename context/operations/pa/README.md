# Dropout Degens PA Bot

A Telegram bot powered by Claude that can read/write files in this GitHub repo and query the Supabase database.

## Setup

### 1. Get a Telegram Bot Token
1. Open Telegram and message [@BotFather](https://t.me/BotFather)
2. Send `/newbot` and follow the prompts
3. Copy the token it gives you

### 2. Get your Telegram User ID
1. Message [@userinfobot](https://t.me/userinfobot) on Telegram
2. Copy your numeric user ID

### 3. Get a GitHub Personal Access Token
1. Go to GitHub → Settings → Developer Settings → Personal Access Tokens → Fine-grained tokens
2. Create a token with **Read and Write** access to **Contents** on this repo
3. Copy the token

### 4. Get your Supabase Service Key
1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → Project Settings → API
2. Copy the `service_role` key (not the anon key)

### 5. Install & Configure
```bash
# Clone the repo on your machine, then:
cd core/context/operations/pa

# Install Python dependencies
pip install -r requirements.txt

# Copy and fill in the env file
cp .env.example .env
# Edit .env with your values
```

### 6. Run the Bot
```bash
python bot.py
```

Keep this terminal open (or run it as a background service).

## Commands
- Just send any message to chat with Claude
- `/clear` — wipe conversation history and start fresh
- `/start` — greeting

## Customizing Claude's Behavior
Edit `system_prompt.md` to change Claude's persona, instructions, or context about the project.

## Adding Tools
- GitHub tools: `tools/github_tools.py`
- Supabase tools: `tools/supabase_tools.py`
- Add new tool definitions to the `TOOL_DEFINITIONS` list in the relevant file and a handler in `handle_tool_call`
