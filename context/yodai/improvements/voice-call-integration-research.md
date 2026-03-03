# Voice Call Integration Research
**Status:** Open  
**Date Created:** 2026-03-03  
**Priority:** Medium  
**Owner:** Zack (implementation), Dax (decision)

## Problem
Currently YodAI is text-first (Telegram messages, Discord messages). Dax wants the ability to **call YodAI, have the call transcribed, and have tasks executed and reported back** — async voice conversation without needing to type.

## Current Capabilities
- **Input:** Telegram (text, voice notes), Discord (text)
- **Output:** Text replies, reactions, file creation, database queries, emails (drafts), calendar events
- **Missing:** Phone integration, incoming call handling, speech-to-text pipeline

## Decision: Google Voice + Webhook

**Status:** Chosen  
**Rationale:** Uses existing Google Voice number, lower ongoing costs, cleaner UX

### How It Works
1. You call your existing Google Voice number
2. Google Voice webhook forwards call to transcript service
3. Audio transcribed to text via Google Cloud Speech-to-Text
4. Transcript sent to Claude API for processing
5. I execute tasks (database queries, file creation, etc.)
6. Results returned via SMS callback with task summary
7. **Full call transcript stored in GitHub repo** (on daily branch, e.g., `context/yodai/voice-notes/calls/2026-03-03-call-transcript.md`)

### Setup Required
1. Enable Google Voice API
2. Create webhook endpoint for call forwarding
3. Integrate Google Cloud Speech-to-Text
4. Route to Claude API (existing integration)
5. Build transcript storage pipeline → GitHub commit
6. Create SMS callback service for results

**Cost Breakdown:**
- Google Voice: Free (already have it)
- Google Cloud Speech-to-Text: ~$0.006/min
- SMS callback (if using Twilio/Vonage for outbound): ~$0.01/msg
- **Monthly estimate:** $15-25 for moderate usage (10-20 calls/month)

**Pros:**
- Uses existing number (no new phone to give out)
- No per-minute call costs
- Transcripts automatically stored in repo alongside voice notes
- Cleaner UX (call your own number)
- Integration with existing daily branch workflow (same as voice notes)

**Cons:**
- Google Voice API is limited (may require workarounds)
- Requires custom middleware
- Experimental (less established pattern)

**Timeline:** 2-3 weeks (more exploratory work)

---

## Transcript Storage Design

### File Structure
```
context/yodai/voice-notes/calls/
  2026-03-03-morning-strategy-call-transcript.md
  2026-03-04-task-execution-call-transcript.md
```

### File Format
```markdown
# Call Transcript
Date: 2026-03-03 09:15 AM EST
Duration: 4:32
Caller: Dax (Google Voice)

## Raw Transcript
[Full transcription of call verbatim]

## Execution Summary
- Tasks executed: [list]
- Results: [summary]
- Errors: [if any]

## Call Recording
Link to call recording (if stored in Supabase/GCS)
```

### Storage Pipeline
1. Call audio captured by Google Voice webhook
2. Transcribed via Google Cloud Speech-to-Text
3. Transcript + execution results formatted in markdown
4. Committed to `yodai/{YYYY-MM-DD}` branch automatically
5. Transcript available for review at daily recap
6. Optional: Merge to main if notable strategic call

---

## Implementation Checklist

- [ ] Enable Google Voice API
- [ ] Create webhook endpoint for incoming calls
- [ ] Integrate Google Cloud Speech-to-Text
- [ ] Create Claude API call pipeline (transcript → execution)
- [ ] Build GitHub commit pipeline for transcript storage
- [ ] Create SMS callback service for task results
- [ ] Test end-to-end (call → transcription → execution → storage → SMS result)
- [ ] Set up error handling (failed transcription, execution errors, etc.)
- [ ] Document call format for context processing (similar to voice notes)

---

## Decision Gate (Completed)

✅ **Frequency:** As needed (not high-volume)  
✅ **Number:** Your existing Google Voice number  
✅ **Response format:** SMS results + transcript in repo  
✅ **Transcript storage:** GitHub daily branch (context/yodai/voice-notes/calls/)  
✅ **Priority:** After premium walkthrough tickets, EV publishing, and other blockers

---

## Success Signal

- Can call Google Voice number from any phone
- Call is transcribed within 30 seconds
- Tasks execute (database queries, file creation, etc.)
- Results returned via SMS within 2 minutes
- Full transcript stored in repo on daily branch
- Transcript available for recap review and context
