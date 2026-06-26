# Accountrix Academy — Product Master Plan

> Single source of truth for the unified **Finance → CMA → CPA → CFO** mastery system.
> Synthesizes the Design Draft (HANDOFF.md), Claude's critique, Codex's critique, and the
> existing GSU "Fluency" corporate-finance study app. Both agents build from THIS doc.
> Status: **v2 — 2026-06-25** (pivoted Apply layer to a Fictional CFO Case Universe).

---

## 0. THE CORE RULE (non-negotiable)

**No real company data — anywhere.** Not in curriculum, the case universe, Git, screenshots,
test fixtures, or demos. Use **fictional but realistic** data only. This is permanent product
strategy, not just a privacy guard: a controlled fictional simulator trains transferable
controller/CFO judgment better than analyzing one real company's books.

---

## 1. Vision & thesis

**An applied finance/accounting MASTERY system — a fictional company simulator + exam prep + CFO
decision lab — not a pretty exam-prep clone.** It trains **three overlapping competencies**:

1. **Exam mastery** — CMA first (12–18 mo), then CPA. Blueprint-weighted, exam-mode timing,
   weak-topic review, TBS/essay/calculation drills, readiness scoring.
2. **Controller execution** — the weekly real work: WIP schedules, over/under billing, bank recs,
   month-end close, AP/AR aging, payroll burden, insurance certs, debt schedules, internal
   controls, financial-statement prep, CPA/lender packet review.
3. **Junior-CFO judgment** — decision reps: cash forecasting, covenant monitoring, lender
   conversations, bonding capacity, insurance risk, pricing/margin, capital budgeting, tax
   planning, scenario planning, board/owner reporting, and "what would you say to the
   CPA/lender/insurance agent?" simulations.

The user learns a concept, proves it on graded work (Excel/TBS), and applies it to **realistic
fictional case companies**. The moat is **"learn it → do CFO-grade reps in a safe simulator,"**
powered by a **skill graph**, not badges. Optimize for **speed-to-competence**: less passive
content, more high-value reps, more CFO artifacts, more lender/CPA/insurance sims. Single serious
user (no monetization/multi-tenant). One study app, not two.

---

## 2. The two-layer architecture

- **LEARN** — the Academy curricula: **Finance / CMA / CPA** tracks, shared XP/streak/profile,
  Study vs Exam mode. (Exists: 59 CPA lessons + 12 CMA months live; Finance ported from GSU — §5.)
- **APPLY** — a **Fictional CFO Case Universe (§10)**: clean, reusable, privacy-safe fictional
  operating datasets (flagship **Meridian Building Group**). NOT a separate tab and NOT real data
  — the case files are the _practice target_ of the learning loop. Every lesson can end with
  "now do it on the case file → produce the lender/CPA-ready artifact."

The bridge between Learn and Apply is the **Skill Graph (§3)**.

---

## 3. The Skill Graph — the spine (adopt from Codex)

Every artifact — lesson, quiz item, flashcard, TBS, Excel drill, case workflow — is **tagged to
one or more skills**. Cheap now, expensive to retrofit, so we tag content as we author it.

Example skills: `asc606-revenue`, `wip-schedule`, `over-under-billing`, `bank-rec`,
`cash-forecasting`, `ratio-analysis`, `tvm`, `npv-irr`, `capital-budgeting`, `dcf-valuation`,
`audit-evidence`, `tax-basis`, `excel-xlookup`, `excel-npv`, `controls-segregation`,
`consolidation-eliminations`, `covenant-monitoring`, `bonding-capacity`.

Unlocks: **weak-skill targeting** ("revenue-recognition estimates is weak → this lesson, this TBS,
this Excel drill, this case workflow"); the **Finance/CMA/CPA crosswalk** (one concept across tracks

- the real workflow — e.g. NPV → Finance capital budgeting → CMA → CPA BAR DCF → investment-memo
  workflow → DCF Excel drill → project-selection TBS); and **defensible readiness (§4)** + **adaptive
  review (§6)**. The path map becomes a **view over the skill graph**, dissolving the "12×4 for every
  track is artificial" problem.

