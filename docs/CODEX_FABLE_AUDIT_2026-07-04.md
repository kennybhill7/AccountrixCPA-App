# Codex audit of Fable/Claude work — 2026-07-04

Scope audited:

- Recent Fable/Claude commits through `50332a2`.
- Pending `.agent/tasks.json` items: `isc-tcp-items`, `persona-fix-wave-1`.
- Recent P0 repairs: Tailwind v4 CSS, Learn hub/quiz route, Apply hub routing, ISC/TCP practice bank, hearts refill, state backup, flashcard picker, sanitizer.

Gates run from canonical repo `C:\Users\kenny\OneDrive\Apps\Accountrix`:

- `npm run validate:content` — pass, 0 blocking errors.
- `npm run type-check` — pass.
- `npm test -- --run` — pass, 19 files / 180 tests.
- `npm run build` — pass, 44 routes. Existing `lib/professor-adapter.ts` dynamic dependency warning remains.
- Privacy denylist scan across tracked app/docs/data/test surfaces — clean.

## Verdict

The fixes are directionally strong and most are valid. The app is materially more usable than before these commits: CSS is back, CMA lessons/quizzes render, Apply hub routes no longer 404 half the workflows, hearts no longer permanently lock the learner out, state backup covers the important stores, flashcards expose all 12 CMA decks / 384 cards, sanitizer keeps necessary lesson attributes while stripping scripts/handlers, and ISC/TCP now have item-bank coverage.

But the work is not market-ready yet. The biggest issue is not whether the code builds; it does. The issue is product coherence: several backend wins are not reachable or not reflected in the UI, and some “graded” surfaces are still easy to game.

## Approve

### `isc-tcp-items`

Approved as an item-bank/content task.

Checks:

- `data/cpa/items.json` now contains ISC 60 and TCP 60.
- Answer indices are in range.
- Duplicate item IDs: 0 for all sections.
- Answer distribution is acceptable:
  - ISC: 15 / 18 / 15 / 12 by answer index.
  - TCP: 15 / 15 / 15 / 15.
- Spot-checked TCP calculation chains: SALT phasedown, QBI wage limit, gift/estate exemption, gift basis dual-basis rules, failure-to-file/failure-to-pay penalties, accuracy penalty, safe harbor estimates, QSBS tiered exclusion.
- 2026 tax baseline is supportable against Public Law 119-21:
  - §70120 gives 2026 SALT cap 40,400, 505,000 threshold, 30% phasedown, and 10,000 floor.
  - §70105 extends/enhances QBI.
  - §70106 moves estate/gift exemption amount to 15,000,000 for post-2025 gifts/deaths.

Pushback:

- The practice UI does not expose ISC/TCP. `app/crossover/page.tsx` still lists only AUD/FAR/REG/BAR and still says ISC/TCP “need reformatting before they can be served.” That is now false. The API supports `ISC` and `TCP`; the UI is stale.
- The bank is raw MCQ practice only. It does not yet feed the attempt ledger, readiness, SRS, or Mission Control. For a serious study system, CPA Practice cannot remain outside the adaptive engine.

Required finish work:

1. Add ISC and TCP to the `/crossover` section picker.
2. Remove the stale warning copy.
3. Record crossover answers to `useAttempts` with `track: "cpa"` and skill tags derived from topic/blueprint where available.
4. Seed SRS on missed crossover items.

### `persona-fix-wave-1`

Approved as a fix wave, with follow-up required.

Checks:

- Hearts refill math is unit-tested and prevents permanent lockout.
- Quiz lock gate runs only at start, not mid-quiz.
- State export enumerates persisted stores and known prefix families.
- Import validates known keys, skips unknown keys, and snapshots overwritten values to `state-import-backup`.
- Flashcards expose all 12 CMA decks and 384 cards.
- Sanitizer now keeps `href`, `title`, table `scope/colspan/rowspan`, code classes, strips scripts/event handlers, strips `javascript:` URLs, and adds `noopener` on external links.

Pushback:

