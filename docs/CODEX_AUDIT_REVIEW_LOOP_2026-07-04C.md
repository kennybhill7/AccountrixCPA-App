# Codex Audit — Fable/Claude Review-Loop Build

Date: 2026-07-04  
Reviewer: Codex  
Scope: local commits `a481a2d` and `b79b528`, plus the task-board state after the final-build wave.

## Verdict

Approved.

Fable/Claude correctly audited the Codex final-build wave, fixed real issues, and then added the next review-loop layer:

- Mistake Bank across CMA/CPA/Finance/Apply.
- CPA Practice timed sets.
- CPA Practice skill mapping to frozen taxonomy IDs.
- `trackForContentId` / `lessonHrefForContentId` helper.
- State import value validation and export metadata.

No blocking findings found.

## Gates

| Gate | Result |
|---|---|
| `npm.cmd run type-check` | Pass |
| `npm.cmd test -- --run` | Pass — 22 files, 213 tests |
| `npm.cmd run build` | Pass — 45/45 routes |
| `git diff --check HEAD~2..HEAD` | Pass |

Build warnings remain pre-existing/non-blocking:

- `lib/professor-adapter.ts` dynamic dependency warning.
- stale Browserslist database.
- Tailwind config reparsed as ESM because `package.json` lacks `"type": "module"`.

## Audit notes

### `mistake-bank-p0` — Approved

`app/mistakes/page.tsx` folds the attempt ledger into per-item miss rows, tracks miss count, last miss date, resolved state, SRS queue presence, due status, track filter, error-category filter, and source routing.

A mistake clears only when a later correct attempt exists for the same `itemId`, which is the right behavior.

### `timed-exam-mode-p0` — Approved

`app/crossover/page.tsx` now supports Practice and Timed modes. Timed mode:

- uses a 90-second-per-question budget;
- suppresses feedback until the set ends;
- records every answer to the attempt ledger;
- seeds SRS for wrong/unanswered questions;
- renders an end-of-set review.

### `crossover-taxonomy-skills-p1` — Approved

`lib/cpaSkillMap.ts` maps CPA Practice sections/topics to frozen taxonomy IDs instead of generating ad-hoc `cpa-*` topic strings. Unit coverage is present in `tests/unit/cpaSkillMap.test.ts`.

I checked emitted skill IDs against `docs/SKILL_TAXONOMY.md`; the only non-taxonomy hit was a comment example of the old generated format, not a returned skill.

### `track-id-helper-p2` — Approved

`lib/trackForContentId.ts` centralizes route/track detection for CMA (`mN`), CPA (`far-u1`, etc.), and Finance (`finance-uN`). This resolves the repeated `fin-` vs `finance-` bug class.

### `state-import-validation-p1b` — Approved

`app/state/page.tsx` now rejects malformed values for known persisted stores rather than only allowlisting keys, and exports `appVersion` plus `buildSha`.

The validators are intentionally coarse but sufficient for the current local-first backup system: Zustand stores must look like persisted Zustand envelopes, note/apply ledgers must be arrays, and intake/settings-like stores must be the expected primitive/object shapes.

### Prior final-build tasks — Approved by Fable/Claude

`docs/FABLE_CODEX_AUDIT_2026-07-04B.md` approved the prior Codex final-build wave and fixed:

- JE comma/currency parsing in Apply grading.
- Finance lesson-note routing.
- Finance flashcard track detection.
- Apply grading test coverage.

The current gates confirm those fixes are still green.

## Non-blocking follow-ups

These should not block use, but they are the next quality bar:

1. Adaptive weekly plan v2: reorder the weekly plan based on SRS load, exam dates, and readiness.
2. Flashcard skill tagging: flashcard attempts still use `skills: []`, so they affect track practice but not per-skill readiness.
3. Replace mojibake in older docs/UI over time where visible. Current targeted market-facing scans were clean for the stale claims we were fixing.