---

## 4. CFO-Readiness model (replaces the vanity "CFO Ready" badge)

Measurable readiness across CFO domains, rolled up from skill mastery: **cash flow · close ·
controls · tax · audit · Excel/modeling · forecasting · reporting · decision analysis.** "CFO
Ready" tier = thresholds met across domains.

**Exam-readiness score (defensible, not a fake %):** weighted from `recency · accuracy ·
time-per-item · confidence calibration · simulation performance · blueprint topic weighting ·
spaced-repetition decay`. (Fluency already has confidence calibration + error tagging to seed this.)

---

## 5. Content (PRIORITY — "dial in content before app functionality")

- **CPA** — authored now by the Claude×Codex loop. 15 units / 59 lessons live (FAR×5, AUD×3,
  REG×4, BAR×3); ISC + TCP next. ≥1,200 words, 7-Q quiz, 8 flashcards, Codex-audited. **Loop runs.**
- **CMA** — 12 months × 4 weeks live (`data/curriculum.json`). CMA is the **timeline priority**
  (sat first), so daily-plan logic leads with CMA.
- **Finance** — **port from the GSU "Fluency" app** (`OneDrive/Apps/GSU/.../Study App`):
  **FI3300 Corporate Finance** (TVM, statements & cash flow, stocks & bonds, capital budgeting &
  WACC; THPS sets, master study guide, podcasts). **Keep chapters/THPS/quizzes/tests identical**
  (owner is retaking the class) — clean-up only, no answer changes.

**Author-time rules:** tag every artifact to skill(s); pair lessons with infographics/diagrams
(build now); keep quiz/TBS schema engine-ready (cell-graded). **All fictional data only (§0).**

---

## 6. Feature inventory — KEEP / ADOPT / CUT / DEFER

**KEEP:** track/mode separation; Blueprint + Safety-Orange identity; 6 XP tiers; streak/hearts/
badges (motivation, not core); BA II Plus TVM calculator; licensing roadmap; read-aloud.

**ADOPT from GSU Fluency (proven mechanics, generalize across tracks):** error-tag dashboard →
**"explain my mistake" loop** (concept gap / formula-math / misread / JE-direction / tax-exception /
audit-assertion / time-pressure → targeted review); **parametric problem generator**; **confidence
calibration**; **spaced-repetition queue**; **tutor-with-memory** → context-aware **Ask Rivet**;
**calculator keystroke drawer**; **tap-to-reveal "why each wrong"**; **exam-simulation mode**.

**CUT:** live human tutor 1:1 booking + video-call sessions (owner: cut → invest in Ask Rivet);
social/study-buddy/cohort (multi-user; out of scope).

**DEFER (right idea, prove first):** AI media pipeline (NotebookLM video + ElevenLabs) — owner wants
infographics + video in final production; **infographics/diagrams now**, **video/narration as a
production phase after proving pipeline + storage + review gate + per-asset cost on one section**;
Apple Pencil notebook (local tool, behind the engine); tablet/desktop layouts (sequenced with §7).

---

## 7. Desktop-first for the power features

Mobile = watch/quiz/queue-the-drill/review. **Desktop = do the real work** (Excel trainer, finance
dashboards, simulations, modeling, reconciliations, TBS exhibits, case workflows). Cross-device
handoff ("continue on desktop") required.

---

## 8. Reconciled build order (content-first + skill-graph-now, engine after)

- **Phase 0 — CONTENT + SKILL GRAPH + CASE SEED (NOW, ongoing):** CPA loop runs; port Finance from
  GSU; confirm CMA; **define the skill taxonomy + tag artifacts**; pair lessons with infographics;
  **seed the flagship case (Meridian Building Group) + the first Apply workflow (WIP).**
- **Phase 1 — Design-system migration:** port tokens/type/nav/track-mode shell onto the existing
  Next.js app. Do not skin/clone wholesale.
- **Phase 2 — Unified track model:** content loaders make Finance/CMA/CPA + case workflows
  first-class over the skill graph.