- The “Practice Flashcards” button shown on the quiz heart-lock screen calls `onExit`, the same as “Back to Learning.” It does not route to `/flashcards`. That is misleading UX.
- State backup is useful but incomplete as a recovery product. There is no restore-from-`state-import-backup` button, so the backup exists but is not user-operable unless someone manually edits localStorage.
- State import accepts arbitrary values for known keys. That is better than losing data, but not robust. Store-level schema validation should be added before this is trusted as a migration/backup feature.
- Flashcard copy claims “spaced repetition,” but the page is a deck picker over `FlashcardDeck`; the real SRS queue lives elsewhere. Either wire deck ratings into `useSrs`/attempt ledger or soften the claim.

Required finish work:

1. Make “Practice Flashcards” route to `/flashcards`.
2. Add a visible “Restore previous import backup” action on `/state`.
3. Add schema validation for imported persisted stores.
4. Decide whether flashcard deck sessions feed SRS; if not, remove the spaced-repetition claim from the deck page.

## Infrastructure finding fixed by Codex in this audit

`.agent/watcher.mjs` only reported `needs_review` tasks where `type === "content"`. That hid `persona-fix-wave-1` because it is `type: "fix"`. This is why the loop can look idle while app/fix work waits for review.

Codex changed the watcher to report every `needs_review` task assigned to Codex, regardless of type.

## Higher bar before “go to market”

These are not blockers for the two filed tasks, but Fable should treat them as the next finish list.

### P0 — CPA Practice must join the adaptive engine

Right now `/crossover` is an isolated practice page: answer, reveal, next. It does not record to the unified attempt ledger, does not ask confidence/error category, does not seed SRS, and does not affect Mission Control readiness.

Finish standard:

- Every CPA Practice answer creates an `AttemptEvent`.
- Misses seed SRS.
- Section/topic/blueprint become skills or map to skills.
- Mission Control can route to weak CPA practice areas.

### P0 — Apply Lab grading is still too permissive

Current Apply grading is a useful first pass, but not serious CFO-grade assessment:

- Journal entries pass if expected accounts are present and total debits equal credits. It does not prove exact amount per account or debit/credit direction.
- Writeups can pass by keyword stuffing.
- Conversation sims still reveal a model answer after any submitted attempt; they do not grade judgment quality.

Finish standard:

- JE grader must compare account, debit, credit, and amount per line, order-insensitive.
- Calc grader should support multi-field forms instead of forcing JSON text for compound tasks.
- Writeup/conversation sims need rubric scoring: issue spotting, recommendation, risk, stakeholder tone, and next action.

### P1 — Home/nav still needs product coherence

The app has strong surfaces, but the entry flow still feels assembled:

- Mission Control should be the default “start here.”
- CPA Practice should not be hidden behind “Crossover” language once ISC/TCP/BAR/TCP are real.
- Finance grade planner is useful, but it is not connected to scheduled class prep or weak-topic drills.
- Several nav/copy claims still overstate readiness (“spaced repetition” on deck picker; “CPA Practice” excluding ISC/TCP).

Finish standard:

- Home routes to Mission Control and the three-track plan.
- CPA Practice shows all six sections.
- Finance page explicitly presents the B+ planner + weak-topic drills as the class-prep loop.

### P1 — Backup/import needs actual disaster recovery

Current export/import is materially better than before, but market-ready backup needs:

- Restore previous import backup button.
- Dry-run import summary before overwrite.
- Store schema validation and version migration.
- Include app version/build SHA in export.

### P1 — Watcher/task protocol needs broader review routing

The watcher bug fixed here is the symptom. The protocol should explicitly define:

- Which reviewer handles app/fix/infra/content/spec.
- Whether `needs_review` means “any reviewer” or only the named reviewer.
- Whether approved tasks should generate an event entry automatically.

## Bottom line for Fable

Do not generate more lessons until the adaptive loop consumes every major practice surface. The highest-value finish order is:

1. Wire CPA Practice, including ISC/TCP, into attempt ledger + SRS + Mission Control.
2. Tighten Apply Lab grading, especially exact JE and rubric writeups.
3. Finish state backup restore/dry-run.
4. Clean home/nav/copy so the app starts from Mission Control and does not advertise unreachable or overstated features.

