# Text-to-Speech Voice Integration via ElevenLabs
**Status:** Open  
**Date Created:** 2026-03-03  
**Priority:** Medium  
**Owner:** Zack (implementation), Dax (decision)
**Dependency:** Voice call integration (Google Voice webhook)

## Problem
YodAI currently has no voice. When callbacks are sent via Google Voice SMS or when voice notes are requested, there's no audio component. This makes callbacks feel impersonal and limits the UX of voice-first communication.

## Solution: ElevenLabs Text-to-Speech

Use ElevenLabs API to convert task execution results into audio. Start with free tier (pre-built voices), upgrade to custom voice cloning later if needed.

### Why ElevenLabs?
- Natural-sounding voices (much better than Google TTS)
- Free tier includes API access + standard voices
- Easy integration with existing systems
- Option to add custom voice cloning later ($5+/month)
- Can generate voice notes in addition to call callbacks
- Good documentation and community examples

---

## Implementation Plan

### Phase 1: Basic Integration (Weeks 1-2)

#### Setup
1. Create ElevenLabs account (free tier)
2. Choose a voice from pre-built options
3. Get API key
4. Add to `.env` file

#### Integration Points
1. **Google Voice callbacks:** When task execution completes, convert SMS result to audio file
   - Generate audio via ElevenLabs API
   - Send audio via Twilio/Vonage callback (if using SMS)
   - Or send as Telegram voice note (alternative)

2. **Optional voice notes in Telegram:** If user asks "send voice note" in response
   - Convert task summary to audio
   - Send as Telegram audio message
   - Store transcription in repo (as usual)

#### API Implementation
```
Text input → ElevenLabs API → MP3/WAV file → Callback channel (SMS/Telegram)
```

**Cost:**
- Free tier: ~10,000 characters/month (~5-10 typical callbacks)
- Pricing beyond free: $5/month for 100k chars/month (plenty of headroom)

### Phase 2: Voice Selection (Before Launch)

Choose one voice from ElevenLabs pre-built library:
- **Male voices:** Adam, Arnold, George, etc.
- **Female voices:** Bella, Charlotte, Emily, etc.
- **Criteria:** Clear, professional, friendly tone

Test 3-5 voices with sample text. Pick one that feels "right" for YodAI's personality.

### Phase 3: Voice Cloning (Optional, Future)

If the pre-built voice feels too generic:
1. Record 1-2 minutes of voice sample (Dax or chosen speaker)
2. Upload to ElevenLabs
3. Generate custom voice clone
4. Upgrade to paid tier ($5/month minimum)
5. Update API integration to use custom voice ID

---

## Implementation Checklist

### Phase 1 (Required for launch)
- [ ] Create ElevenLabs free account
- [ ] Explore and choose pre-built voice
- [ ] Get API key and add to `.env`
- [ ] Build ElevenLabs API wrapper (text → audio)
- [ ] Integrate with Google Voice callback pipeline
  - [ ] Generate audio file on task completion
  - [ ] Route to callback channel (Telegram voice note or SMS link)
- [ ] Test end-to-end (call → transcription → execution → voice callback)
- [ ] Error handling (TTS failures, network issues, etc.)
- [ ] Document voice selection choice in this file

### Phase 2 (Before going live)
- [ ] Test all pre-built voices with sample callbacks
- [ ] Get feedback from Dax on voice quality/personality fit
- [ ] Lock in final voice choice
- [ ] Update API with selected voice ID

### Phase 3 (Optional, future)
- [ ] Record voice sample (if custom cloning desired)
- [ ] Upload to ElevenLabs
- [ ] Create custom voice clone
- [ ] Upgrade ElevenLabs plan
- [ ] Update API to use custom voice ID
- [ ] Test custom voice with callbacks

---

## Integration Points

### 1. Google Voice Callback (Primary)
```
User calls Google Voice → Transcript sent to Claude → Tasks executed → Results summarized
→ ElevenLabs TTS (result text) → Audio file → Callback to user (Telegram voice note or SMS link)
```

### 2. Telegram Voice Note (Optional)
```
User asks "send voice note" in response → Result text → ElevenLabs TTS → Telegram audio message
```

### 3. Future: Live Call Response
```
User calling → Transcript → Execution → Results converted to audio → Read back to caller via TTS
```

---

## Technical Details

### ElevenLabs API
- **Endpoint:** `POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}`
- **Required:** API key (free tier available)
- **Input:** Text string (max ~500 chars per request, but can chain multiple)
- **Output:** MP3, WAV, or µ-law audio file
- **Latency:** ~2-5 seconds typically

### Voice Selection
**Pre-built voices available on free tier:**
- Adam (Male, calm, professional)
- Arnold (Male, deep, authoritative)
- Bella (Female, warm, friendly)
- Charlotte (Female, professional, neutral)
- Chris (Male, casual, friendly)
- And 10+ more options

*Decision: Choose voice before implementation begins*

---

## Success Signals

- ElevenLabs account created and API key working
- Selected voice generates clear, natural audio
- Google Voice callback includes audio component (not just SMS text)
- Latency is <5 seconds from task execution to audio generation
- Audio quality is professional and intelligible
- Cost stays within free tier ($0/month) or minimal paid tier ($5/month)

---

## Dependencies

- Google Voice webhook integration (in progress)
- Google Cloud Speech-to-Text (for incoming call transcription)
- Claude API (for task execution)
- Telegram or Twilio/Vonage (for callback delivery)

---

## Notes

- Start with **free tier** — standard voices are high quality and sufficient
- Voice cloning can wait until after launch (optional upgrade)
- Consider voice personality: Should YodAI sound professional? Friendly? Fast-paced?
- Test callbacks thoroughly before going live (audio quality is part of UX)
