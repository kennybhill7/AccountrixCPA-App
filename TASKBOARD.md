# Accountrix — Task Board

Single source of truth for who's doing what. Update on every claim/handoff. See `AGENT_CHARTER.md` for the protocol.
Columns: **Backlog → In Progress → Needs Review → Done.** A task is Done only after the *other* agent approves.

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
- 🟦 **S0-7 (Claude)** Re-point app from "Construction CFO Fundamentals" months to the CMA track titles (m1–m6 = Part 1 A–F, m7–m12 = Part 2 A–F) in `data/curriculum-index.json` + month `title`/`description`. *(content bodies stay until Codex replaces them week-by-week.)*
- 🔴 **S1-C3 (Claude)** Live cost-code simulator returned from Codex audit: fix invalid-account predicate and add discoverable m4-w1 link; see `REVIEW_QUEUE_CODEX.md`.

### Backlog — Claude (app/infra)
- ✅ **S1-C1 (Claude)** Built + proved `npm run validate:content` (`scripts/validate-curriculum.ts`): validates new week files in `data/curriculum/cma/` + knowledge overlays against `lib/schemas.ts` (hard-gate), reports legacy v1 content non-blocking. Negative-tested (catches out-of-range answer → exit 1). *Surfaced finding: legacy `data/m*.json` use `{q,a}` flashcards + no `order` — non-conformant; replaced week-by-week.* → file in `REVIEW_QUEUE_CODEX.md`.
- ✅ **S1-C6 (Claude)** Built `scripts/build-curriculum.ts` (`npm run build:curriculum`) — assembles `data/curriculum/cma/m{N}-w{Y}.json` into `data/curriculum.json`, replacing only fully-authored (4-week) months and leaving legacy months untouched. Verified: m4 assembled, m1/legacy preserved.
- 🟦 **S1-C2** Integrate `AskAIOverlay` (portal AI tutor, zero screen-jump) from `_salvage/ai-cpa` into the global layout, wired to `lib/professor-adapter.ts`.
- 🟦 **S1-C3** Integrate `costCodeMapping.ts` into the WIP/Job-Cost simulator so m4 lessons have a live tool.
- 🟦 **S1-C4** Wire the CPA exam-item bank (`data/cpa/content/items/*.yaml`) into the quiz engine as a "CPA Crossover" practice mode.
- 🟦 **S1-C5** (Phase 2) Multi-track data-model refactor to add the CPA Evolution track (Core AUD/FAR/REG + Discipline BAR).

### Backlog — Codex (content)
- 🟩 **S1-X4** Then m2, m3, m6 to finish CMA Part 1.
- 🟩 **S1-X5** CMA Part 2 (m7–m12) after Part 1 is audited.
- 🟩 **S1-X6** For each authored month, file it in `REVIEW_QUEUE_CLAUDE.md` for accounting + schema audit.

### Needs Review — Codex (content)
- ⬜ **S1-X3 (Codex)** Authored **m5 (Internal Controls)** as four schema-valid week files; 4,873 lesson words, 32 flashcards, 28 questions; `npm run validate:content` passes with 0 blocking errors. Branch: `feat/s1-x3-m5`. Awaiting Claude accounting/content audit.

### Done — Sprint 1
- ✅ **S1-X2 (Codex, audited by Claude — loop cycle 1)** **m1 (External Financial Reporting)** — 4 weeks, 28 questions, 32 flashcards, 5,002 words. Claude audit: all 28 answers correct, examples consistent, real numbers tie to Master Brain, conventions honored → **APPROVED** (see `REVIEW_QUEUE_CLAUDE.md`). Assembled into `curriculum.json`. ⚠️ Merge `feat/s1-x2-m1` when ready (not auto-merged).
- ✅ **S1-X1 (Codex, audited by Claude)** **m4 (Cost Management)** — 4 weeks, 29 questions, 32 flashcards. Claude audit → **APPROVED**. Assembled into `curriculum.json`. **First full charter loop closed.**

---

## How Ken drives Codex
Paste the Codex task spec from `HANDOFF_TO_CODEX.md` (Claude will generate/update it) into Codex. Codex writes content to `data/months/m*.json`, runs `npm run validate:content`, then logs the month in `REVIEW_QUEUE_CLAUDE.md`. Claude audits and reports back here.
