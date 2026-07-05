# Codex Audit — Exam Sims P0

Task: `exam-sims-p0`  
Commits audited: `7909032`, plus current `HEAD` integration context  
Verdict: APPROVED

## Scope audited

- CPA TBS hub/routes/player:
  - `app/sims/page.tsx`
  - `app/sims/tbs/[simId]/page.tsx`
  - `components/TbsPlayer.tsx`
  - `lib/sims-content.ts`
- CMA essay hub/routes/player:
  - `app/sims/essay/[essayId]/page.tsx`
  - `components/EssayPlayer.tsx`
- Seed simulations:
  - `data/tbs/far-leases-842.json`
  - `data/tbs/aud-ar-sampling.json`
  - `data/tbs/reg-scorp-basis.json`
  - `data/essays/cma-p1-variance.json`
  - `data/essays/cma-p2-capital-budgeting.json`
- Shared grading surface:
  - `components/ApplyWorkflowClient.tsx`
  - `tests/unit/sims-content.test.ts`

## Accounting verification

- FAR lease TBS ties out. PV of five annual payments at 6% is `252,742`; ROU asset is `257,742` after initial direct costs; year-one interest is `15,165`; principal reduction is `44,835`; ending liability is `207,907`; straight-line finance-lease amortization is `51,548`.
- AUD sampling TBS ties out. Ratio projection is `72,000`; difference projection is `90,000`; both remain below the `100,000` tolerable misstatement threshold, with the right caution that the difference method leaves only a narrow cushion.
- REG S corporation basis TBS ties out under the default ordering. Income raises stock basis to `45,000`; distribution reduces it to `15,000` with no gain; nondeductible expense reduces it to `14,000`; `8,000` Section 179 leaves ending stock basis of `6,000`; debt basis remains `10,000`.
- CMA variance essay math ties out. DM price variance is `4,620 F`; usage variance is `5,500 U`; net direct-material variance is `880 U`.
- CMA capital-budgeting essay math ties out. PV is `568,619`; NPV is `68,619`; simple payback is `3.33` years; break-even annuity inflow is about `131,900`.

## Product/engineering verification

- TBS and essay answers are not revealed before submission.
- Countdown expiry auto-submits current answers.
- Per-requirement attempts are recorded with track/source/time fields and failed requirements seed SRS with a route back to the sim.
- TBS grading reuses the audited Apply grading functions; JE grading remains exact-account/debit/credit based.
- Sims are linked from the app shell and CPA page.

## Non-blocking findings for the next iteration

1. The AUD/CMA narrative grading is still keyword-based. It is acceptable for this seed because the model answers remain hidden until submission and the rubric is consistent with the existing Apply layer, but it is gameable. Next serious upgrade should add checklist/semantic grading or exemplar comparison.
2. CMA essay `minWords` floors around 50–60 words are low for exam-depth practice. Keep as a minimum submit floor, but future full-length essays should require more substantial responses or separate “quick drill” vs. “exam essay” modes.
3. Coverage is intentionally seed-level. This closes the format gap, not the simulation bank gap. Future sims need dropdown/document-review variants, more exhibits, and per-sim attempt history.

## Gates

- `npm run type-check`: pass
- `npm test -- --run`: pass, 261/261
- `npm run validate:content`: pass, 0 blocking errors
- `npm run build`: pass, 47/47 generated static pages
- Privacy grep over app/data/docs/task files: no forbidden-token matches
- `git diff --check origin/main..HEAD`: pass

