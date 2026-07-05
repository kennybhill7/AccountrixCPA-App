# Deep Re-Audit — 2026-07-05 (Fable, autonomous)

A four-agent parallel audit (store/persistence, grading/readiness math, content
integrity, routing/hydration/UX) plus an independent API-route review. Findings
triaged and either fixed this session or deliberately deferred with a reason.

## Fixed

**Security**
- **Path traversal (HIGH once deployed)** — the AI persistence routes built file
  paths from unsanitized `body.userId` / URL `[id]` / `[sessionId]` / `?sessionId`.
  Added `lib/safeId` (charset + `..`/leading-dot/length checks); every route now
  rejects invalid ids, and the assist POST sanitizes its write path. Files:
  `app/api/ai/{intake,plan,assist}/route.ts`, `assist/[sessionId]`,
  `custom-lessons/[id]`. Commit `42a0747`.

**Correctness**
- **ApplyWorkflowClient hydration mismatch** — prior attempt was loaded in a
  `useState` initializer that read `localStorage` during render; moved to a mount
  `useEffect`.
- **JE grader blank-entry bonus** — an all-zero entry was trivially "balanced"
  (0=0) and earned the balance point; now requires a real posted amount.
- **Narrative grader clause-boundary negation** — a negator no longer leaks
  across a `.`/`;`/`,` boundary to falsely negate a blocker/support phrase.
- **Conclusion support negation** (from the prior audit's low finding) — `anyOf`
  support now routes through the unnegated-phrase check, symmetric with blockers;
  negator set hardened for contractions and two-word negators. Commit `a96e897`.
- **/plan crash guard** — `g[i.urgency]?.push` so an unexpected urgency value from
  the API can't crash the page.
- **FlashcardDeck empty-deck** — graceful empty state instead of reading
  `cards[0].track` (TypeError).
- **BAR capital-budgeting sim $1 rounding** — 829,098.48 rounds down to 829,098
  (NPV 29,098), matching the stated rule. Commits `f421922`.

- **gradeCalc multi-key guard** — a multi-key task no longer reuses one bare
  scalar against every field (could pass a half-answered task). Commit `f3e7fe1`.
- **Streak now day-based** — `streak` was written by both the calendar-day
  `updateStreak` and `completeQuiz` (per-quiz +1, reset to 0 on a failed quiz),
  so the "🔥 N" UI and the "7-day streak" achievement didn't mean consecutive
  days. `completeQuiz` now advances the day-based streak; a failed quiz no longer
  nukes it and same-day quizzes don't double-count. Commit `37817b1`.

**Durability** — a guard test fails CI if a persisted store is missing from the
`/state` backup allowlist (data-loss guard). Commit `9eff55b`.

**Polish** — dynamic footer year, removed a debug `console.log`, aria-labels on
the notes delete, quiz flag, search clear, and badge dismiss buttons. Commits
`f36f2d3`, `f3e7fe1`.

## Content audit verdict (clean)

The item bank (2,081 MCQs) and all 11 TBS + 4 essays were independently
recomputed: no duplicate ids, no unrendered `${...}`/`NaN`/`undefined` leaks, no
exact-duplicate choices, answer index always in range, answer-letter
distribution balanced (no section's letter > 45%; BAR highest at 32%). The 143
NCI and 150 revenue-allocation parametric families all recompute correctly.
§1031 items honor the 2026 real-property-only rule. The $1 BAR rounding above was
the only content fix.

## Deferred (documented, not changed)

- ~~**Streak semantics**~~ — RESOLVED (commit `37817b1`, now day-based).
- **`dayNumber` uses UTC (store/grading audits, LOW)** — SRS "due today" and
  readiness day boundaries flip at 00:00 UTC, not local midnight. Intentional for
  deterministic, injectable tests; shifts intervals by up to a day depending on
  time-of-day. Changing it would break test determinism; left as-is.
- **SRS re-miss due date (store audit)** — a repeat miss reschedules to tomorrow
  (SM-2 relearn, interval 1) while a first miss is due today. Attempted a "due
  today" change; it broke an existing test that deliberately encodes interval 1
  and created a `dueDay ≠ nowDay + interval` inconsistency, so it was reverted.
  Defensible as-is.
- **`srStrength` downward bias (grading audit, MED)** — the retention component
  only pulls readiness down (the SRS queue holds only previously-missed items) and
  is dropped for never-missed skills. This is a modeling choice ("previously-missed
  material is riskier"), not a crash; documented for a future readiness-model pass.
- **`skipHydration` not set on persist stores (routing audit, HIGH-systemic)** —
  stores auto-rehydrate while `useHydratedStore` also calls `rehydrate()`; works
  today because unguarded reads sit behind loading states. A broad change with
  regression risk; deferred for a dedicated hydration-hardening pass.
- **Remaining a11y labels** — icon-only buttons in `TrialBalanceWorksheet`,
  `AIAFormBuilder`, `QuizEngine`, `SearchDialog`, `BadgeUnlockedNotification` still
  need `aria-label`s (did the highest-traffic one, notes delete).
- **Footer `href="#"` stub links** — Help/Contact/Privacy/Terms need real targets
  before market launch.
