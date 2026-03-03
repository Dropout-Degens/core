# Message Source Detection & Routing

**Status:** Open  
**Date Created:** 2026-03-03  
**Priority:** Medium

## Problem
Currently, YodAI can't differentiate where incoming messages originate (Telegram vs. Discord). This prevents smart routing of responses to the correct platform.

## Goal
Enable YodAI to:
1. Identify the source platform (Telegram primary, Discord secondary)
2. Route responses back to the originating platform/channel
3. Support Discord YodAI channel as a trigger point for commands

## Implementation Plan
1. Add source metadata to incoming messages (platform, channel ID, user ID)
2. Store source info during message processing
3. Route outgoing messages based on source platform

## Discord Integration
- YodAI channel ID: *[TBD]*
- Should accept commands and relay responses to source

## Notes
- Most messages will come from Telegram (primary)
- Discord YodAI channel will be secondary trigger point
- Need Discord channel ID before implementation
