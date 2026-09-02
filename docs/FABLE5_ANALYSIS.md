# Fable 5 Deep Analysis — Accountrix

Date: 2026-07-03
Author: Fable 5, acting as inheriting project owner (per `docs/HANDOFF_FABLE5_DEEP_ANALYSIS.md`)
Evidence basis: direct reads of the engine/route code plus two exhaustive audits (content layer; routes/store/docs/hygiene). Every claim below cites a file.

---

## 1. Verdict: KEEP the assets, REBUILD the wiring. Freeze content authoring.

This is not a rebuild-from-scratch situation and not a healthy-keep situation. The repo holds three genuinely good asset classes:

1. **Content** — 135 current lessons (CMA 48 / CPA 75 / Finance 12), 946 quiz questions, 1,080 flashcards, a 1,058-item clean CPA practice bank, on the correct 2026 PL 119-21 tax baseline (`data/curriculum/cpa/reg/u1-w3.json`).
2. **Engines** — seven pure, unit-tested learning-science modules (`lib/readiness.ts`, `lib/spacedRepetition.ts`, `lib/errorClassify.ts`, `lib/parametric.ts`, `lib/gradeTarget.ts`, `lib/calculatorKeystrokes.ts`, `lib/missionControl.ts`).
3. **The case universe** — Meridian Building Group with 8 internally-tied workflows whose tasks all carry `expected` + `tolerance` + `explanation` and a `conversationSim` (`data/cases/meridian-building-group/`).

**What's broken is that these three never meet.** The engines are orphaned (5 of 7 are imported only by their tests), the store records nothing the engines could eat, and the Apply Lab renders its answer key instead of grading anything. The handoff's hypothesis — "over-invested in lesson generation relative to workflow grading and mistake memory" — is **confirmed, and it understates the problem**: the app is not an under-graded learning loop, it is a content viewer with a well-tested adaptive engine sitting in a drawer.

The learn → drill → apply → explain → review loop exists only as marketing copy on `/mission` ("Learn → drill → apply → explain mistake → schedule review", `app/mission/page.tsx:172`). No stage of it is actually closed.

---

## 2. Current-state architecture map

### Content pipeline (two generations, both live — this is a defect)

```
CURRENT generation                          LEGACY generation (still served!)
data/curriculum/{cma,cpa,finance}/*.json    data/m1.json … m12.json  (705 Qs, 0% calc,
  │  (per-week sources)                       templated stems, ~160 unique of 285 sampled)
  ▼ build scripts                              │
data/curriculum.json          (CMA  337 Q)     │  lib/content-loader.ts loadMonth()
data/curriculum-cpa.json      (CPA  525 Q)     │  reads data/${monthId}.json directly
data/curriculum-finance.json  (FIN   84 Q)     ▼
  │                                          /learn/[monthId]/*  and  /months/**  and
  ▼                                          /quiz/[monthId]/[weekId]
loadCurriculum() → /learn overview only
                                             ALSO: lib/content.ts → public/data/months/
                                             (stub mirror) + public/data/flashcards.json
                                             (divergent 5th copy; 91/91 cards q/a-swapped)
```

The same CMA lesson set exists in **five** stores: per-week sources, built aggregate, legacy `m*.json`, `data/months/` stubs, and `public/data/` mirrors. The lesson/quiz routes the nav funnels into serve the **legacy** bank.

### Engine layer (wiring status)

| Module | Tested | Wired into app |
|---|---|---|
| `missionControl.ts` | yes | `/mission` — but `pickNext` returns canned strings (`app/mission/page.tsx:77-88`) |
| `readiness.ts` | yes | `/mission` — fed 4 track-level aggregates, not skills (`app/mission/page.tsx:105-123`) |
| `errorClassify.ts` | yes | **nowhere** |
| `spacedRepetition.ts` | yes | **nowhere** |
| `parametric.ts` | yes (3 demo generators) | **nowhere** |
| `gradeTarget.ts` | yes | **nowhere** |
| `calculatorKeystrokes.ts` | yes | **nowhere** |
| `srs.ts` | no | **nowhere** (duplicate SRS implementation; delete) |

### State layer

`lib/store.ts` (865 lines): `useUserProgress` (XP/hearts/streak/badges), `useQuizResults` (CMA), `useCpaProgress`, `useFinanceProgress`. A quiz result is `{monthId, weekId, score, totalQuestions, completedAt}` (`lib/types.ts:62-68`) — **no per-question record, no skill tags, no confidence, no timing, no missed-item ids.** No SRS store. No Apply-attempt store. This single thin record is the root cause of the whole adaptive layer being dead.

