# Discord Proof Storage System

**Status:** In Design  
**Created:** 2026-03-10  
**Owner:** YodAI

## Problem
Need a way to capture and store Discord message proofs (screenshots, greened-out bets, wins, etc.) that members post in the community. Currently no structured storage for these assets and metadata.

## Approach

### Data Layer
Create `greened_out_proofs` table in `dax-personal` schema:

```sql
CREATE TABLE "dax-personal"."greened_out_proofs" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  msg_id BIGINT NOT NULL,
  image_id TEXT NOT NULL,
  msg_timestamp TIMESTAMPTZ NOT NULL,
  downloaded_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Fields
- `user_id` — Discord user ID (string)
- `msg_id` — Discord message ID (for reference/tracing)
- `image_id` — Local identifier for the image file
- `msg_timestamp` — When the message was posted in Discord
- `downloaded_at` — When we captured/downloaded the proof
- `created_at` — When the record was inserted

### Storage
- Images stored on branch `yodai/{YYYY-MM-DD}` in a structured path
- Naming: `proofs/{YYYY-MM-DD}/{user_id}/{image_id}.png`
- Indexable by date and user for later retrieval/analysis

### Workflow
1. Member posts proof in Discord
2. YodAI detects message, downloads image
3. Image saved to daily branch under `proofs/` folder
4. Record inserted into `greened_out_proofs` with metadata
5. Available for recap, analytics, or community showcases

## Why This Approach
- Keeps images versioned with daily branch (audit trail)
- Database tracks metadata without storing blob data
- Decoupled: can build retrieval/display later without schema changes
- Lightweight to start, scales easily

## Next Steps
- Confirm table schema with Dax
- Build Discord message detection/download handler
- Integrate into daily workflow
- Create retrieval/display mechanism for recaps
