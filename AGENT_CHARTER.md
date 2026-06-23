# Accountrix — Agent Charter (Claude × Codex)

**Project:** Accountrix CPA/CMA Exam-Prep App
**Owner:** Jordan A. Reed — Construction CFO (MBG / Green River Building)
**Goal:** A study app that teaches Ken the CMA (now) then CPA (next) **through his own real MBG transactions**, so he knows accounting "like his ABCs." Built on the existing Next.js 15 app; modeled on the `Finance App` (FastAPI + Next.js) build pattern.
**Canonical context file:** `Ledgerline Reconciliation/MBG_ACCOUNTING_MASTER_BRAIN.md` (§7 = the curriculum spine). Read it before authoring content.

---

## Two agents, two lanes

### 🟦 Claude — App / Infrastructure / Data Integrity
Owns everything that is **code, schema, build, and integration**:
- Data model & track architecture (CMA track now; CPA track refactor next).
- `lib/schemas.ts`, `lib/curriculum.ts`, `lib/content-loader.ts`, routes under `app/learn`, `app/quiz`.
- Integrating salvaged components: `AskAIOverlay`, `costCodeMapping`, professional financial-statement components, exam simulators (`_salvage/`).
- Content **validation tooling** (`npm run validate:content`) so every Codex-authored file is schema-checked.
- Build/test/CI, cleanup, dependency hygiene, performance.
- **Audits Codex's content** for accounting accuracy, exam-blueprint fidelity, and schema conformance.

### 🟩 Codex — Curriculum Content Authoring
Owns everything that is **lesson content**:
- Authors the 48 CMA weeks (`lessonHtml`, `flashcards`, `quiz`) to the schema in `lib/schemas.ts`.
- Follows `docs/CURRICULUM_SPEC.md` exactly — section weights, subtopics, and the **MBG transaction hook** for each week.
- Mines salvaged assets for source material: `data/cpa/modules/`, `data/cpa/content/` (2,580 items + labs), `data/knowledge/professor/` (217 files), `data/cfo/`.
- **Audits Claude's code** for bugs, broken routes, schema drift, and rendering errors.

> Lanes are firm but not walls. If you must touch the other lane to unblock yourself, log it on the TASKBOARD and file a heads-up in the other's review queue.

---

## The mutual-audit protocol (LAW)

**Nothing is "Done" until the other agent signs off.** Workflow per task:

1. **Claim** — move the task to `In Progress` on `TASKBOARD.md` with your name + timestamp.
2. **Build** — do the work on a feature branch (`feat/<task-id>`). Never commit straight to `main`.
3. **Self-check** — run the relevant gate:
   - Code: `npm run type-check && npm run lint && npm run test:run`
   - Content: `npm run validate:content` (must be ALL PASS, zero schema errors).
4. **Request review** — move to `Needs Review`; file an entry in the **other** agent's queue
   (`REVIEW_QUEUE_CLAUDE.md` if Codex wrote it; `REVIEW_QUEUE_CODEX.md` if Claude wrote it)
   with: task id, branch, what changed, what to check, how to verify.
5. **Audit** — the reviewer verifies against this checklist (below), then either:
   - ✅ **Approve** → move task to `Done`, note the approval.
   - 🔴 **Reject** → write specific findings (file:line, the wrong number, the failing step) back in the queue; task returns to `In Progress`.
6. **Re-audit** until clean. Approver merges.

### Accounting-accuracy audit checklist (for content)
- [ ] **Numbers tie.** Every figure traces to a real MBG source (Trial Balance is the anchor; bank beats GL) or is clearly labeled "illustrative."
- [ ] **Exam-blueprint fidelity.** Topic, subtopic, and emphasis match the IMA CMA blueprint (Part/Section/weight in `CURRICULUM_SPEC.md`).
- [ ] **Conventions respected** (from Master Brain §6): JCS not "Ledgerline 100"; no cash labor; entity-segregated (MBG vs Riverton); exact amounts, `variance_tolerance = 0.0`.
- [ ] **Quiz integrity.** `answer` index is correct and < number of choices; `explain` teaches *why*, not just restates.
- [ ] **Schema conformance.** Validates against `lib/schemas.ts` (4 weeks/month, week id `w1–w4`, etc.).
- [ ] **No hallucinated GAAP/IMA citations.** ASC/standard references are real and correctly numbered.

### Code audit checklist (for app changes)
- [ ] Type-check, lint, unit tests, and (where relevant) Playwright e2e pass.
- [ ] No schema drift — content authored to the old shape still loads.
- [ ] Routes render; no console errors; mobile nav intact.
- [ ] No secrets committed; env-var driven.

---

## Files in this governance system
| File | Purpose |
|---|---|
| `AGENT_CHARTER.md` | This file — lanes + audit protocol. |
| `TASKBOARD.md` | Live sprint board. Single source of "who's doing what." |
| `REVIEW_QUEUE_CLAUDE.md` | Things **Claude** must audit (Codex's output). |
| `REVIEW_QUEUE_CODEX.md` | Things **Codex** must audit (Claude's output). |
| `docs/CURRICULUM_SPEC.md` | The 48-week CMA spine + CPA phase-2 plan, mapped to MBG transactions. |
| `docs/design/` | Salvaged future-feature specs (AI professor, camera vision, audio). |
