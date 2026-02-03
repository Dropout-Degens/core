# Testing Amlan — Final Thoughts

**Status:** Offboarded
**Duration:** October 31, 2025 → December 28, 2025 (~2 months)
**Outcome:** Did not work out

---

## What Happened

Amlan was onboarded as a part-time developer in late October 2025. He was a Syracuse student brought on to handle small, well-scoped tasks within the existing Discord bot infrastructure.

### Onboarding (Oct-Nov 2025)
- Oct 31: Initial onboarding meeting with Dax — explained business model, role expectations, project structure
- Nov 8: Technical setup session with Zack and Dax — got access to all systems (Cloudflare, GitHub, Stripe, Supabase, Google Cloud, Notion, Claude)
- Ran out of time for hands-on coding demo during setup session

### Work Period
- Assigned small tasks within the existing bot structure
- Given access to Claude Pro subscription (company paid) for AI assistance

### Offboarding (Dec 28, 2025)
During the December 28 dev sync, Zack and Dax reviewed Amlan's code contributions and decided to offboard him.

---

## Why It Didn't Work

### Code Quality Issues
- **Didn't use existing data structures:** Created new patterns instead of following established codebase conventions
- **Branch management problems:** Created branches incorrectly
- **Tutorial-like code:** AI-generated code had console logs everywhere, no proper error handling
- **Didn't match existing architecture:** Despite explicit guidance to follow the existing codebase style

### Process Issues
- Code review revealed fundamental misunderstanding of the codebase
- Changes required significant rework rather than minor adjustments
- Time spent reviewing and fixing exceeded time saved by having help

---

## Offboarding Actions Taken

- [x] Email access revoked
- [x] Email rerouted to Dax
- [x] GitHub access removed
- [x] (Implied) Other system access revoked

---

## Lessons Learned

### For Future Developer Hires

1. **Hands-on demo first:** The Nov 8 session ran out of time before the planned hands-on demo (partner promo bot emoji updates). Should have prioritized this over additional system access setup.

2. **Smaller first task:** Even "small" tasks may be too big for initial evaluation. Need a trivial task to verify basic competence before assigning real work.

3. **Code style enforcement:** Explicitly telling someone to follow existing patterns isn't enough. Need to:
   - Show specific examples of good vs bad code in the codebase
   - Review first commit before allowing more work
   - Check that AI tools (Claude) are properly configured with codebase context

4. **In-person vs remote:** The in-person meetings worked well for relationship building but the actual coding work was done remotely without supervision.

### AI-Assisted Development Concerns

From the Dec 28 sync notes:
> "AI-generated code tends to be 'tutorial-like' (console logs, no error handling)"

When hiring developers who will use AI assistance:
- Verify they understand the codebase themselves, not just their AI
- Check that AI outputs are being properly reviewed and adapted
- Consider requiring Claude.md or similar context files before they start coding

---

## Related Documentation

- `2025-10-31/` — Initial onboarding meeting (business context, role expectations, checklist)
- `2025-11-08/` — Technical setup session (access setup, git workflow, project workflow)
- `../syncs/2025-12-28/summary.md` — Meeting where offboarding was decided
