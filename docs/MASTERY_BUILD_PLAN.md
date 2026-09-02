# Accountrix Mastery Build Plan

## CMA credential spine · finance-degree depth · applied controller/CFO reps

**Repo:** https://github.com/kennybhill7/AccountrixCPA-App
**Owner:** Kenneth B. Hill Jr.
**Created:** 2026-09-01
**Supersedes:** `docs/CFMS_TRACK_PLAN.md` (deleted — CCIFP anchor abandoned)

---

## 0. Decisions

| #   | Decision                                                                                                                                                                         | Rationale                                                                                                                                                                                                                                                                      |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| D1  | **CMA is the credential.** CCIFP is dropped entirely.                                                                                                                            | CMA is portable across industries and employers; CCIFP is only legible inside construction and requires industry tenure to sit for. If CMA is earned, CCIFP adds little.                                                                                                       |
| D2  | `/finance` (GSU FI3300 port, 12 weeks) stays as the foundation layer and is **extended**, not rewritten.                                                                         | It is the prerequisite for everything else and product policy requires class parity on it.                                                                                                                                                                                     |
| D3  | **Fictional data only** (PRODUCT_MASTER_PLAN §0 stands). Case companies mirror real _structure_, never real numbers.                                                             | Repo stays publishable.                                                                                                                                                                                                                                                        |
| D4  | The construction/controller material is **not a credential track**. It becomes an applied-reps layer tagged to the CMA skill graph, so job work raises the CMA readiness number. | One study loop, not three competing ones.                                                                                                                                                                                                                                      |
| D5  | **Graduate from GSU in data analytics. No transfer, no finance electives** (none available in the current schedule).                                                             | CMA certification takes a bachelor's in any field. A transfer costs credits, semesters, and interest on $162K of debt while income stays flat. Data analytics is the scarcer half of the profile — every controller candidate has a finance degree; few can build the toolkit. |
| D6  | **Credential order: CMA → CFE. CPA deferred, revisit in ~2 years.**                                                                                                              | Forensic and litigation-support work are not attest services and do not legally require a CPA. CFE credentials the work directly in 6–12 months against 3–5 years for a CPA. The revenue constraint on forensic work is a business arrangement, not a license.                 |
| D7  | Add **Pillar 4 — Forensic & Litigation Support** (§6).                                                                                                                           | An engagement already performed at professional standard proves the capability. It is also the fastest independent-revenue path, and it reuses the 498 already-authored AUD items.                                                                                             |

---

## 1. The audit that changed the plan

Measured against the live `data/curriculum.json`, `data/cpa/items.json`, and `data/essays/` on 2026-09-01.

### 1.1 The CMA track is a well-built outline, not a course

| Measure                            |  Actual | What CMA prep actually takes                                         |
| ---------------------------------- | ------: | -------------------------------------------------------------------- |
| Lessons, both parts                |      48 | —                                                                    |
| Total lesson words, both parts     |  59,756 | Commercial texts run ~1,200 pages **per part**                       |
| Average words per lesson           |   1,244 | —                                                                    |
| Practice questions, both parts     | **337** | Commercial banks ship **~2,000 per part**                            |
| Flashcards                         |     384 | —                                                                    |
| Essay scenarios                    |   **4** | Essays are **25% of the exam score**; each part exam has 2 scenarios |
| Lessons below the 1,200-word floor |       0 | Floor is met — depth ceiling is the problem, not the floor           |

The structure is sound and the gate is being met. The volume is roughly **5–15% of a real CMA course**, and the practice bank is the sharpest shortfall: 337 questions cannot produce a defensible readiness score for a 100-MCQ exam per part.

### 1.2 Content allocation ignores the blueprint weights the app already knows

`lib/examSections.ts` encodes IMA's real section weights — Part 2 C (Decision Analysis) at 25%, Part 2 D (Risk Management) at 10%. But `data/curriculum.json` gives **every** section exactly one month of four weeks. Decision Analysis and Risk Management get identical shelf space at 2.5× different exam weight.

Consequence: the readiness engine and the content supply disagree. The fix is _not_ to re-cut the 48-week calendar — it is to weight the **item bank and drill mix** by blueprint, which is what actually drives the readiness number.

