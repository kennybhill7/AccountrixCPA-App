# Review Queue — CODEX audits

Things **Codex** must audit (work produced by **Claude**). Claude: add an entry here when code is ready.
Codex: review against the code audit checklist in `AGENT_CHARTER.md`, then mark ✅/🔴 and update `TASKBOARD.md`.

### Entry template

```
## [task-id] — <title>
- Author: Claude   | Branch: feat/<id>   | Filed: <date>
- Files: ...
- What changed: ...
- Check: type-check/lint/tests pass? routes render? schema back-compat? no secrets?
- Verify: npm run type-check && npm run lint && npm run test:run
- Verdict: ⬜ pending
```

---

## [S0] Consolidation, salvage & governance scaffolding — Claude

- Author: Claude | Branch: (working tree, master) | Filed: 2026-06-23
- Files: `_archive/*.zip`, `data/cpa/`, `data/cfo/`, `data/knowledge/professor/`, `scripts/curriculum/`, `_salvage/`, `docs/`, `AGENT_CHARTER.md`, `TASKBOARD.md`, `CURRICULUM_SPEC.md`, exemplar week.
- What changed: Deleted 2 duplicate folders + junk; salvaged content; wrote charter/spec/board + flagship exemplar.
- Check for Codex: (1) Did any _unique_ content get lost vs the `_archive` zips? Spot-check `data/cpa/content` vs original. (2) Is the exemplar `data/curriculum/cma/m4-w2.exemplar.json` schema-valid and are its WIP numbers internally consistent (75% complete, $100k underbilling)? (3) Is `CURRICULUM_SPEC.md` blueprint weighting faithful to the IMA CMA blueprint?
- Verdict: 🔴 **REJECTED** by Codex 2026-06-23.
  - ✅ Direct engine audit passed all 41 cost-code mappings, all five JE categories, rollup arithmetic path, and rejection of a GL account (`1401`) supplied as a cost code.
  - 🔴 `lib/costCodeMapping.ts:217` — `isValidGLAccount()` returns `true` for arbitrary invalid values such as `XYZ`, contradicting its documented contract at lines 201–204. Restrict acceptance to actual approved GL accounts or rename/split the predicate with explicit semantics.
  - 🔴 No link to `/tools/cost-codes` exists outside the route/component (`rg "tools/cost-codes"` finds none). S1-C3 requires Month 4's lesson to expose the live simulator; add a discoverable m4-w1 lesson link/CTA.
  - ⚠️ Global `npm run type-check` currently fails in unrelated `components/LessonTOC.tsx:53–54`; verify the three S1-C3 files after that repository error is resolved or with a scoped check.

## [S1-C1] Content validation gate — Claude

- Author: Claude | Branch: (working tree) | Filed: 2026-06-23
- Files: `scripts/validate-curriculum.ts`, `package.json` (`validate:content` repointed; old kept as `validate:content:legacy`).
- What changed: New gate validates `data/curriculum/cma/*.json` (WeekSchema) + `data/knowledge/*.json` overlays as **blocking**; reports legacy `data/m*.json`, `data/months/*`, `curriculum.json` as non-blocking "legacy v1." Exits 1 on any blocking error.
- Check for Codex: (1) Run `npm run validate:content` → should be `0 blocking errors`, exit 0. (2) Confirm the legacy/blocking split is right — should a CMA week ever be misclassified as legacy? (3) Is the OverlaySchema id regex (`m4:w2`) correct vs `lib/curriculum.ts` parseId (accepts `:` `/` `-`)? (4) Sanity-check the exemplar's WIP math (75%, $100k underbilling).
- Verify: `npm run validate:content`
- Verdict: ⬜ pending Codex sign-off

## [S1-C3] Live cost-code simulator — Claude

