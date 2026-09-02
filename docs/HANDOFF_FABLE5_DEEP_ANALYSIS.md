# Handoff to Fable 5 — Deep Analysis, Gap Audit & Improvement Mandate

Date filed: 2026-07-03  
Audience: Fable 5, acting as inheriting project owner

## 1. Mandate

Treat this as your project now. Do not defer to the existing architecture, roadmap, UI, content volume, or prior agent decisions. Find what is wrong, missing, over-built, stale, or weak. Ground every claim in files you actually inspect.

Deliver `docs/FABLE5_ANALYSIS.md` with:

1. A keep / cut / rebuild verdict.
2. A current-state architecture map.
3. P0–P3 findings with file evidence.
4. A ranked gap list with effort estimates.
5. The single highest-leverage next build.
6. A kill list of work that should stop or be removed.

## 2. Product thesis

Accountrix is a single-user mastery system for a working controller / junior-CFO who is studying Finance, CMA, and CPA in parallel.

The product should not be “Duolingo for accounting.” The core loop should be:

Learn → Drill → Apply → Explain the mistake → Schedule review.

The differentiator is not badges or video. The differentiator is combining exam-level accounting/finance depth with fictional controller/CFO workpapers and stakeholder judgment practice.

## 3. Non-negotiable constraints

- Zero real company, personal, client, vendor, bank, or project data in repo content, fixtures, screenshots, generated bundles, or docs.
- All case companies and amounts are fictional.
- Tax content must use the 2026 Public Law 119-21 baseline unless a lesson explicitly says it is teaching historical law.
- CMA/CPA depth matters as much as Finance; the user’s current work is mostly CMA/CPA/controller-level.
- Finance still matters because school resumes in August and the user needs a B+ or better.

## 4. Current verified repo state

Canonical source is the GitHub `main` branch and the synced local app repo. A stale root clone existed and held uncommitted artifacts; those artifacts were imported into the canonical repo before this handoff was committed.

Known current capabilities:

- CMA: 12 months / 48 weeks / 337 quiz questions / 384 flashcards, assembled into `data/curriculum.json`.
- CPA: live `/cpa` route and curriculum loader for FAR, AUD, REG, BAR, ISC, and TCP units.
- Finance: live `/finance` route with 12 corporate-finance lessons across 3 units.
- Apply Lab: live `/apply` and `/apply/[companyId]/[workflowId]` routes for fictional case workflows.
- Mission Control: live `/mission` route using the tested 45/30/20/5 lane mix.
- Progress isolation: CMA, CPA, and Finance quiz results use separate stores while sharing global XP.
- Case universe:
  - Meridian Building Group: main fictional construction case with 8 workflows.
  - Northstar Services: second fictional service-company case; `case.json` exists, no workflows yet.

## 5. Files to read first

Read these before making claims:

1. `docs/PRODUCT_MASTER_PLAN.md`
2. `docs/SKILL_TAXONOMY.md`
3. `.agent/tasks.json`
4. `lib/missionControl.ts`
5. `lib/readiness.ts`
6. `lib/spacedRepetition.ts`
7. `lib/errorClassify.ts`
8. `lib/parametric.ts`
9. `lib/case-workflows.ts`
10. `app/mission/page.tsx`
11. `app/apply/page.tsx`
12. `app/apply/[companyId]/[workflowId]/page.tsx`
13. `app/profile/page.tsx`
14. `data/cases/meridian-building-group/case.json`
15. `data/cases/meridian-building-group/workflows/*.json`
16. `data/cases/northstar-services/case.json`
17. `data/curriculum/cma/`
18. `data/curriculum/cpa/`
19. `data/curriculum/finance/`
20. `tests/unit/`

## 6. Critical questions

### Architecture

- Is the current Next.js app structure appropriate, or has the app become a pile of routes without a coherent learner loop?
- Should Mission Control become the home page?
- Are Learn, Apply, Profile, and Mission wired around one mastery model, or are they still separate features?

### Learning effectiveness

- Does the app force active problem-solving, or does it still reward passive reading?
- Does every lesson route naturally into a drill, a workpaper, or a stakeholder simulation?
- Are mistake explanations captured as data, or are wrong answers discarded after showing feedback?

### Controller/CFO value

- Do the Apply workflows actually train judgment needed for lender, insurance, owner, and CPA conversations?
- Are conversation sims graded, or are they unscored prose?
- What ten workflows would most improve a junior controller’s weekly performance?

### Exam readiness

- Is readiness defensible, or still a vanity score?
- Does it use blueprint weight, accuracy, recency, confidence, speed, simulation results, and spaced repetition?
- Are skill tags complete enough to drive routing?

### Finance class goal

- Does the Finance track help the user get a B+?
- Does the app track grade target, weak chapters, formula fluency, BA II Plus keystrokes, and error patterns?
- Which Finance topics need the most practice: TVM, annuities, bond pricing, DGM, CAPM, WACC, NPV/IRR, pro formas, cash-flow signs?

### Repo/process hygiene

- Are there stale clones, stale docs, or stale task rows that would mislead future agents?
- Is `.agent/tasks.json` current?
- Which docs should be archived or deleted?

## 7. Hypotheses to pressure-test

Do not accept these without checking files.

- The app has strong content volume but insufficient “do the work” pressure.
- Apply Lab is the moat, but its workflow outputs and conversation sims may be under-graded.
- Mission Control exists but is still a first-pass router, not a true adaptive engine.
- The skill taxonomy is valuable but may not be frozen or consistently applied.
- The product may be over-invested in lesson generation relative to workflow grading and mistake memory.
- CPA coverage may be ahead of CMA/Apply execution depth, even though the user’s job is mostly controller/CMA/CPA work.
- The design prototype likely improved aesthetics but may not solve the core learning loop.
- Docs and repo history may still contain enough old claims to confuse agents.

## 8. Required output format

Create `docs/FABLE5_ANALYSIS.md` with:

1. Verdict: keep / cut / rebuild.
2. Architecture map.
3. Evidence-backed P0–P3 findings.
4. The one thing to build next.
5. 30-day implementation plan.
6. Kill list.
7. Test plan.
8. Privacy risks.
9. Repo cleanup plan.

Be direct. If a feature is theater, say so. If content should be cut, say so. If the app should pivot around Mission Control and Apply Lab, say exactly how.
