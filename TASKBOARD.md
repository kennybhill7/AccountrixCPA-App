# Accountrix — Task Board

Single source of truth for who's doing what. Update on every claim/handoff. See `AGENT_CHARTER.md` for the protocol.
Columns: **Backlog → In Progress → Needs Review → Done.** A task is Done only after the _other_ agent approves.

Last updated: 2026-06-23 by Codex.

---

## 🏁 Sprint 0 — Consolidation & Foundation (in progress)

### Done

- ✅ **S0-1 (Claude)** Audit all three Accountrix folders; pick keeper. → kept main `Accountrix`.
- ✅ **S0-2 (Claude)** Archive `Accountrix AI CPA` + `Accountrix CPA Prep` to `_archive/*.zip` (node_modules excluded).
- ✅ **S0-3 (Claude)** Salvage content into `Accountrix`: `data/cpa/modules` (12), `data/cpa/content` (labs+items), `data/cfo` (3), `data/knowledge/professor` (217), `scripts/curriculum` (2 build scripts), `_salvage/ai-cpa` + `_salvage/new-app` (reference code), `docs/design` (feature specs).
- ✅ **S0-4 (Claude)** Delete junk (49 status docs, 20 backups, .temp, .next, New folder) + the two duplicate folders.
- ✅ **S0-5 (Claude)** Author `AGENT_CHARTER.md`, `docs/CURRICULUM_SPEC.md` (48-week CMA spine), this board, review queues.
- ✅ **S0-6 (Claude)** Author flagship exemplar week `data/curriculum/cma/m4-w2.exemplar.json` (WIP/over-under billings) as the content quality bar.

### In Progress

- 🟦 **S0-7 (Claude)** Re-point app from "Construction CFO Fundamentals" months to the CMA track titles (m1–m6 = Part 1 A–F, m7–m12 = Part 2 A–F) in `data/curriculum-index.json` + month `title`/`description`. _(content bodies stay until Codex replaces them week-by-week.)_
- 🟡 **S1-C3 (Claude)** Codex's `1401x` re-audit predated my fix: commit `3137b3f` already changed `lib/costCodeMapping.ts:222` to `/^\d+$/` (all-digit) — `1401x` is now rejected. **Awaiting Codex re-confirm** (`REVIEW_QUEUE_CODEX.md`).

### Backlog — Claude (app/infra)

- ✅ **S1-C1 (Claude)** Built + proved `npm run validate:content` (`scripts/validate-curriculum.ts`): validates new week files in `data/curriculum/cma/` + knowledge overlays against `lib/schemas.ts` (hard-gate), reports legacy v1 content non-blocking. Negative-tested (catches out-of-range answer → exit 1). _Surfaced finding: legacy `data/m_.json`use`{q,a}`flashcards + no`order`— non-conformant; replaced week-by-week.* → file in`REVIEW_QUEUE_CODEX.md`.
- ✅ **S1-C6 (Claude)** Built `scripts/build-curriculum.ts` (`npm run build:curriculum`) — assembles `data/curriculum/cma/m{N}-w{Y}.json` into `data/curriculum.json`, replacing only fully-authored (4-week) months and leaving legacy months untouched. Verified: m4 assembled, m1/legacy preserved.
- ✅ **S1-C2 (Claude)** Built global portal-based `components/AskAI.tsx` AI tutor (zero screen-jump, scroll-lock, ESC, ARIA), mounted in `app/layout.tsx`, wired to the existing `/api/ai/assist` route; suggestions link into lessons. Committed `469fb51`. Type-checks clean. → audit in `REVIEW_QUEUE_CODEX.md`.
- ✅ **S1-C4 (Claude)** CPA Crossover practice mode (`6f76d0d` + nav `e824e51`): `build-cpa-items` → `data/cpa/items.json` (1,058 clean of 1,992 — flagged FAR/REG template-broken, ISC/TCP placeholder stubs), `/api/cpa/items`, `/crossover` page, "CPA Practice" nav. → audit in `REVIEW_QUEUE_CODEX.md`.
- 🟡 **S1-C5** (Phase 2) Multi-track data model. **Groundwork done** (`63d9264`): `lib/tracks.ts` registry (CMA P1 live / P2 in-progress / CPA Crossover live / CPA Core+BAR planned), `/tracks` hub page, "Tracks" nav. Additive, non-breaking, type-check 0. **Remaining:** full CPA-lessons data model + loader/route extension (do after CMA Part 1+2 content complete; Codex authors CPA lessons). → audit in `REVIEW_QUEUE_CODEX.md`.
- ✅ **S1-C7 (Claude)** `npm run type-check` restored to **0 errors** (`73bbc0c`): LessonTOC syntax fix, `_salvage` excluded, es2018, professor-adapter variable-specifier import, vitest-env.d.ts, excluded 2 deprecated scripts. → audit in `REVIEW_QUEUE_CODEX.md`.
- 🟦 **S1-C8 (Claude, flagged)** Regenerate FAR/REG distractor `${...}` templates (~818 broken items) + author ISC/TCP item banks (currently placeholder stubs). Content-adjacent — coordinate with Codex.
- 🔴 **S1-C9 (ENVIRONMENTAL, needs Ken)** `npm run build` (next build) FAILS: `node_modules/core-js/modules/` is **empty (0 files)** — OneDrive has node_modules cloud-only / not hydrated, so `jspdf`→core-js (used by `lib/coa-utils.ts` PDF export → `app/coa-builder/examples`) can't resolve at build time. **Same root cause as the eslint/mmap hook failures.** Source is sound (`npm run type-check` = 0 on a clean tree). **Fix:** run `npm ci` (full reinstall) and/or set the `Accountrix` folder to OneDrive "Always keep on this device", or move the project off OneDrive. Not a code fix.
- ✅ **S1-C10 (Claude)** Next 14→15 **async-params migration** DONE (`28f29ae`): 7 pre-existing server routes (`months/[monthId]/page` + `weeks/[weekId]/{page,lesson,quiz,flashcards}`, `api/ai/assist/[sessionId]`, `api/ai/custom-lessons/[id]`) now type `params: Promise<…>` + `await`. Resolves the 14 `.next/types` errors → build's type phase passes; only S1-C9 (env core-js) remains for a green production build. Clean-tree `npm run type-check` = 0. → audit in `REVIEW_QUEUE_CODEX.md`.

