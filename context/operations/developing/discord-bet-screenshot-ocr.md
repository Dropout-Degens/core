# Discord Bet Screenshot OCR Improvement

**Status:** Spec  
**Date:** March 2, 2026  
**Priority:** High  

## Problem

Currently, when reading Discord messages with bet screenshots, we get the image URLs but can't extract the actual data (bet amounts, odds, payouts, outcomes). This forces manual inspection to answer questions like "how much was won in that bet?"

## Solution

Use Claude Vision API to automatically extract and parse sportsbook bet data from Discord screenshots.

## Implementation

### 1. New Database Table (dax-personal schema)

```sql
CREATE TABLE "discord_bet_screenshots" (
  id BIGSERIAL PRIMARY KEY,
  message_id BIGINT NOT NULL,
  channel_id BIGINT NOT NULL,
  user_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  image_extracted_at TIMESTAMP,
  
  -- Extracted data
  bet_amount NUMERIC,
  odds NUMERIC,
  payout NUMERIC,
  profit_loss NUMERIC,
  status TEXT, -- 'won', 'lost', 'pending', 'voided'
  sport TEXT,
  league TEXT, -- 'NFL', 'NBA', 'MLB', 'NHL', 'Tennis', etc.
  event_description TEXT,
  bet_type TEXT, -- 'moneyline', 'spread', 'parlay', 'prop', etc.
  sportsbook TEXT, -- 'Fliff', 'DK', 'FanDuel', etc.
  raw_ocr_text TEXT, -- Full extracted text from image
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_discord_bets_user ON "discord_bet_screenshots"(user_id);
CREATE INDEX idx_discord_bets_channel ON "discord_bet_screenshots"(channel_id);
CREATE INDEX idx_discord_bets_status ON "discord_bet_screenshots"(status);
```

### 2. YodAI Enhancement

Add a new function to `read_discord_channel` flow:

```python
def extract_bet_data_from_image(image_url: str) -> dict:
    """
    Use Claude Vision to extract bet data from sportsbook screenshot.
    
    Returns:
    {
      "bet_amount": float,
      "odds": float,
      "payout": float,
      "profit_loss": float,
      "status": str,
      "sport": str,
      "league": str,
      "event_description": str,
      "bet_type": str,
      "sportsbook": str,
      "raw_text": str,
      "confidence": float,
      "error": str (if extraction failed)
    }
    """
    
    prompt = """You are analyzing a sports betting screenshot.
    
Extract and return as JSON:
- bet_amount: amount wagered
- odds: decimal or moneyline odds shown
- payout: total payout if won
- profit_loss: net profit or loss
- status: one of: won, lost, pending, voided, cashed_out
- sport: which sport (NFL, NBA, MLB, NHL, Tennis, Soccer, etc.)
- league: league/tour name
- event_description: teams/players and matchup
- bet_type: moneyline, spread, total, parlay, prop, etc.
- sportsbook: which platform (Fliff, DraftKings, FanDuel, etc.)

If any field is unclear or not visible, use null. Include confidence (0-1) for overall extraction quality.
Return valid JSON only, no markdown."""
    
    # Call Claude Vision API on image_url
    response = claude.vision(image_url, prompt)
    return json.loads(response)
```

### 3. Integration Point

When `read_discord_channel()` encounters a message with image attachments:

```python
for message in messages:
    if message.attachments:
        for attachment in message.attachments:
            if is_image(attachment):
                extracted = extract_bet_data_from_image(attachment.url)
                store_in_database(
                    channel_id=channel_id,
                    message_id=message.id,
                    user_id=message.author.id,
                    image_url=attachment.url,
                    **extracted
                )
```

### 4. Query Interface

New function to YodAI:

```
query_recent_discord_bets(channel_id=None, user_id=None, status=None, days=7)
→ Returns formatted summary of recent bets with amounts
```

Example query result:
```
asiad_ - Feb 26, 5:01 AM (Fliff)
  Bet: $150 @ 1.92 odds
  Status: WON ✅
  Payout: $288 | Profit: +$138

brianoskii55 - Mar 1, 6:54 PM (DraftKings)
  Bet: $200 @ -110 (Spread)
  Status: WON ✅
  Payout: $382 | Profit: +$182
```

## Benefits

1. **Instant lookup** — Answer "how much was won" without manual inspection
2. **Performance tracking** — Aggregate stats by user, sportsbook, sport
3. **Pattern detection** — Spot sharp bettors, winning streaks, bad sports
4. **Automation** — Feed data into analysis pipelines
5. **Archive** — Permanent record even if Discord messages are deleted

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| OCR fails on blurry/cropped screenshots | Store raw_ocr_text; flag low confidence extractions for manual review |
| Parlay data is complex | Break into separate rows or nested JSON; test extensively |
| API cost (Claude Vision) | Cache results; only run on new messages |
| User privacy | Clearly document data storage; allow opt-out per user/channel |

## Testing

1. Run on last 100 messages in #wins channel
2. Manually verify 10 random extractions
3. Check accuracy on parlays vs. singles
4. Test edge cases: voided bets, cashouts, promotions

## Success Metrics

- ✅ Extract bet_amount, payout correctly >95% of time
- ✅ Identify status (won/lost) >98% of time
- ✅ Sportsbook detection >90% of time
- ✅ Can answer "how much was won" in <1 second

## Future Extensions

- Real-time alerts on big wins/losses
- Leaderboard by weekly ROI
- Sharp finder (users with >55% win rate)
- Correlation analysis (best sports/leagues for DD members)
