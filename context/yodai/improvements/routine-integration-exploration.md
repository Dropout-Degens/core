# Routine Integration Exploration

**Status:** Open / On Hold  
**Date Created:** 2026-03-05  
**Priority:** Medium  
**Owner:** Dax (research), YodAI (implementation once API available)

## Problem
You have a Discord-native AI (separate from YodAI) that needs to query company data. Currently:
- GitHub holds internal business context (`/core/context` files)
- Routine holds sharable team-facing context + personal operations (all tasks)
- No unified way for the Discord AI to access both data sources
- Routine removed their MCP (Model Context Protocol) and building in-house AI — no export/API available yet

## Use Case
Give your Discord AI ability to:
1. **Query company data** at any time (GitHub context files)
2. **Update content** in GitHub (for persistence)
3. **Access Routine data** (tasks, documents, conversations) alongside GitHub context
4. Provide a **unified context layer** so the AI has both internal (GitHub) and team-facing (Routine) information

## Current Blockers

### Routine Side
- ✗ MCP removed (they're building in-house AI)
- ✗ No API available yet for data export
- ✗ No way to programmatically read/write tasks or documents
- **Status:** Waiting for Routine to release their API or export capabilities

### GitHub Side
- ✓ API available (read/write files, query structure)
- ✓ YodAI can already read/write GitHub context files
- ✓ Could serve as integration point once Routine opens up

## Potential Approaches (Once Routine API Available)

### Option A: Routine API + GitHub Sync
1. Routine releases public API (tasks, documents endpoints)
2. Create bridge that pulls Routine data into GitHub (`context/routine-sync/` directory)
3. Discord AI queries GitHub as single source of truth
4. **Pros:** Single source, leverages existing GitHub integration
5. **Cons:** Adds sync overhead, data duplication

### Option B: Routine API Direct Integration
1. Discord AI queries Routine API directly for tasks/documents
2. Queries GitHub for internal context
3. Merges both in response/prompt
4. **Pros:** Real-time data, no sync needed
5. **Cons:** Two API calls, higher latency, depends on Routine API stability

### Option C: Hybrid (Recommended)
1. Core task/document data queried from Routine API directly
2. Reference pointers stored in GitHub (`context/routine-index.md`)
3. Cached snapshots in GitHub for offline access
4. **Pros:** Real-time data + local fallback, organized cross-reference
5. **Cons:** Slightly more complex, needs cache invalidation logic

## Next Steps

1. **Check in with Routine** on their API roadmap
   - When will API be available?
   - What endpoints (tasks, documents, conversations)?
   - Rate limits? Authentication?
   - Data export/backup available?

2. **Document findings** in this file once you hear back

3. **Design integration** based on Routine's API capabilities

4. **Build integration** once API is stable

## Related Improvements
- Supabase Query Templates Library (similar pattern of cataloging data access)
- Persistent Context Storage (consolidating context from multiple sources)

## Reminder
**Follow up with Routine on:** API timeline, endpoints, and export capabilities. Current blocker is their side — check back regularly.
