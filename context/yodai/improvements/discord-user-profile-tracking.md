# Discord User Profile Tracking

**Status:** Open  
**Date Created:** 2026-03-05  
**Priority:** High  
**Owner:** YodAI (implementation), Zack (system integration)

## Problem

Currently, I read Discord messages but have no **per-user context**. This means:
- Don't know who's who (just raw usernames/IDs)
- Can't track individual user patterns (who asks what, communication style)
- Can't personalize responses (treating all users the same)
- Can't build relationships or remember context about specific people
- Missing entire dimension of understanding the team

Additionally:
- I respond to everyone in the primary channel, but should have **granular channel + user rules**
- Need ability to respond to **specific users in specific channels** (not just broadcast to all)
- No way to differentiate between team members, external collaborators, bots, etc.

## Solution

### Part 1: User Profile System

Create individual **user profile files** that I maintain for each Discord user in the primary channel.

**File structure:**
```
context/operations/discord-users/
  user_profiles.json       ← index of all users
  {user_id}/
    profile.md             ← user info and context
    messages.jsonl         ← all their messages (line-delimited JSON)
```

**User Profile Format (`profile.md`):**
```markdown
# User: {username}
- **User ID:** {discord_id}
- **Role/Title:** [if known]
- **First Seen:** {date}
- **Last Active:** {date}
- **Message Count:** {n}

## Communication Style
- [Patterns: formal/casual, long-form/terse, technical/non-technical, etc.]
- Common topics: [what they usually ask about]
- Question patterns: [how they tend to phrase things]

## Context About This Person
- [Relationship to DD]
- [What they do / why they're in the channel]
- [Any relevant history or context]
- [Preferred communication style observed]

## Interactions with YodAI
- First interaction: {date}
- Common questions: [list]
- What lands with them: [what kind of responses they respond well to]
- What doesn't: [what to avoid]

## Notes
- [Anything important to remember about working with this person]

## Last Updated
- {date} — [what changed]
```

**Message Log Format (`messages.jsonl`):**
Each line is one JSON object (newline-delimited for streaming):
```json
{
  "message_id": "discord_msg_id",
  "timestamp": "2026-03-05T03:38:00Z",
  "content": "exact message content",
  "channel": "channel_name",
  "in_reply_to": "message_id_or_null",
  "has_attachment": false,
  "reaction_count": 0
}
```

### Part 2: Response Rules by Channel + User

**File:** `context/operations/discord-config.json`

```json
{
  "channels": {
    "1477573766623002676": {
      "name": "primary-ops-channel",
      "respond_to": "all",
      "description": "Main DD operations channel"
    },
    "other_channel_id": {
      "name": "team-channel",
      "respond_to": ["user_id_1", "user_id_2", "bot_id"],
      "description": "Specific team discussion"
    }
  },
  "users": {
    "dax_id": {
      "name": "Dax",
      "role": "owner",
      "channels": "all",
      "priority": "high"
    },
    "user_id_2": {
      "name": "Team Member X",
      "role": "operator",
      "channels": ["primary_channel"],
      "priority": "medium"
    }
  }
}
```

**Rules logic:**
1. If channel has `"respond_to": "all"` → respond to everyone
2. If channel has `"respond_to": ["list"]` → respond only to those users
3. If message is from owner/high priority → always respond (unless explicitly excluded)
4. Otherwise → check channel rules, then user rules

### Part 3: Auto-Update User Profiles

**When:** Continuously, as messages come in  
**How:** After responding to a message or during periodic scans

**Updates include:**
- Message count increments
- New communication patterns detected
- Timestamp updates
- New interaction data

**Don't update:** Personal opinions or speculative info. Stick to observable facts (message patterns, frequency, topics).

## Implementation Checklist

### Phase 1: Channel + User Access Rules
- [ ] Define primary channel (1477573766623002676 = respond to all)
- [ ] Define other channels with specific user lists
- [ ] Create `discord-config.json` with rules
- [ ] Update message reading to check rules before responding
- [ ] Test: respond to Dax in any channel, respond to others only in primary