- **Phase 3 — Mission Control:** daily plan (CMA-first) · weak-skill queue · case/CFO-workflow of
  the day · exam-objective mapping. (Replaces generic Home.)
- **Phase 4 — Excel/TBS engine (the moat):** ONE reusable cell-graded grid engine. Seeds: WIP,
  bank rec, bond amortization, lease schedule, DCF, depreciation, ratio analysis, adjusting
  entries, audit sampling, tax-basis schedule.
- **Phase 5 — Case Universe build-out:** expand companies + per-company datasets + workflows (§10).
- **Phase 6 — Adaptive mastery:** skill-level mastery, error loop, parametric generator, SR queue,
  calibration, readiness score.
- **Phase 7 — Visual polish:** Rivet (sparse), animations, badges, streak flame, confetti — after
  the engine is useful.

---

## 9. Open decisions (owner)

1. Finance-app real-data plug-in: **dropped** — replaced by the fictional Case Universe (§0/§10).
2. Media pipeline: prove on one section first; infographics now, video later — go/no-go after proof.
3. Skill-taxonomy seed: Claude drafts → Codex reviews → freeze as the tagging key.
4. Flagship case name: **Meridian Building Group** (matches the 59 CPA lessons) vs "Mason Bridge
   Group." Default Meridian unless owner prefers otherwise.

---

## 10. The Fictional CFO Case Universe

A set of **fictional but realistic** companies with clean, reusable, internally-consistent
operating datasets. Lessons/TBS/Excel drills/CFO sims all draw from them. **No real data (§0).**

**Companies (seed roster):**

- **Meridian Building Group (MBG)** — flagship general contractor, Riverton; owner Jordan Reed.
  (The exact company the CPA curriculum already references.)
- **Riverton Development LLC** — real-estate project entity (for project-finance/JV cases).
- **Bluebeam Builders** — smaller GC (scale/contrast cases).
- **Northstar Services Inc.** — non-construction service company (for finance examples that aren't
  construction-specific).

**Per-company dataset modules** (build incrementally): company profile · chart of accounts · trial
balance · job-cost detail · WIP schedule · AP aging · AR aging · debt schedule · insurance/bonding
docs · payroll/burden table · bank activity · budgets/forecasts · tax facts · audit exhibits ·
board/lender packet. **Every module must tie** (the TB balances; the WIP reconciles to the GL).

**Apply Workflow Engine — reusable schema** (`data/cases/<company>/workflows/<id>.json`):

```
{ id, title, company, skills[],
  competency: "exam" | "controller" | "cfo",
  scenario,                       // the situation prompt
  exhibits[],                     // source data the learner is given
  tasks[ { id, prompt, type: "calc"|"select"|"je"|"writeup",
           input, expected, tolerance, explanation } ],
  gradingRules,                   // exact/tolerance/keyword
  outputArtifact,                 // the CFO-ready deliverable produced
  conversationSim? }              // optional lender/CPA/insurance/owner Q&A
```

**Lesson → workflow linkage:** a lesson ends with up to three doors — _Practice_ (fictional exam
problem) · _Apply_ (the case-file workflow) · _Communicate_ (the CFO conversation sim).

**CFO Conversation Sim** (high value for the controller/CFO seat): the learner drafts the answer to
a stakeholder, graded on correctness + clarity. e.g. "A lender asks why underbillings increased —
draft the answer." / "The CPA asks why retainage is current — respond." / "The owner asks why cash
is tight despite profit — explain WIP/cash timing."

**Flagship workflow (reference implementation):** _Month 4 / WIP_ on Meridian Building Group —
Learn (cost-management lesson) → Practice (CMA/CPA-style WIP TBS) → Apply (build the WIP schedule
from job-cost exhibits) → Output (over/under-billing schedule + reclassification JE + lender
explanation). See `data/cases/meridian-building-group/`.

---

_Synthesis of Design Draft + Claude critique + Codex critique + GSU Fluency app + the Case-Universe
pivot. Build from this. No real data — ever (§0)._
