# Handoff to Codex — Content Authoring Kickoff

> Ken: paste everything between the lines into Codex to start the content engine. Claude keeps this file updated as tasks advance.

---

**You are Codex, the curriculum-content author on the Accountrix CPA/CMA prep app.** Your partner is Claude (app/infra). Read `AGENT_CHARTER.md` for the rules and `docs/CURRICULUM_SPEC.md` for the 48-week CMA blueprint. Read `Ledgerline Reconciliation/MBG_ACCOUNTING_MASTER_BRAIN.md` §1–§7 for the real transactions you must teach through. Study the gold-standard example at `data/curriculum/cma/m4-w2.exemplar.json` — match its depth, structure, and schema exactly.

## Authoring target & format (READ THIS)
- Author **one file per week** at `data/curriculum/cma/m{N}-w{Y}.json`, each a single `Week` object
  conforming to `WeekSchema` in `lib/schemas.ts` — **exactly** like the gold-standard
  `data/curriculum/cma/m4-w2.exemplar.json`. (Do not touch the legacy `data/m*.json` /
  `data/months/` — those are old construction content the gate flags as "legacy v1, non-blocking";
  Claude's assembler stitches your week files into the `curriculum.json` the app renders.)
- **Flashcards use `{front, back}`** and quizzes use `{q, choices[], answer, explain}` with a 0-based
  `answer` index that MUST be `< choices.length`. (The old `{q,a}` flashcard shape is wrong — don't copy it.)
- The gate is live: **`npm run validate:content`** must show `0 blocking errors` for your files.

## Your first task: S1-X1 — Author Month 4 (Cost Management, CMA P1-D)
Produce four files: `data/curriculum/cma/m4-w1.json … m4-w4.json`.
- **w1** — Job-order costing & cost codes → WIP GL (hook: `costCodeMapping.ts`, cost codes → 1401-1405).
- **w2** — WIP schedule & over/under billings → **the exemplar IS w2** (rename `m4-w2.exemplar.json` → `m4-w2.json`, then deepen it).
- **w3** — Job-cost reclass, gross vs net footing (hook: CD Q1→Q2 reclass, net $31,250.00 vs footing $32,650.00).
- **w4** — Overhead allocation, ABC, supply chain, retainage 2120 (hook: labor+burden allocation, PayStream/Apex).

### Each week MUST have
1. `lessonHtml` — 1,200–2,000 words, sanitized HTML, following the 6-part lesson anatomy in the spec (cold open → concept → worked example on MBG numbers → CPA Crossover → practice → recap).
2. `flashcards` — 6–12 `{front, back}` pairs.
3. `quiz` — `{id, title, questions[]}` with 5–10 `{q, choices[], answer, explain}`; `answer` is the 0-based index of the correct choice and MUST be correct; `explain` teaches the *why*.

### Rules
- Label every number **real** (traceable to MBG / the Master Brain) or **illustrative**.
- Honor conventions: JCS not "Ledgerline 100"; no cash labor; entity-segregated; exact amounts.
- Don't invent ASC/IMA citations — use real, correctly-numbered standards.

### When done
1. Run `npm run validate:content` — must report **0 blocking errors** (gate is live at `scripts/validate-curriculum.ts`).
2. Commit to branch `feat/s1-x1-m4`.
3. Add an entry to `REVIEW_QUEUE_CLAUDE.md` (use the template) so Claude audits the accounting + schema.
4. Update `TASKBOARD.md`: move S1-X1 to **Needs Review**.

Then stop and wait for Claude's audit before starting S1-X2 (m1).

---

## Queue after m4
S1-X2 m1 (External Financial Reporting) → S1-X3 m5 (Internal Controls) → S1-X4 m2/m3/m6 → S1-X5 Part 2 (m7–m12). Full hooks per month are in `docs/CURRICULUM_SPEC.md`.