> **Verify before building:** the weights currently in `examSections.ts` must be checked against IMA's current published Learning Outcome Statements. Do not ship a readiness percentage on unverified weights.

### 1.3 The crosswalk the product plan promises does not exist

All **2,081 CPA practice items carry zero `skills` tags** (`FAR 617 · AUD 498 · REG 498 · BAR 348 · ISC 60 · TCP 60`). Without tags:

- weak-skill targeting cannot route a CPA item to a CMA weakness,
- the Finance↔CMA↔CPA crosswalk in PRODUCT_MASTER_PLAN §3 is inert,
- and **BAR's 348 items — the section that overlaps CMA most heavily** (financial analysis, forecasting, capital budgeting, cost accounting) — cannot feed CMA readiness at all.

Tagging that bank is the single highest-leverage task in this plan. It converts 348 already-written, already-audited items into CMA practice for the cost of a tagging pass.

### 1.4 Carried forward from the prior audit

- `app/finance/[unitId]/page.tsx` does not exist; unit-level URLs should 404. Confirm against a running app, then fix.
- `WeekSchema` caps week ids at `w1–w4`; any new unit is exactly ≤4 weeks.
- `docs/SKILL_TAXONOMY.md` is frozen v1 — additions allowed, renames forbidden.

---

## 2. Three pillars

```
PILLAR 1  CMA — the credential            → make /learn a real course
PILLAR 2  Finance depth — the degree gap  → extend /finance beyond FI3300
PILLAR 3  Applied reps — the job          → construction controller/CFO lab
PILLAR 4  Forensic & litigation support   → the independent-revenue path
                                             all three tagged to CMA skills
```

Pillars 2–4 are not additional credentials. Every artifact in them carries CMA skill tags, so a WIP schedule rep raises the Part 1-D cost-management number, a covenant test raises Part 2-A, and a claims-register tie-out raises Part 1-E internal controls.

**Scope cut (2026-09-02):** Pillar 2 drops from six units to three. Build **F7 credit analysis**, **F5 valuation & modeling**, **F4 capital structure & payout**. Defer F6 portfolio theory, F8 derivatives, F9 international — interesting, near-zero transfer to a construction CFO, and deferring them buys roughly four months.

---

## 3. Pillar 1 — Make the CMA credential real

**Priority: highest. This is the credential.**

| Workstream                           | Target                          | Notes                                                                                                                                                                                                                                      |
| ------------------------------------ | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **1A · Item bank**                   | **2,000+ CMA items**            | ~600 authored, blueprint-weighted; the rest from parametric variants. The engine already exists (`lib/parametric.ts`, `lib/parametricMcq.ts`) and generates unlimited variants from a generator — this is the cheapest volume in the plan. |
| **1B · Tag the CPA bank**            | 2,081 items tagged              | Unlocks BAR's 348 items as CMA practice and turns on the crosswalk. Do this first — it is a tagging pass over existing audited content, not authoring.                                                                                     |
| **1C · Lesson depth**                | 1,244 → **~2,800 words/lesson** | Deepen in place; keep the 48-slot calendar. Add worked examples with full arithmetic, a "trap" box per lesson, and IMA-style terminology. Roughly doubles total content to ~135k words.                                                    |
| **1D · Essays**                      | 4 → **24 scenarios**            | Two per blueprint section, 30 minutes each, graded by the existing `lib/narrativeGrading.ts`. Essays are 25% of the score and are currently 1.7% of the app.                                                                               |
| **1E · Blueprint-weighted drilling** | Mix follows IMA weights         | Fixes the §1.2 mismatch without re-cutting the calendar. Verify weights first.                                                                                                                                                             |
| **1F · Part-level mock exams**       | 2 full mocks per part           | 100 MCQ + 2 essays, 4 hours, exam timing. `/exam` already exists.                                                                                                                                                                          |

---

## 4. Pillar 2 — The finance-degree gap

**What a BBA Finance covers in years 3–4 that FI3300 did not.** Six units × 4 weeks = 24 lessons, extending `/finance` from Unit 4 onward. The build script already supports arbitrary unit counts.

