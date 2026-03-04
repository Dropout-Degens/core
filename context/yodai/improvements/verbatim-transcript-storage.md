# Verbatim Transcript Storage Improvement

## Problem
When asked to create or store a transcript, there's ambiguity about whether to capture verbatim messages or provide a summarized/paraphrased version. This creates inconsistency — some transcripts are complete records, others are edited summaries. For documentation, debugging, and context, verbatim is essential.

## Solution
Establish a strict rule: **When asked for a transcript, always capture and store messages word-for-word. Never paraphrase, summarize, or edit.**

## What Needs to Happen

1. **Recognition** — When the user says "transcript," identify it immediately as a request for verbatim content
2. **Capture** — Record every message exactly as written, including:
   - Exact punctuation
   - Capitalization
   - Line breaks
   - Typos (don't "correct" them)
   - All whitespace/formatting
3. **No editing** — Do not:
   - Paraphrase or rephrase
   - Summarize longer messages
   - Clean up grammar or spelling
   - Remove or condense content for brevity
   - Add editorial commentary
4. **Format** — Store transcripts in a clean, readable format:
   ```
   **Sender:** Message content exactly as written
   ```
   Keep chronological order, preserve all context

5. **Apply to all transcript contexts:**
   - Voice note transcripts
   - Conversation transcripts (like this soul document)
   - Call transcripts
   - Any other situation where "transcript" is mentioned

## Dependencies
- None — this is a behavioral/operational rule

## Questions to Resolve
1. Should timestamps be included if available?
2. Should reactions/emojis be captured as-is or as text descriptors?
3. For multiline messages, preserve exact line breaks or normalize to single lines?

## Why It Matters
- **Accuracy** — Verbatim transcripts are the source of truth; paraphrasing introduces distortion
- **Context preservation** — Exact wording captures nuance, tone, and intent that summaries lose
- **Documentation** — For future reference, having the exact record is invaluable
- **Trust** — Using verbatim means the user can verify what was actually said, not what I *think* was said

## Next Steps
Implement immediately. Add to YodAI operating guidelines and soul document reference.