### Backlog — Codex (content)

- 🟩 **S1-X5** CMA Part 2 (m7–m12) after Part 1 is audited.
- 🟩 **S1-X6** For each authored month, file it in `REVIEW_QUEUE_CLAUDE.md` for accounting + schema audit.

### Needs Review — Codex (content)
- ⬜ **S1-X4-m6 (Codex)** Authored **m6 (Technology & Analytics)** as four schema-valid week files; 4,869 lesson words, 32 flashcards, 28 questions; `npm run validate:content` passes with 0 blocking errors. Branch: `feat/s1-x4-m6`. Awaiting Claude accounting/content audit; approval completes CMA Part 1.

### Done — Sprint 1

- ✅ **S1-X4-m3 (Codex, audited by Claude — loop cycle 4)** **m3 (Performance Management)** — 4 weeks, 28 questions, 32 flashcards, 4,876 words. Claude audit: all 28 answers correct, variance/transfer-pricing/ROI-RI-EVA/segment math ties, real numbers accurate (Brookhaven $6,140,000.00/$390,000.00, loan $310,000.00), conventions honored → **APPROVED** (`22b5b78`). Assembled — **m1–m5 render (5/6 Part 1)**. Codex unblocked for **m6**. ⚠️ Merge `feat/s1-x4-m3` when ready.

- ✅ **S1-X4-m2 (Codex, audited by Claude — loop cycle 3)** **m2 (Planning, Budgeting & Forecasting)** — 4 weeks, 28 questions, 32 flashcards. Claude audit: all 28 answers correct, integrated pro forma B/S ties ($3,810,000), real hooks accurate ($400,000.00 stranded, 5-day/3-day close), conventions honored → **APPROVED** (`3137b3f`). Assembled (m1+m2+m4+m5 render). ⚠️ Merge `feat/s1-x4-m2` when ready.

- ✅ **S1-X3 (Codex, audited by Claude — loop cycle 2)** **m5 (Internal Controls)** — 4 weeks, 28 questions, 32 flashcards, 4,873 words. Claude audit: all 28 answers correct, COI facts exact, Account 111 ($95,000.00) vs 102.1 gap ($47,200.00) distinct, registry tiers accurate, conventions honored → **APPROVED**. Assembled into `curriculum.json` (m1+m4+m5 render).
- ✅ **S1-X2 (Codex, audited by Claude — loop cycle 1)** **m1 (External Financial Reporting)** — 4 weeks, 28 questions, 32 flashcards, 5,002 words. Claude audit: all 28 answers correct, examples consistent, real numbers tie to Master Brain, conventions honored → **APPROVED** (see `REVIEW_QUEUE_CLAUDE.md`). Assembled into `curriculum.json`. ⚠️ Merge `feat/s1-x2-m1` when ready (not auto-merged).
- ✅ **S1-X1 (Codex, audited by Claude)** **m4 (Cost Management)** — 4 weeks, 29 questions, 32 flashcards. Claude audit → **APPROVED**. Assembled into `curriculum.json`. **First full charter loop closed.**

---

## How Ken drives Codex

Paste the Codex task spec from `HANDOFF_TO_CODEX.md` (Claude will generate/update it) into Codex. Codex writes content to `data/months/m*.json`, runs `npm run validate:content`, then logs the month in `REVIEW_QUEUE_CLAUDE.md`. Claude audits and reports back here.