### Route layer

41 pages; the Header links 10 (`/tracks /mission /learn /finance /flashcards /cpa /apply /crossover /search /profile`). Sixteen route groups are unreachable from any nav. The home page (`app/page.tsx`) is a stale "Master Construction Finance" landing that funnels into the legacy `/months` tree. The mobile menu button is a no-op (`components/Header.tsx:142-145`; `components/MobileNav.tsx` imported by nothing).

---

## 3. Findings, P0 → P3

### P0-1 — Real-data privacy breach in shipped content (FIXED in 576638e; pushed)
- `data/curriculum/cma/m5-w1.json:5` and its aggregate copy `data/curriculum.json:2018` named a real employer as the wrong-holder entity in the COI governance lesson.
- `docs/design/EXPERT_CPA_AI_PROFESSOR_MODULE.md:557,715` contained a real bank-reconciliation example with real account/amount details.
- Both were scrubbed to fictional MBG data in commit `576638e`, which is now on `origin/main`. **Residual risk:** the strings remain in git history unless history is rewritten. See §8.

### P0-2 — Apply Lab shows the answer key and grades nothing
`app/apply/[companyId]/[workflowId]/page.tsx:106-118` renders each task's `expected` beside its `input` under "Expected check". There is no answer entry, no submit, no grading, no attempt persistence — a server component with zero interactivity. The `conversationSim` is a prompt plus a "Show model answer" toggle (`:136-153`). `gradingRules`, `tolerance`, and `answerKeyChecks` in the workflow JSONs are loaded and ignored. **The product's stated moat (PRODUCT_MASTER_PLAN §10: "graded on correctness + clarity") is a reading page.** Bonus defect: `month-end-close.json`'s `is-figures` exhibit prints the graded answer (`"netIncome": 173800`) in the exhibit itself, so even honest self-testing is impossible on that workflow.

### P0-3 — The store starves every engine
Because `QuizResult` keeps only score totals (`lib/types.ts:62-68`), there is no data for: error classification (`errorClassify` never imported by app code), spaced repetition (no SRS store; both `spacedRepetition.ts` and `srs.ts` unwired), per-skill readiness (`/mission` computes "readiness" over four whole-track pseudo-skills with Apply hardcoded to `attempts: 0`, `app/mission/page.tsx:112`), and confidence/speed components that `readiness.ts` supports. The home page advertises spaced repetition that functionally does not exist.

### P0-4 — The nav funnels users into the wrong (legacy) content
`lib/content-loader.ts loadMonth()` reads `data/${monthId}.json` — the **old** m*.json generation: 705 templated questions, 0% calculation content, heavy stem duplication. This feeds `/api/curriculum/month/[monthId]` → `/learn/[monthId]/*`, plus the entire `/months/**` tree and `/quiz/**`. The new 337-question MBG-integrated CMA curriculum in `data/curriculum.json` is reachable only through the `/learn` overview. **The owner may literally be studying superseded content.** Highest-severity functional bug in the repo.

### P1-1 — Mission Control is a time-splitter wearing an adaptive engine's badge
`planDay()` allocates minutes correctly, but `pickNext` returns four hardcoded strings and the "Readiness signal" is track-level accuracy re-labeled. No connection to due SRS items, weak skills, or the next unfinished lesson. It's a good shell awaiting real inputs.

### P1-2 — Skill graph: frozen taxonomy, 0% item-level application
`docs/SKILL_TAXONOMY.md` is frozen (63 distinct ids in use, all valid). But **0 of 946 quiz questions carry `skills`**. Week-level coverage: Finance 12/12, CPA 16/75 (ISC/TCP only), CMA 0 inline but 48/48 via the `data/curriculum/cma-skills.json` sidecar. Weak-skill routing — the entire point of the taxonomy (PRODUCT_MASTER_PLAN §3) — is impossible at current tagging granularity. (Note: this file was also found deleted-but-uncommitted in the working tree today and restored via `git restore` — OneDrive sync is a live hazard, see §9.)

### P1-3 — Home page and navigation actively mislead
Stale "Master Construction Finance" hero, "3 comprehensive months" copy, CTAs into legacy `/months` and unlinked `/gamification`. Mobile nav dead. `/mission` — the intended daily entry point (PRODUCT_MASTER_PLAN §8 Phase 3 "Replaces generic Home") — is one of ten Header links.