| Unit   | Title                             | Weeks                                                                                                                                                                                          |
| ------ | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **F4** | Capital Structure & Payout Policy | MM propositions and their assumptions · trade-off and pecking-order theories · agency costs and the CFO's real constraints · dividends, buybacks and signaling; leasing vs owning              |
| **F5** | Valuation & Financial Modeling    | The three-statement model that actually balances · DCF, terminal value and what breaks it · comparable-company and precedent-transaction analysis · sensitivity, scenario and the honest range |
| **F6** | Investments & Portfolio Theory    | Market efficiency and what it does not claim · portfolio construction, the efficient frontier · factor models beyond CAPM · performance measurement and attribution                            |
| **F7** | Fixed Income & Credit Analysis    | Duration, convexity and rate risk · the term structure and what it predicts · **credit analysis from the lender's side of the table** · ratings, spreads and covenants as priced risk          |
| **F8** | Derivatives & Hedging             | Forwards and futures · options and the payoff logic · swaps and interest-rate hedging · what hedge accounting requires and why it is refused                                                   |
| **F9** | Advanced & International          | Real options in capital budgeting · M&A analysis, synergies and the winner's curse · FX exposure — transaction, translation, economic · distress, restructuring and the going-concern call     |

**F7 is the one to build first.** Credit analysis from the lender's side is simultaneously a degree-gap topic, a CMA Part 2-A topic, and the exact skill that improves every lender conversation in the day job.

---

## 5. Pillar 3 — Applied controller/CFO reps

The construction material from the prior plan, retained but **re-anchored to CMA skills** rather than a CCIFP blueprint. Route: `/cfo`. Twelve units, ordered by combined CMA leverage and job urgency.

| Priority | Unit                                                                  | Reinforces (CMA)                               |
| -------- | --------------------------------------------------------------------- | ---------------------------------------------- |
| **P0**   | WIP, percent-complete, over/under billing, gross-profit fade          | P1-D Cost Management · P1-A External Reporting |
| **P0**   | Month-end close, cutoff controls, GL-vs-TB tie-out, AP discipline     | P1-E Internal Controls                         |
| **P0**   | Multi-entity: clearing vs elimination, consolidation, the CPA package | P1-A External Reporting                        |
| **P0**   | Budgeting, the development pro forma, schedule→draw→cash, backlog     | P1-B Planning & Budgeting                      |
| **P1**   | Treasury: 13-week cash forecast, working capital, retainage           | P2-B Corporate Finance                         |
| **P1**   | Debt & lenders: loan sizing, borrowing base, covenant testing         | P2-A Financial Statement Analysis              |
| **P1**   | Risk: insurance program, workers' comp and EMR, COI review, surety    | P2-D Risk Management                           |
| **P2**   | Labor: job costing, burden rate, certified payroll                    | P1-D Cost Management                           |
| **P2**   | Systems: ERP architecture, COA crosswalks, migration, export traps    | P1-F Technology & Analytics                    |
| **P2**   | Decision analysis: pricing, make-vs-buy, project go/no-go             | P2-C Decision Analysis                         |
| **P3**   | Contractor tax methods, IRC 460, look-back                            | — job value only                               |
| **P3**   | Contracts and legal: contract types, lien rights, pay-if-paid         | — job value only                               |

Case universe, simulators and generators are unchanged from the prior plan and are specified in §4–§5 of the superseded `CFMS_TRACK_PLAN.md` content, retained here by reference:
six-entity Meridian Group with a clearing account, mirrored IC pairs, a mid-migration entity, split payroll channels, a 147-lot horizontal development and a 103-unit BTR build in twelve sequences, plus deliberately seeded data traps.

---

## 6. Pillar 4 — Forensic & Litigation Support

**Route:** `/forensic`. Serves CMA (Part 1-E internal controls, Part 2-D risk), CFE preparation, and paid engagement work simultaneously.

### 6.1 Why it is cheap to build

Three assets already in the repo converge on it:

- **498 AUD items**, already authored and audited, currently untagged and used only for CPA practice. Tag them and they become the evidence, sampling, and procedures foundation for both forensic work and CFE prep.
- **`lib/narrativeGrading.ts`**, which already grades distinct-concept coverage with an anti-stuffing prose gate — exactly what a forensic writeup or a cross-examination answer needs.
- **Review Mode** (§7), where the core skill is detecting a seeded defect in a finished workpaper. That _is_ the forensic skill. It now serves all four pillars, which settles it as build task #1.

