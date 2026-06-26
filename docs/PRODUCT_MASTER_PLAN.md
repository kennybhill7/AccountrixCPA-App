# Accountrix Academy — Product Master Plan

> Single source of truth for the unified **Finance → CMA → CPA → CFO** mastery system.
> Synthesizes the Design Draft (HANDOFF.md), Claude's critique, Codex's critique, and the
> existing GSU "Fluency" corporate-finance study app. Both agents build from THIS doc.
> Status: **v1 — 2026-06-25.** Owner decisions captured in §8.

---

## 1. Vision (the one line)

**An applied finance/accounting MASTERY system — not a pretty exam-prep clone.**
The user learns a concept, proves it on graded real work (Excel/TBS), and ultimately applies it
to their **real company numbers** — progressing Finance → CMA → CPA → the CFO seat. The moat is
"learn it → do it for real," powered by a **skill graph**, not badges.

Single serious user (no monetization/multi-tenant yet). One study app, not two.

---

## 2. The two-layer architecture (the core idea)

- **LEARN** — the Academy curricula: **Finance / CMA / CPA** tracks, shared XP/streak/profile,
  Study vs Exam mode. (This exists: 55 CPA lessons + 12 CMA months live; Finance track ported
  from the GSU app — see §5.)
- **APPLY** — the real finance apps (construction finance platform + corporate-finance app)
  wired in **later** as **live case data**, NOT a separate tab. Every lesson ends with "now do
  it on your real numbers." (Plug-in is future per owner; architecture must not preclude it.)

The bridge between Learn and Apply is the **Skill Graph (§3)**.

---

## 3. The Skill Graph — the spine (adopt from Codex)

Every artifact — lesson, quiz item, flashcard, TBS, Excel drill, finance workflow — is **tagged
to one or more skills**. This is the single most important structural decision and is **cheap now,
expensive to retrofit** — so we tag content as we author it (Phase 0).

Example skills: `asc606-revenue`, `wip-schedule`, `bank-rec`, `cash-forecasting`, `ratio-analysis`,
`tvm`, `npv-irr`, `capital-budgeting`, `dcf-valuation`, `audit-evidence`, `tax-basis`,
`excel-xlookup`, `excel-npv`, `controls-segregation`, `consolidation-eliminations`.

What the graph unlocks:

- **Weak-skill targeting:** "Your weak area is revenue-recognition estimates → do this lesson,
  this TBS, and this Excel drill."
- **Finance/CMA/CPA crosswalk (revolutionary):** one concept appears across tracks + the real
  workflow. e.g. **NPV** → Finance (capital budgeting) → CMA (capital budgeting) → CPA BAR
  (DCF/valuation) → real workflow (investment-decision memo) → Excel drill (DCF model) → TBS
  (choose project under capital constraint). One knowledge graph, not three isolated libraries.
- **Defensible CFO-readiness (§4)** and **adaptive review (§6)** both read from the graph.

This also dissolves the "12 months × 4 weeks for every track is artificial" problem: the **path
map is a view over the skill graph**, and each track can shape its own pacing.

---

## 4. CFO-Readiness model (replaces the vanity "CFO Ready" badge)

A measurable readiness score across CFO skill domains, each rolled up from skill-graph mastery:
**cash flow · close · controls · tax · audit · Excel/modeling · forecasting · reporting ·
decision analysis.** "CFO Ready" tier = thresholds met across domains, not a cosmetic badge.

**Exam-readiness score (defensible, not a fake %):** weighted from
`recency · accuracy · time-per-item · confidence calibration · simulation performance ·
blueprint topic weighting · spaced-repetition decay`. (Fluency already has confidence
calibration + error tagging to seed this.)

---

## 5. Content (PRIORITY — "dial in content before app functionality")

Three tracks, content-first:

- **CPA** — being authored now by the Claude×Codex loop. 15 units / 59 lessons live (FAR×5,
  AUD×3, REG×4, BAR×3); ISC + TCP disciplines next. Each lesson ≥1,200 words, 7-Q quiz,
  8 flashcards, Codex-audited. **This loop keeps running.**
- **CMA** — 12 months × 4 weeks already live (`data/curriculum.json`).
- **Finance** — **port from the GSU "Fluency" app** (`OneDrive/Apps/GSU/Finance/Corporate
finance/Study App`). It is **FI3300 Corporate Finance**: TVM, financial statements & cash
  flow, stocks & bonds, capital budgeting & WACC, with THPS problem sets, a master study guide,
  podcasts, and a built study app. **Keep chapters/THPS/quizzes/tests identical** (owner is
  retaking the class) — clean-up only, no answer changes.

**Author-time requirements going forward (so the engine works later):**

1. Tag every artifact to skill(s) (§3).
2. Pair each lesson with **infographics/interactive diagrams** as first-class components
   (build now — high learning value, low cost).
3. Keep the quiz/TBS/flashcard schema engine-ready (cell-graded TBS pattern).

---

## 6. Feature inventory — KEEP / CUT / DEFER / ADOPT