### P1-4 — CPA MCQ depth skews recall
Calc-question share by grep estimate: Finance 54%, CMA 37%, FAR 20%, BAR 10%, TCP 7%, REG 4%, AUD 3%, ISC 0%. Sampled items are definition-recall with throwaway distractors. The exam-level calc muscle lives in `data/cpa/items.json` (1,058 clean items — but FAR only 162, ISC 0, TCP 0) and the case workflows. CPA week quizzes are currently the weakest content class relative to exam demands.

### P1-5 — Stale TCJA tax law in the dormant knowledge tree
`data/knowledge/professor/**` (4.7 MB) is TCJA-era throughout — e.g. `tax_preparation/personal_tax_4_tier_verification.json` hardcodes a $10,000 SALT cap in prose *and* code. Currently harmless only by accident: the sole loader (`lib/curriculum.ts loadKnowledgeFiles()`) reads the top level non-recursively and finds only `.gitkeep`, so the merge is a permanent no-op. If anyone ever "fixes" that loader, wrong tax law flows into the app. Quarantine or delete (§6).

### P2 — Structural clutter
- **Route duplication:** `/months/**` (6 pages) + `/quiz/**` duplicate `/learn/**`; `/badges` runs on hardcoded mock metrics (`lib/achievements.ts`); `/progress` ⊂ `/profile`; `/mode` duplicates a Header toggle; the `/onboarding`+`/plan`+`/templates`+`/custom`+`/assist` AI subsystem is disconnected from the loop and unlinked.
- **Broken flashcards:** `data/flashcards.json` — all 91 cards have q/a swapped; `public/data/flashcards.json` diverges from it.
- **CI runs 2 of 11 unit test files** (`.github/workflows/ci.yml` names only `cpa-progress.test.ts store.test.ts`); Finance curriculum has no build/drift check.
- **`data/cfo/` is empty**; `data/cpa/modules/` (154 Q / 310 FC) is a dead third CPA generation; `data/curriculum-index.json` is stale (2025-09-15, `totalWeeks: 12`).
- **Northstar Services** case is approved but has zero workflows — a second company with nothing to do in it.
- `.agent/watcher.err.log` is 857 KB; `REVIEW_QUEUE_CODEX.md` is 749 lines of resolved history; `mission-control-ui` is `needs_review` in `tasks.json` but absent from `REVIEW_QUEUE_CLAUDE.md`.

### P3 — Docs debt
- `docs/design/PROFESSOR_MODULE_COMPLETE.md` **falsely claims a "Complete Implementation"** of a module that does not exist — exactly the kind of artifact that misleads future agents. Archive with a header note.
- Four `LEARNING_MODE_*.md` docs for one small feature; five speculative Nov-2025 design docs with zero implementation; `Design Draft/` untracked while its byte-identical zip sits beside it; `data/ai/assist/session-*.json` carries `"userId":"owner"` (minor PII).

---

## 4. The one thing to build next: the Attempt Ledger + graded Apply Lab

One build, two visible halves, because they share a data model:

**(a) Attempt Ledger** — a single persisted event store, one record per answered thing:

```ts
interface AttemptEvent {
  id: string;
  source: "quiz" | "workflow-task" | "flashcard" | "parametric";
  itemId: string;            // question id / workflow:task id / card id
  skills: string[];          // from item tags, week tags, or cma-skills sidecar
  correct: boolean;
  answer: unknown;           // what the learner actually entered
  confidence?: 0 | 1 | 2;    // low/med/high, one tap
  timeSec?: number;
  errorCategory?: ErrorCategory;  // lib/errorClassify — captured on miss
  ts: number;
}
```

Recorded from `QuizComponent` (all three tracks) and the new Apply grader. This one store is the missing substrate for readiness, SRS, error patterns, and Mission Control routing simultaneously.

**(b) Graded Apply Lab** — make `/apply/[companyId]/[workflowId]` interactive:
- Hide `expected` until submission. `calc` tasks: numeric input graded against `expected` ± `tolerance`. `je` tasks: account/debit/credit entry rows graded against the expected entry. `writeup` and `conversationSim`: learner drafts first, then sees the model answer + a 3-point self-grade rubric (correct numbers cited / mechanism explained / stakeholder-appropriate) — self-grade writes to the ledger. (AI grading via the existing `/api/ai` plumbing is a later upgrade; do not block on it.)
- On any miss: the `errorClassify` one-tap prompt ("why did you miss this?") → ledger.
- Fix the `month-end-close.json` answer-in-exhibit leak while touching it.

