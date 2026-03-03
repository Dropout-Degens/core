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

## Four Options Evaluated

### Option 1: Twilio (Recommended)
**How it works:**
- Dedicate Twilio phone number (you own it or it's YodAI's number)
- You call the number → Twilio captures the call
- Audio transcribed in real-time or post-call
- Transcript sent to Claude API for processing
- I process, execute tasks, send results back via Twilio SMS or callback

**Setup Required:**
1. Create Twilio account
2. Get a Twilio phone number (US: $1-2/month)
3. Create webhook endpoint in backend to receive incoming calls
4. Route call audio → speech-to-text service (Google Speech-to-Text or Twilio's built-in)
5. Send transcript to Claude API via existing integration
6. Execute tasks (database queries, file creation, etc.)
7. Return results via SMS callback or TTS-read message back to caller

**Cost Breakdown:**
- Twilio phone: $1-2/month
- Incoming calls: $0.0075/min
- Outgoing SMS: $0.0075/msg
- Google Speech-to-Text: ~$0.006/min transcription
- **Monthly estimate:** $30-50 depending on usage (10-20 calls/month = ~$20-30)

**Pros:**
- Full control over number and routing
- Twilio has mature API and excellent docs
- Can be your personal number or dedicated YodAI number
- Integrates cleanly with existing backend
- Supports chaining multiple calls/transcripts
- Async-friendly (no live conversation needed)

**Cons:**
- Needs backend webhook infrastructure
- Recurring monthly costs
- Requires speech-to-text service (adds complexity)

**Timeline:** 1-2 weeks for implementation (if Zack prioritizes)

**Implementation Checklist:**
- [ ] Create Twilio account + get phone number
- [ ] Build webhook endpoint to receive POST from Twilio (incoming call)
- [ ] Integrate Google Cloud Speech-to-Text or Twilio's built-in transcription
- [ ] Create Claude API call pipeline (transcript → execution)
- [ ] Build response routing (SMS callback with task results)
- [ ] Test end-to-end (call → transcription → execution → SMS result)
- [ ] Error handling (failed transcription, execution errors, etc.)

---

### Option 2: Google Voice + Webhook
**How it works:**
- Use your existing Google Voice number (no new number needed)
- Set up webhook to intercept calls
- Forward to transcription service
- Send transcript to Claude API

**Setup Required:**
1. Enable Google Voice API
2. Create webhook endpoint for call forwarding
3. Integrate speech-to-text service
4. Route to Claude API

**Cost Breakdown:**
- Google Voice: Free (already have it)
- Google Cloud Speech-to-Text: ~$0.006/min
- **Monthly estimate:** $10-15 for moderate usage

**Pros:**
- Uses existing number (no new phone to give out)
- No per-minute call costs (only speech-to-text)
- Cheaper than Twilio long-term
- Cleaner UX (call your own number)

**Cons:**
- Google Voice API is limited (read-only for most operations, limited call forwarding options)
- Less documented than Twilio
- May require custom middleware/workarounds
- Experimental (not well-established pattern)

**Timeline:** 2-3 weeks (more exploratory work)

---

### Option 3: Vonage/Nexmo (Twilio Alternative)
**How it works:**
- Similar to Twilio but different provider
- Vonage phone number → webhook → transcription → Claude

**Cost Breakdown:**
- Vonage phone: ~$0.50-2/month
- Incoming calls: $0.01-0.04/min (cheaper than Twilio)
- Outgoing SMS: ~$0.01/msg
- **Monthly estimate:** $20-40 (slightly cheaper than Twilio)

**Pros:**
- Lower per-minute rates than Twilio
- Same flexibility and mature API
- Good alternative if Twilio pricing is concern

**Cons:**
- Still requires backend integration
- Similar complexity to Twilio
- Less commonly used (fewer community examples)

**Timeline:** 1-2 weeks (similar to Twilio)

---

### Option 4: Telegram Voice Notes (Current, Free)
**How it works:**
- You send voice message via Telegram
- Telegram transcribes automatically
- I process and respond with text/actions
- You follow up with voice or text

**Cost Breakdown:**
- $0

**Pros:**
- Zero development needed
- Already works
- Free
- No infrastructure changes

**Cons:**
- Not a true "call" — it's async voice notes
- Less real-time feeling than phone call
- Requires Telegram app (vs. standard phone)
- May feel clunky for some workflows

---

## Recommendation

**Short term (this week):**
Use Telegram voice notes. They're fast, free, and already fully functional. You can send 10 voice notes and get results faster than setting up a phone integration.

**Medium term (next 2-4 weeks):**
If you find yourself wanting phone calls frequently, ask Zack to prioritize **Twilio integration** (Option 1). It's the most mature, has the best docs, and integrates cleanly with your existing backend infrastructure.

**Long term:**
Consider Option 2 (Google Voice) if Twilio costs become a concern, but prioritize Option 1 first — it's proven and low-risk.

---

## Decision Gate

Before Zack starts building, confirm:
1. **Frequency:** How often would you actually call? (This drives cost justification)
2. **Number:** Dedicated YodAI number or your existing Google Voice?
3. **Response format:** SMS results, callback message, or email summary?
4. **Priority:** After premium walkthrough tickets, EV publishing, and other blockers?

---

## Success Signal

- Can call YodAI phone number from any phone
- Call is transcribed within 30 seconds
- Tasks execute (database queries, file creation, etc.)
- Results returned via SMS or callback within 2 minutes
- No manual intervention needed