### 6.2 The method the track teaches

Six controls, drawn from an engagement performed to this standard and generalized:

1. **Claims register before analysis.** Every asserted figure is entered with its asserted source before any independent work begins. Nothing is accepted because it appears in an opposing schedule.
2. **One primary-source receipt per closed row.** Internal consistency is not evidence. A figure that computes perfectly from other asserted figures, with no document behind any of them, is unsupported — not verified.
3. **Four-tier evidence labeling.** `primary-source` · `party-annotation` (institution proves date and amount, a party supplies attribution) · `legal-premise` (arithmetic correct _if_ a characterization holds; show it both ways) · `not-produced` (state it, do not estimate around it).
4. **Independent adversarial pass** working from primary evidence, not the first analyst's workpapers, whose only assignment is to break the package.
5. **Disclosure against interest.** An adverse correction is stated in the summary body with its mechanism and its boundary. A correction the other side finds first destroys every unchallenged number in the package.
6. **Written as a money narrative,** not a workpaper. Bottom line first; equal-split items flagged immediately as items that do not move the gap; evidence mechanics moved out of the body; no audit or legal jargon.

### 6.3 Built (2026-09-02)

`data/cases/whitfield-dissolution/` — fully fictional dissolution matter with an operating-company sale. Case profile plus two graded workflows:

| Workflow                 | Tasks | Teaches                                                                                                                                                                                                                          |
| ------------------------ | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `claims-register-tieout` | 10    | Prove or break eight asserted figures. Five pass; three fail — one _not produced_, one overstated on a single leg, one with an understated population. Ends with an adverse-disclosure writeup and an attorney conversation sim. |
| `evidence-tiering`       | 4     | Classify eight items into the four tiers, resolve a portal-vs-statement conflict, and write the plain-language qualifier that survives cross-examination.                                                                        |

Arithmetic verified: balance sheet foots to the stated net divisible estate and half share; the brokerage roll-forward ties to its stated ending value; every cross-file figure agrees between `case.json` and both workflows. Sanitization scan clean — no real name, entity, institution, account identifier, matter date, or dollar figure appears in any file.

### 6.4 Still to build

`population-correction` · `retirement-trueup-gap` · `net-not-drawn-back` · `marital-balance-sheet` · `document-request-drafting` · `cross-examination-sim` — plus a CFE-blueprint mapping once the ACFE domain list is verified.

---

## 7. Revised agent grid

Same seven lanes and the same mutual-audit law from `AGENT_CHARTER.md`, with the money-math prosecution signature retained. The **sequence** changes: Pillar 1 goes first.

### Wave 0 — Foundation (serial)

| ID      | Lane | Task                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `M-0.0` | D    | **Review Mode v1** — a finished, plausible, subtly-wrong workpaper is presented and the defect must be found before sign-off. Seeded-defect library from real scar tissue: a footing that does not tie, an allocation denominator that double-counts, a summary cell pointing at the wrong range, a clearing account that does not net to zero, a percent-complete taken on revenue instead of cost, a non-cumulative ending-balance column, a variance that is a false positive from suppressed zero-balance rows. Build on copies of the 11 existing workflows. **Serves all four pillars — build first.** |
| `M-0.1` | E    | **Tag the 2,081 CPA items** with canonical skills. Highest leverage in the plan; turns on the crosswalk, unlocks BAR for CMA and AUD for Pillar 4.                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `M-0.2` | A    | Verify IMA Part 1 / Part 2 weights against current published LOS; reconcile with `examSections.ts`. No readiness % until done.                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `M-0.3` | A    | Schema v2 (additive: `drills`, `applyWorkflow`, `artifact`, `stakeholder`), validator extension                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `M-0.4` | A    | Fix `/finance/[unitId]`; scaffold `/cfo` route family                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `M-0.5` | E    | Skill taxonomy v2 additions (additive only)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `M-0.6` | G    | Privacy denylist wired into CI                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

### Wave 1 — CMA volume (the credential)