Why this over everything else: it converts the two best existing assets (case universe + engine layer) from inventory into a product, it is what a working controller actually needs reps on, and every subsequent feature (real readiness, SRS, adaptive Mission Control) becomes a *consumer* of the ledger rather than a new build.

---

## 5. 30-day implementation plan

**Week 1 — Stop the bleed (routing + data model).**
1. Point `loadMonth()` at `data/curriculum.json`; delete `data/m1-12.json`, `data/months/`, `public/data/months/`, both broken `flashcards.json` copies, `data/cpa/modules/`, `data/curriculum-index.json`, `data/cfo/`.
2. Delete the `/months/**` and `/quiz/**` route trees (the `/learn` tree is the keeper).
3. Rewrite `app/page.tsx` as a thin redirect/summary into `/mission`; fix the Header mobile menu (wire `MobileNav.tsx` or remove the button).
4. Implement the Attempt Ledger store + record from `QuizComponent`; migrate nothing (old results stay as-is for XP).
5. CI: run all 11 test files; add the Finance curriculum build/drift step; add a privacy denylist grep (see §7).

**Week 2 — Graded Apply Lab v1** (as specified in §4b), on Meridian's 8 workflows. Definition of done: zero `expected` values visible pre-submit; every submission lands in the ledger with skills + errorCategory.

**Week 3 — Wire the adaptive layer.**
1. SRS store using `lib/spacedRepetition.ts` (delete `lib/srs.ts`); misses and flashcards feed it; `/mission`'s review block shows actual due items.
2. Readiness switched to per-skill: ledger events × skill tags (item-level where present; week-level + `cma-skills.json` sidecar as fallback). Blueprint weights from the taxonomy domains.
3. Mission Control `pickNext` returns real targets: weakest tested skill's next lesson/drill, due-review count, and the day's Apply workflow.
4. Backfill script: stamp week-level `skills` onto each question as a default (imperfect is fine; refine during review).

**Week 4 — Finance sprint (August class) + polish.**
1. `/finance` gets the `gradeTarget.ts` UI (target B+, sensitivity table) and the `calculatorKeystrokes.ts` drawer.
2. Extend `parametric.ts` beyond the 3 demos: annuity PV/FV, bond price/YTM, CAPM, WACC, NPV/IRR multi-year, pro-forma EFN — wired as "New variation" drills on Finance weeks and as SRS-schedulable items.
3. Only if time remains: author Northstar's first 2 workflows (AR aging + cash forecast on a service company). Otherwise: **content freeze holds.**

Effort-ranked gap list (largest → smallest): graded Apply UI (wk2) > attempt ledger + quiz wiring (wk1) > adaptive wiring (wk3) > legacy deletion (wk1, mechanical but wide) > parametric expansion (wk4) > CI/test repairs (days) > docs/hygiene (hours).

---

## 6. Kill list

**Delete now (code/data):** `/months/**` routes, `/quiz/**` routes, `/badges` (mock-data demo), `/progress` (subset of `/profile`), `/mode` (duplicate toggle), `lib/srs.ts`, `data/m1-12.json`, `data/months/`, `public/data/months/`, `data/flashcards.json` + public copy, `data/cpa/modules/`, `data/cfo/`, `data/curriculum-index.json`, the untracked `Accountrix Academy Exam Prep.zip` (commit `Design Draft/` as `docs/design/prototype/` instead).

**Park (do not extend, do not delete yet):** the `/onboarding` + `/plan` + `/templates` + `/custom` + `/assist` AI subsystem; `/gamification` (fold its useful widgets into `/profile` later); `/coa-builder` + `/tools/cost-codes` (audited lesson companions — keep, but they are not on the critical path).

**Quarantine or delete:** `data/knowledge/professor/**` — unreachable by design today, TCJA-stale, and of work-adjacent provenance. Either delete it or add a README declaring it non-runtime and excluded from any future loader until re-based on PL 119-21.

**Stop (process):** net-new lesson/curriculum generation across all tracks. 946 questions and 135 lessons are enough substrate. The Claude×Codex authoring loop re-opens only for: fixing defects found above, ISC/TCP practice items (currently 0 in the clean bank), and Northstar workflows once the grader exists.

