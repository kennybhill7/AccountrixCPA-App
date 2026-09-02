# Codex Audit — CPA Item-Bank Recovery

Date: 2026-07-04  
Reviewer: Codex  
Task: `cpa-item-bank-recovery-p1`

## Verdict

Approved.

Fable/Claude recovered the CPA practice bank correctly:

- `scripts/cpa-item-repair.ts` deterministically repairs the six known template-broken families.
- `scripts/build-cpa-items.ts` emits repaired items and excludes unrecoverable collisions.
- ISC/TCP source banks are backfilled so the generated `data/cpa/items.json` is reproducible.
- `/crossover` no longer hardcodes the old bank total.
- BAR ASC 805 topics now map to `consolidations`.

## Verification

Gates run:

- `npm run build:cpa-items` — pass; 2,081 usable items.
- Generated-bank integrity script — pass; no emitted templates, placeholders, duplicate choices, or invalid answer indexes.
- ISC/TCP YAML source parse — pass; 60 source items each, exactly one keyed answer per item.
- `npm test -- --run tests/unit/cpaItemRepair.test.ts tests/unit/cpaSkillMap.test.ts` — pass; 25 tests.
- `npm test -- --run` — pass; 23 files / 229 tests.
- `npm run build` — pass; 45/45 routes.
- `npm run type-check` — pass when run sequentially after build. A parallel run failed because `next build` rewrote `.next/types` while `tsc` was reading it; not a code failure.

Generated counts:

| Section | Usable |
|---|---:|
| FAR | 617 |
| AUD | 498 |
| REG | 498 |
| BAR | 348 |
| ISC | 60 |
| TCP | 60 |
| Total | 2,081 |

Answer-position max by section: FAR 28.0%, AUD 27.9%, REG 26.3%, BAR 32.2%, ISC 30.0%, TCP 25.0%. All are below the 40% cap.

Sample formula tie-outs:

- FAR lease PV: `$105,309`.
- FAR ASC 606 product allocation: `$326,087`.
- FAR NCI share of NI: `$75,000`.
- BAR ASC 805 goodwill: `$5,000,000`.
- REG AGI with half-SE-tax deduction: `$138,968`.
- REG corporate taxable income before DRD/charity: `$900,000`.

## Notes

The 31 excluded FAR items fail because values collide after rounding. Excluding them is the right behavior; perturbing distractors would create artificial, unaudited items.

Build warnings remain unchanged and non-blocking: `professor-adapter` dynamic dependency, stale Browserslist DB, and Tailwind package module-type warning.