| ID      | Lane | Task                                                                      |
| ------- | ---- | ------------------------------------------------------------------------- |
| `M-1.1` | E    | CMA parametric generators — the blueprint-weighted spine of the item bank |
| `M-1.2` | B    | Authored CMA items, batch 1 — Part 1 A–C                                  |
| `M-1.3` | B    | Authored CMA items, batch 2 — Part 1 D–F                                  |
| `M-1.4` | B    | Authored CMA items, batch 3 — Part 2 A–C                                  |
| `M-1.5` | B    | Authored CMA items, batch 4 — Part 2 D–F                                  |
| `M-1.6` | G    | Prosecute every answer key in Wave 1                                      |

### Wave 2 — CMA depth

| ID      | Lane | Task                                                                |
| ------- | ---- | ------------------------------------------------------------------- |
| `M-2.1` | B    | Deepen Part 1 lessons (m1–m6) to ~2,800 words with worked examples  |
| `M-2.2` | B    | Deepen Part 2 lessons (m7–m12) to ~2,800 words with worked examples |
| `M-2.3` | B    | 24 essay scenarios, 2 per section                                   |
| `M-2.4` | E    | Blueprint-weighted drill mix; part-level mock exams                 |
| `M-2.5` | D    | Essay player and grading UI hardening                               |
| `M-2.6` | G    | Prosecute depth + essay rubrics                                     |

### Wave 3 — Finance depth (the degree gap)

| ID      | Lane | Task                                                                                                           |
| ------- | ---- | -------------------------------------------------------------------------------------------------------------- |
| `M-3.1` | B    | **F7 Fixed Income & Credit Analysis** (build first)                                                            |
| `M-3.2` | B    | F5 Valuation & Financial Modeling                                                                              |
| `M-3.3` | B    | F4 Capital Structure & Payout Policy                                                                           |
| `M-3.4` | B    | Pillar 4 — forensic workflows batch 2 (`population-correction`, `retirement-trueup-gap`, `net-not-drawn-back`) |
| `M-3.5` | E    | Finance-depth generators                                                                                       |
| `M-3.6` | G    | Prosecute                                                                                                      |

> F6 portfolio theory, F8 derivatives and F9 international are **deferred** per the §2 scope cut.

### Wave 4 — Applied P0 + forensic depth

| ID      | Lane | Task                                                                                                                  |
| ------- | ---- | --------------------------------------------------------------------------------------------------------------------- |
| `M-4.1` | C    | Meridian Group fixtures                                                                                               |
| `M-4.2` | B    | Pillar 4 — forensic workflows batch 3 (`marital-balance-sheet`, `document-request-drafting`, `cross-examination-sim`) |
| `M-4.3` | E    | Tag the 498 AUD items to forensic/CFE skills; verify the ACFE domain list                                             |
| `M-4.4` | B    | Applied P0 units — WIP/fade, close/controls, multi-entity, budgeting                                                  |
| `M-4.5` | D    | WIP worksheet, SOV/G702 builder, pro forma builder, draw-to-cash                                                      |
| `M-4.6` | G    | Prosecute fixtures and money math                                                                                     |

### Wave 5 — Applied P1–P2 + integration

| ID      | Lane | Task                                                                    |
| ------- | ---- | ----------------------------------------------------------------------- |
| `M-5.1` | B    | Applied P1 units — treasury, debt/lenders, risk                         |
| `M-5.2` | B    | Applied P2 units — labor, systems, decision analysis                    |
| `M-5.3` | D    | Cash forecast, borrowing base, covenant tester, consolidation worksheet |
| `M-5.4` | C    | Apply workflows                                                         |
| `M-5.5` | F    | Full integration — planner, mission, diagnostic, tutor, map             |
| `M-5.6` | G    | Final prosecution + privacy sweep + release gate                        |

**~37 tasks, 6 waves, 6 concurrent builders per wave.** Waves are hard barriers.

---

## 8. Not done

- **IMA weights unverified.** `M-0.2` blocks any displayed readiness percentage.
- **No effort estimate** on the 36 tasks. Add one before promising a date.
- **The existing 11 Apply workflows have never been prosecuted.** Their keys are assumed correct.
- **`/finance/[unitId]` 404 is inferred from a directory listing**, not a failed request.
- **Item-bank target of 2,000+ is a judgment call**, benchmarked against commercial CMA courses, not against a measured pass-rate study. Treat it as a floor to aim at, not a proven threshold.