**Archive (docs):** `docs/design/{AI_AUDIO_VIDEO,AI_VISUAL_CALCULATOR,LIVE_CAMERA_AI_VISION,MISSING_REVOLUTIONARY_FEATURES,PROFESSOR_MODULE_COMPLETE,REVOLUTIONARY_FEATURES_SUMMARY}.md` → `docs/archive/` with a one-line "speculative, unimplemented" header (PROFESSOR_MODULE_COMPLETE additionally marked "claims are false"). Merge the four `LEARNING_MODE_*.md` into one. Truncate `REVIEW_QUEUE_CODEX.md` to open items + pointer to git history. Delete `.agent/watcher.err.log`.

---

## 7. Test plan

**Repair first:** CI must run all unit tests (`vitest run`, not two named files) and build/drift-check all three curricula.

**New tests with the new builds:**
- Attempt Ledger: event recording from quiz + workflow paths; skill-tag resolution fallback chain (item → week → sidecar).
- Apply grading: calc within/outside tolerance; je account+direction+amount matrix; writeup self-grade persistence; `expected` never present in the pre-submit payload (regression test for P0-2).
- `loadMonth()` serves `curriculum.json` content (regression test for P0-4).
- `case-workflows.ts` loader (currently zero tests): schema validation of all workflow JSONs, including an "answer not present in exhibits" lint (regression for the month-end-close leak).
- SRS integration: miss → due next day → interval growth on pass.
- One Playwright happy path: `/mission` → open CMA week → take quiz → miss one → classify error → item appears in review queue.

**Content gates in CI (`validate:content`):**
- Privacy denylist grep over `data/ docs/ app/ components/ lib/`: use the private denylist maintained outside the repo; fail on any known real employer, real project, personal identity, real class code, or real-dollar anchor hit.
- Tax-baseline lint: flag `$10,000` SALT / pre-119-21 rules in any runtime-reachable content.
- Flashcard schema check (q is a question, a is not "What is Q10?"-style — catches the swapped-fields class).

---

## 8. Privacy risks

1. **Git history retains scrubbed strings.** `af991bb` and `576638e` fix HEAD only. If the GitHub repo is private and stays private, the residual risk is lower; if it is public or will ever be shared, run `git filter-repo` using the private denylist and force-push. Owner decision — flagged, not executed here.
2. **`data/knowledge/professor/**` provenance.** Cites internal/work-adjacent artifacts and until today held a real reconciliation example. Assume more work-derived residue exists in its 4.7 MB; that is why §6 says quarantine-or-delete rather than audit-and-keep.
3. **`data/ai/assist/session-1782243820140.json`** carries a real first-name user id. Trivial; scrub when touching that subsystem.
4. **Ongoing exposure channel:** content is authored by agents with access to the owner's real workspace. The CI denylist gate (§7) is the structural fix; today's leak reached `main` because no gate existed.
5. Design prototype (`Design Draft/`) and screenshots: scanned clean.

---

## 9. Repo cleanup plan

1. Privacy scrub commit `576638e` is already pushed. Remaining decision: whether to rewrite history with the private denylist.
2. Execute §6 deletions/archives as one `chore(cleanup)` commit after Week-1 routing changes prove the legacy trees dead.
3. `.agent/` hygiene: delete `watcher.err.log` (857 KB), reconcile `mission-control-ui` between `tasks.json` and `REVIEW_QUEUE_CLAUDE.md`, refresh `ACTION_NEEDED.md` (dated 2026-06-29, now wrong).
4. Commit `Design Draft/` → `docs/design/prototype/` (drop `HANDOFF (1).md` duplicate); delete the zip; add `*.zip` to `.gitignore`.
5. **OneDrive hazard:** `docs/SKILL_TAXONOMY.md` was found silently deleted from the working tree today (restored via `git restore`). A OneDrive-synced git repo will do this again. Mitigation options, in order of preference: move the canonical clone out of OneDrive and let GitHub be the sync layer; or exclude `.git/` from OneDrive sync; at minimum run `git status` before every session start (the autonomous loop should do this and auto-restore tracked deletions it didn't make).
6. The stale root clone `C:\Users\owner\AccountrixCPA-App` should be deleted outright once the owner confirms nothing uncommitted remains — it has already caused one content/app split.

---

## Bottom line

Keep the content, keep the engines, keep the case universe — and stop making more of all three until the loop closes. The single sentence that should govern the next 30 days: **nothing new gets authored until a wrong answer somewhere in this app changes what the app shows the learner tomorrow.**
