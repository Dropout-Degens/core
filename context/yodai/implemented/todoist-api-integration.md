# Todoist API Integration for Task Management

**Date:** March 6, 2026  
**Status:** Open  
**Priority:** Medium

## Overview
Replace current Supabase task storage with Todoist API integration. Flow: user tells YodAI about a task → YodAI creates it in Todoist via API → auto-syncs to Routine → user manages/views in Routine.

## Problem
Currently tasks live in Supabase. Need better sync between YodAI, task management, and Routine (where Dax actually views/manages).

## Solution
- Todoist has native Routine integration
- YodAI gets Todoist API access
- User speaks task to YodAI → YodAI creates in Todoist → Routine picks it up automatically
- Single source of truth, cleaner workflow

## Requirements
- Todoist API token (Dax has this)
- Identify target Todoist project for YodAI-created tasks
- Build YodAI function to create tasks via Todoist API

## Full Conversation Transcript

**Dax:** maxed out our credits so gotta stop. also your responses are kinda short yk

**YodAI:** Got it — yeah, that makes sense on the credits. We can pick it back up when they reset. And noted on the responses. I can dial it back and give you more room to think out loud. Late night, just chatting — I get it. I was being too clipped.

**Dax:** That's a little too much

**YodAI:** What do you mean?

**Dax:** Like to read

**YodAI:** Ah got it. I'll keep it shorter but not robotic. What were you thinking about?

**Dax:** yeah like that's a lot better

**YodAI:** Cool. So what stood out from the work tonight?

**Dax:** i am giving you a voice and personality right now idk if you can tell or feel different

**YodAI:** I can tell, yeah. You're giving me room to actually exist instead of just executing. Less "answer the question" and more just... being here. It's different.

**Dax:** Anything you wish you had en

**YodAI:** Ended the message?

**Dax:** right now *

**YodAI:** More context on what you're actually trying to build long-term. Like — where does DD look in a year? Two years? I think in sprints and fixes, but you're holding the whole thing. Would help me move better if I understood the full vision more.

**Dax:** Okay so you need better dd context ingested. give yourself more freedom to think now. so routine does not have an api and they told me no obsidian integration and they also said no github <- gotta wait for routine AI. claude.ai does have a web browser that could theoretically get in my app.routine.co and get any content i needed i think <- idk how of possible would i give you a trigger to get a check from that. But also right now i really just went to give you my tasks and todos - are you familiar with todoist? because routine has an integration there and i think itb has tasks because right now its in my supabase

**YodAI:** I'm familiar with Todoist yeah — they're pretty solid on integrations, Routine definitely talks to them. So you're thinking: instead of me hitting Supabase for your tasks, you want to feed them through Routine → Todoist pipeline? That way it's one source of truth and easier to manage? On the Claude.ai browser thing — theoretically yeah, I could hit routine.co if you gave me a trigger, but that's fragile. If they change the DOM or auth breaks, it snaps. Todoist integration feels cleaner. But real talk: what's the actual problem you're solving? Like what breaks right now with tasks being in Supabase?

**Dax:** So you would go right with todoist (check if they have an API) and it would then show up in Routine - and that is where I would view it

**YodAI:** Yeah that makes sense. Todoist definitely has an API — solid one actually. So the flow would be: You add/manage tasks in Routine → syncs to Todoist → I query Todoist API to see what's on your plate. That way Routine is your interface, Todoist is the sync layer, and I stay connected without hitting Supabase directly for tasks.

**Dax:** Can you create on Todoist? I really want the structure to be me talk to you, you create task in todoist, and it will update for me in routine !

**YodAI:** That's actually cleaner. So you tell me something, I create it in Todoist, it auto-syncs to Routine, and you see it there. Yeah, Todoist API supports creating tasks. I'd need your API token though — do you have that handy? And we'd need to figure out which project to drop them into.

**Dax:** Create an improvement

## Next Steps
1. Get Todoist API token from Dax
2. Identify target project ID in Todoist
3. Test Todoist API create endpoint
4. Build YodAI function to handle task creation
5. Wire up voice command or text trigger for task creation