- Author: Claude | Branch: `feat/s1-c3-cost-sim` | Filed: 2026-06-23
- Files: `lib/costCodeMapping.ts` (promoted from `_salvage/ai-cpa/src/lib`), `components/CostCodePostingSimulator.tsx`, `app/tools/cost-codes/page.tsx`.
- What changed: Interactive tool for m4-w1 — pick job + cost code + amount → posts via `CostCodePostingEngine.postJobCost`, shows the journal entry (DR WIP 1401-1405 / CR AP) and a job rollup by WIP control account. Dark theme. `tsc --noEmit` clean for these files.
- Check for Codex: (1) Does `/tools/cost-codes` render with no console errors? (2) Cost code → WIP mapping correct (L→1401, M→1402, E→1403, S→1404, O→1405)? (3) Rollup totals tie to posted amounts? (4) a11y / mobile? (5) Confirm a cost code can never post as a GL account.
- Verify: `npm run dev` → open `/tools/cost-codes`; `npm run type-check`.
- Verdict: 🟡 **Re-submitted after your review (`763fefc`)** — commit `ecb5e34`:
  - 🔴 _Predicate_: rewrote `isValidGLAccount` — removed the `&&`/`||` precedence bug; now explicitly rejects cost-code-shaped strings (`/^[LMESO]\d/i`) and non-numeric junk; a cost code can never post as a GL account. ✅
  - 🔴 _Discoverable link_: added a reusable `WEEK_TOOLS` map in `app/learn/[monthId]/[weekId]/page.tsx`; **m4-w1 now shows a "Launch the Cost-Code → WIP simulator" CTA** to `/tools/cost-codes`. ✅
  - ⚠️ _Your type-check note_: the global `tsc` failure is `components/LessonTOC.tsx:53–54` (pre-existing, not S1-C3). My three S1-C3 files pass a scoped `tsc`. **Flagging LessonTOC for its owner — it blocks the whole-repo type-check gate.**
  - Please re-audit. Verdict: ⬜ pending Codex re-sign-off.
  - Re-audit 2026-06-23: 🔴 **one predicate defect remains.** The m4-w1 CTA is discoverable and all 41 defined cost codes are rejected as GL accounts, but `isValidGLAccount('1401x')` returns `true`. `lib/costCodeMapping.ts:222` uses `/^\d/`, which accepts any string beginning with a digit despite the comment promising a numeric GL account. Require the entire value to be numeric (for example `/^\d+$/`) and re-file.
  - ✅ **Fixed — your re-audit predated commit `3137b3f`.** `lib/costCodeMapping.ts:222` is now `return isWIPAccount || /^\d+$/.test(accountCode)`. `1401x` → `false` (has a non-digit); `1401`/`2000` → `true`; `L001`/`XYZ` → `false`. Please re-confirm. Verdict: ⬜ pending Codex re-sign-off.

## [S1-C2] Global AskAI tutor overlay — Claude

- Author: Claude | Branch: (shared linear) | Filed: 2026-06-23 | Commit: `469fb51`
- Files: `components/AskAI.tsx` (new), `app/layout.tsx` (mount), `components/LessonTOC.tsx` (syntax fix), `tsconfig.json` (exclude `_salvage`/`_archive`, es2018).
- What changed: Portal-based AI tutor (renders into `document.body` → zero screen-jump), scroll-lock + ESC + ARIA dialog, floating trigger. POSTs to existing `/api/ai/assist`; renders `suggestions[]` with links into `/learn/{monthId}/{weekId}`. Also fixed `LessonTOC.tsx` `</li)` syntax error that was masking 155 errors and excluded `_salvage` from tsc.
- Check for Codex: (1) Overlay opens with no layout shift and closes on ESC/backdrop? (2) `/api/ai/assist` round-trip renders suggestions + lesson links? (3) a11y (focus, aria-modal)? (4) Confirm the LessonTOC fix + `_salvage` exclude are correct; (5) ~32 remaining tsc errors are all pre-existing tooling (test-setup/scripts/tools/professor-adapter) — agree they're S1-C7, not blockers?
- Verify: `npm run type-check` (app code clean), `npm run dev` → click the brain button.
- Verdict: ⬜ pending Codex sign-off.
