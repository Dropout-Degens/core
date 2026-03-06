# Telegram Call Functionality: Always Audio Response + Remove Message Limit

## Summary
Modify the Telegram call functionality so that:
1. All responses are sent as audio messages (voice notes) regardless of whether user sends text or voice
2. Remove the 3-message limit that ends transcription — only `/end` command should terminate the call

## Current Behavior
- Voice messages trigger a response
- Text messages may not trigger responses or are handled differently
- Transcription auto-ends after 3 text messages are sent
- User must manually manage when the call actually ends

## Desired Behavior
- User initiates call with `/call` or voice call
- All YodAI responses are audio messages (text-to-speech converted)
- User can send both text and voice messages during the call
- Call continues indefinitely until user explicitly sends `/end` command
- All messages in the call are transcribed and maintained in context

## Raw Transcript
"So when I call you or initiate a slash call, I think we have somewhere coded in that if I send you only like respond if I in voice message is if I send a voice message, can we please change that so that you are always responding in a voice message in the call functionality. And let me think. Oh, yeah, you are always responding in voice even if I send a text, if I send a voice message, however, however we want to do it. But you're always responding in just an audio message. And then the second thing out of that is I want to get rid of the after three text messages are sent that the transcription ends. And I want to change it to be when only when the slash end command is used, that the like all portion ends."

## Implementation Notes
- Convert all text responses to audio using TTS before sending to Telegram
- Remove the counter/limit logic that triggers on message count
- Add explicit `/end` command listener that cleanly closes the call
- Ensure full conversation history is maintained throughout

## Status
Open
