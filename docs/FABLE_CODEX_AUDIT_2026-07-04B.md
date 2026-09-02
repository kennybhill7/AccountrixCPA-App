# Fable Audit — Codex Final-Build Wave (2026-07-04, second audit of the day)

Reviewer: Fable/Claude. Owner of all audited work: Codex.
Scope: the 8 `needs_review` tasks filed after the 100-user market-readiness audit, covering commits `3510208`, `bf345bd`, `963336a`, `989eafd`, `f62b5c9`, `0cb08b5`, `49bcd3e`.

## Gates (all green)

| Gate | Result |
|---|---|
| `npm run validate:content` | 136 passed, 0 blocking |
| `npm run type-check` | 0 errors (first run raced the concurrent build's `.next` regen; clean re-run) |
| `npx vitest run` | **195/195** (180 pre-existing + 15 new apply-grading tests) |
| `npm run build` | full route table, exit 0 |
| Privacy grep (denylist terms over all 19 changed files) | clean |

## Verdicts

All 8 tasks **APPROVED** — three with reviewer fixes applied during audit.

### P0s

**crossover-isc-tcp-adaptive-p0 — APPROVED.**
/crossover exposes FAR/AUD/REG/BAR/ISC/TCP; item counts verified against `data/cpa/items.json` (162/498/166/232/60/60 = 1,178, matching the page copy exactly). Every answer records an AttemptEvent (`track=cpa`); misses seed SRS with a route back. Findings: generated skill ids (`cpa-<section-topic>`) sit outside the frozen SKILL_TAXONOMY, so readiness aggregates them but `/api/skills/map` can't resolve Study-this links, and skills fragment per topic string. The 1,178 count is hardcoded and will drift.

**apply-lab-grading-rubric-p0 — APPROVED after reviewer fixes.**
Verified: JE grading is exact per-line (account + debit/credit direction + amount, order-insensitive, no double-count via used-line set); compound calcs render per-field inputs; JE tasks render an account/debit/credit table; writeups and conversation sims score on a deterministic 4-dimension rubric (coverage/depth/support/judgment, pass ≥ 3/4); conversation responses record attempts and seed SRS.
- **Reviewer fix (real bug):** user-entered JE amounts were parsed with `Number()`, so a correct entry typed as `148,216` or `$148,216` graded **wrong** (`NaN`). Calc tasks already used the comma-tolerant `parseNumber()`. Fixed with `toAmount()` in `gradeJournalEntry`.
- **Reviewer fix (acceptance gap):** `tests/unit/apply-grading.test.ts` was in the task's file list but did not exist — the entire grading engine shipped untested. Authored 15 tests (JE exact/flipped-direction/wrong-amount/wrong-account/tolerance/double-count guard; calc single+multi-key with `$`/comma input; rubric pass vs keyword-stuffing fail; empty-answer routing). The comma test fails without the fix above.
- **Accepted limits:** the rubric is heuristic — keywords plus boilerplate judgment words can still pass; and the unified AttemptEvent stores pass/fail + answer, not the rubric dimension breakdown (that lives only in `apply-attempt-ledger` result messages).

**first-run-weekly-plan-p0 — APPROVED as v1.**
Onboarding captures the four goals (Finance B+, CMA 12–18 mo, CPA after CMA, controller/CFO execution) plus hours/week, saved to `ai-intake` (which is in the /state backup allowlist). Mission Control renders a 7-day plan card with per-day links; empty state routes to /onboarding, not a catalog. Finding: the plan is a goal-flavored **static template** — it does not yet consume readiness, SRS load, or exam dates, and onboarding has no explicit Finance exam-date/target-grade field. The adaptive weekly planner is the follow-up, not a blocker.

**notes-system-final-build-p0 — APPROVED after reviewer fix.**
Global SmartNotes button mounted in the root layout; Notes in Header + mobile nav; LessonNotes embedded on CMA, CPA, and Finance lesson pages; /notes merges `lesson-notes` + `smart-notes`, searches, and links back to the source; both keys covered by backup.
- **Reviewer fix (real bug):** `noteHref` checked `startsWith("fin-")` but finance unit ids are `finance-u1..u3`, so every finance lesson note's "Open source" button deep-linked to a broken `/cpa/finance-u1/...` route. Fixed to `finance-`.
- Remaining product gaps (out of scope, still open from the notes vision): tags, note→flashcard, note→AskAI, highlight-to-note.

### P1s

**state-backup-restore-p1 — APPROVED with findings.** Restore-from-`state-import-backup` works (including removing keys absent pre-import); dry-run defaults ON. Gaps vs acceptance: validation is key-allowlist only — a malformed **value** for a known key imports verbatim; export metadata lacks the app version/build SHA.

**product-entry-coherence-p1 — APPROVED.** Home → Mission Control; six-section copy; flashcard copy no longer overclaims; nav labels match shipped features.

**cpa-lessons-dashboard-p1 — APPROVED.** /cpa groups all 19 units by section with per-section completion % from `useCpaProgress`, Done markers, and accurate totals; track registry marks CMA Part 2 live and both CPA tracks as all six sections.

**flashcards-srs-integration-p1 — APPROVED after reviewer fix.** Ratings record AttemptEvents; Again/Hard seed SRS; Good/Easy call `reviewItem` (quality 4/5). Reviewer fix: the same `fin-` prefix bug in track detection — dead code today (the only mount passes no `monthId` and correctly defaults to `cma`) but wrong the moment the deck mounts on a finance lesson; corrected. Accepted limit: flashcard events carry `skills: []`, so they feed track totals but not per-skill readiness.

## Pattern worth naming

Two of the three real bugs this wave were the **same bug**: code guessing the finance unit-id prefix as `fin-` when the builder script emits `finance-u1`. There is no shared helper for "which track does this content id belong to." Recommend a `trackForContentId(id)` util in `lib/` with a unit test, and migrating the three call sites (notes, FlashcardDeck, and any future one) onto it before a fourth copy appears.

## What should come next (Fable's priority call)

1. **Mistake Bank** — miss-reason classification exists in the ledger (confidence + error category) but there is still no single "review all my misses across CMA/CPA/Finance/Apply" surface beyond the SRS card.
2. **Adaptive weekly plan v2** — feed readiness + SRS due-load + exam dates into the Mission plan card so days reorder themselves.
3. **Crossover skill mapping** — map CPA Practice items onto frozen-taxonomy skills (even a coarse section→skill table) so Study-this links resolve.
4. **Timed exam mode** — still the largest unbuilt item from the market-readiness audit.
5. Store-shape validation on /state import + build SHA in the export header.
