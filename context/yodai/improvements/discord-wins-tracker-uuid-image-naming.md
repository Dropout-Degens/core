# Discord Wins Tracker — UUID Image Naming

**Status:** Decided  
**Date:** 2026-03-10

## Decision
Image IDs in the wins tracker will use UUID (Universally Unique Identifier) format instead of message IDs.

## Rationale
- Truly unique across all images (zero collision risk)
- No dependency on Discord message structure
- Native support in all language libraries
- Clean, predictable storage paths

## Implementation
Storage path structure:
```
wins/greened-out/{YYYYMM}/{DD}/{uuid}.{ext}
```

Example:
```
wins/greened-out/202603/10/550e8400-e29b-41d4-a716-446655440000.png
```

## Related Context
- Brainstorm: `context/yodai/voice-notes/brainstorms/2026-03-02-discord-wins-tracking-brief.md`
- Bet record will reference the image by UUID