**KEEP (table stakes, port the design's craft):**

- Track/mode separation; Blueprint + Safety-Orange identity; 6 XP tiers; streak/hearts/badges
  (motivation layer, **not** the core value); BA II Plus TVM calculator (excellent, functional);
  licensing roadmap; read-aloud (Web Speech as on-device fallback).

**ADOPT from the GSU Fluency app (proven mechanics — generalize across all tracks):**

- **Error-tag dashboard → "explain my mistake" loop** (classify: concept gap / formula-math /
  misread / JE direction / tax exception / audit-assertion / time pressure → targeted review).
- **Parametric problem generator** (infinite variations of weak problem TYPES; auto-checked).
- **Confidence calibration** (pre-answer 0–100% slider → overconfidence coaching; feeds readiness).
- **Spaced-repetition review queue** (Anki/Leitner on missed items).
- **Tutor with memory** → context-aware **Ask Rivet** (knows current lesson, error history, and
  later, real numbers).
- **Calculator keystroke drawer** per question; **tap-to-reveal** with "why each wrong choice."
- **Exam simulation mode** (timed, BA II only, no hints, time-per-question scorecard).

**CUT (theater / premature for one user):**

- Live human **tutor 1:1 booking + video-call session** screens. (Owner: cut.) Invest in Ask Rivet.
- Heavy "social proof / study-buddy / cohort" features (multi-user; out of scope).

**DEFER (right idea, wrong time — keep on roadmap, prove before committing):**

- **AI media pipeline (NotebookLM mass-video + ElevenLabs):** owner wants infographics + video
  in **final production**. Plan: **infographics/diagrams NOW** (authored with lessons); **video +
  ElevenLabs narration as a production-polish phase** — but first **prove the content pipeline,
  storage model, review gate, and per-asset cost** on a single section before scaling. (Codex:
  don't architect around an assumed pipeline.)
- **Apple Pencil notebook** — nice, local note tool, not a mastery engine. Behind Excel/TBS/
  adaptive/finance-integration. (Notes "stamp" templates — timeline, DuPont tree, formula
  scaffold — are a cheap later add.)
- **Tablet/landscape + desktop layouts** — REQUIRED for the desktop-first power features (§7),
  sequenced with the Excel/TBS engine.

---

## 7. Desktop-first for the power features (Codex)

The prototype is mobile-first (right for review). But the revolutionary parts are **desktop-first**:
Excel trainer, finance dashboards, simulations, modeling, reconciliations, TBS exhibits. Mobile =
watch/quiz/queue-the-drill/review; **desktop = do the real work.** Cross-device handoff
("continue on desktop") is required.

---

## 8. Reconciled build order (resolves content-first vs engine-first)

Owner says **content first**; Codex's order is engine-first. Reconciliation: **Phase 0 runs now in
parallel** (content + skill tagging), and the engine phases follow — but the skill graph is defined
during Phase 0 so content is born engine-ready.

- **Phase 0 — CONTENT + SKILL GRAPH (NOW, ongoing):** keep the CPA authoring loop running; port the
  Finance track from GSU (faithful); confirm CMA. **Define the skill taxonomy and tag every
  artifact.** Pair lessons with infographics. _(This is the owner's "content first.")_
- **Phase 1 — Design-system migration:** port tokens, type, mobile nav, track/mode shell onto the
  existing Next.js app. **Do not copy the whole prototype; do not skin.**
- **Phase 2 — Unified track model:** refactor content loaders so Finance/CMA/CPA (and future
  finance-app workflows) are first-class tracks/modules over the skill graph.
- **Phase 3 — Mission Control dashboard:** replace generic Home with: what to study today · weak-skill
  queue · finance snapshot (stub now) · exam-objective mapping · CFO-workflow link.
- **Phase 4 — Excel/TBS engine (the moat):** ONE reusable cell-graded grid engine. Seed targets:
  WIP schedule, bank rec, bond amortization, lease schedule, DCF, depreciation, ratio analysis,
  adjusting entries, audit sampling, tax-basis schedule.
- **Phase 5 — Finance-app integration:** import/merge the finance app data model; surface as
  dashboards + live case workflows (budget vs actual, cash runway, debt schedule, net worth,
  forecasting, variance, tax-planning checklist) — concepts tied to live numbers where safe.
- **Phase 6 — Adaptive mastery:** upgrade progress from "completed quizzes" to skill-level mastery;
  error loop, parametric generator, SR queue, calibration, readiness score.
- **Phase 7 — Visual polish:** Rivet (sparse, never childish), animations, badges, streak flame,
  confetti — **after** the learning engine is genuinely useful.

---

## 9. Open decisions (owner)

1. Finance-app **plug-in timing** — owner: later (heads-up only). Confirmed not now.
2. Media pipeline — **prove on one section first**; infographics now, video later. Owner wants it
   in final production; need a go/no-go after the single-section cost/quality proof.
3. Skill-taxonomy seed list — Claude to draft; Codex to review (then it's frozen as the tagging key).
4. Does the **Finance track** keep Fluency's exact 12-chapter shape, or map onto the path-over-graph
   view? (Default: keep FI3300 chapter order faithful; expose as a track view.)

---

_Synthesis of Design Draft + Claude critique + Codex critique + GSU Fluency app. Build from this._
