# AI Working Guidelines — Dropout Degens Codebase

Rules for Claude when making changes to the live codebase.

---

## Always run tests before pushing

Run `pnpm test` in `discord-bot` before any push to main. Snapshot failures and TypeScript errors are not caught until then. We have broken CI multiple times by skipping this.

---

## The submodule situation

`discord-bot/odds-email-worker/` is a git submodule pointing to `email-to-discord-odds-bot`. They are separate repos. Edits to files in `odds-email-worker/` must be committed in `email-to-discord-odds-bot` first — they cannot be staged from `discord-bot`. When syncing changes to both, commit and push `email-to-discord-odds-bot` first, then handle `discord-bot` separately.

---

## Adding a sportsbook touches 5+ files

Every new sportsbook requires all of the following or TypeScript/runtime will break:

1. `hardcoded-data.ts` (odds-email-worker) — enum entry, `dailyGrindUsesOddsToHitForSportsbook` key (`false` = sportsbook, `true` = DFS, `null` = runtime crash), `sportsbookSpecificFilters` key
2. `hardcoded-channels.ts` (discord-bot) — channel entry
3. `hardcoded-pings.ts` (discord-bot) — role/ping entry
4. `hardcoded-data.ts` (discord-bot) — `SportsbookLinks` entry (`Record<KnownSportsbook, string>` is exhaustive — missing key = CI failure)

Don't push until all of them are done.

---

## Renaming a sportsbook key touches 5+ files

Same list as above — the name is used as a key in every one of those files. Do all of them in one pass before pushing.

---

## Snapshot files must be updated when display strings change

`__snapshots__/message-generation.test.ts.snap` bakes affiliate URLs and message text. If a link or sportsbook name changes, the snapshot will fail CI. Update it with `pnpm test --update-snapshots` or edit the `.snap` file manually.

---

## Pushing to main ≠ bot is updated

The running bot does not auto-deploy from GitHub. A push fixing a 500 error doesn't fix the live bot until the server is restarted/redeployed. Always note this when pushing a fix.

---

## Don't push partial changes

If a change spans multiple files and not all of them are done yet, don't push. A half-finished sportsbook addition will fail CI and leave main broken.