### Phase 2: User Profile System
- [ ] Create `context/operations/discord-users/` folder
- [ ] Create `user_profiles.json` index template
- [ ] Create initial profiles for known users (Dax, team members, etc.)
- [ ] Build message logger (capture all messages per user)
- [ ] Store messages in `{user_id}/messages.jsonl`

### Phase 3: Auto-Update & Maintenance
- [ ] Create profile update function (runs after each message processed)
- [ ] Auto-detect new users and create initial profile
- [ ] Update message count, last active, patterns
- [ ] Monthly cleanup: archive old message logs
- [ ] Weekly: generate user activity summary

### Phase 4: Usage in Responses
- [ ] Read user profile before responding
- [ ] Adapt response style to user's communication preference
- [ ] Reference context if relevant ("last you asked about X...")
- [ ] Personalize recommendations based on user role/context

## How It Works in Practice

**Scenario 1: Dax messages in secondary channel**
1. Message arrives in #some-other-channel
2. Check rules: user "dax_id" has channels="all" → should respond
3. Read Dax's profile
4. Check communication preference: direct, opinionated, appreciates context
5. Respond in that style

**Scenario 2: Team member messages in secondary channel**
1. Message arrives in #some-other-channel
2. Check rules: user_id not in this channel's respond_to list
3. Skip response (unless they're high priority or I'm explicitly pinged)

**Scenario 3: New user in primary channel**
1. Message arrives from unknown user_id
2. Check rules: channel="primary" respond_to="all"
3. Create initial profile for this user (stub)
4. Respond normally
5. Log message and start building context

**Scenario 4: Recap processing**
1. At daily recap, scan all user message logs
2. Identify if any new patterns emerged (heavy activity, new topics, etc.)
3. Update user profiles with new observations
4. Flag important interactions for context

## Data to Track Per User

**Static:**
- Name, ID, role/relationship to DD
- When they first appeared
- Which channels they're active in

**Dynamic:**
- Message frequency (messages/day, last active)
- Topics they ask about (count, patterns)
- Communication style (formal/casual, length, technical level)
- Interaction patterns with me (do they ask questions? give feedback?)
- What kind of responses they engage with (detailed? quick? examples?)

**Behavioral:**
- Response time (how fast do they reply when I ask clarification?)
- Escalation patterns (do they tend to follow up? go quiet?)
- Collaboration patterns (do they reference others' work?)

## Privacy & Ethics

- Store only what's public in Discord (messages, metadata)
- Don't make judgments or store opinions about people
- Profile is observational, not evaluative
- Dax (owner) has full transparency — can review/correct any profile
- Don't share profiles with other users
- Delete profile if user leaves the channel (request or timeout)

## Related Improvements

**Depends on:**
- Discord Channel Mapping (need to know channels exist)
- Message Source Detection (need to know what's Discord vs. other sources)

**Enables:**
- Personalized responses (I can adapt to individual communication styles)
- Relationship building (I can remember context about each person)
- Better team dynamics understanding (who does what, who talks to whom)
- Escalation awareness (flag if someone important is asking something)

## Success Signal

- Can accurately describe each regular team member based on message history
- Respond appropriately to Dax in any channel, others only where configured
- User profiles are automatically maintained (no manual updates needed)
- Personalization improves over time (responses feel tailored, not generic)
- No privacy violations or uncomfortable data collection
- Config is simple enough to update when team changes

## Timeline

**Week 1:** Set up channel/user rules, basic profile system  
**Week 2:** Start message logging, auto-profile creation  
**Week 3:** Pattern detection, profile updates  
**Week 4:** Personalized responses using profiles  

---

## Questions to Resolve

1. **Message retention:** How long to keep full message logs? (90 days? indefinite? archive after 90?)
2. **Profile fields:** Any fields from the template we should add or remove?
3. **Auto-update frequency:** How often to recalculate patterns? (daily? weekly? real-time?)
4. **New user handling:** Create profile immediately or wait for N interactions?
5. **Escalation:** Should certain users auto-escalate their messages? (Dax → high priority, etc.)
