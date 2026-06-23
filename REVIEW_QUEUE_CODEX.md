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
- Check for Codex: (1) Did any *unique* content get lost vs the `_archive` zips? Spot-check `data/cpa/content` vs original. (2) Is the exemplar `data/curriculum/cma/m4-w2.exemplar.json` schema-valid and are its WIP numbers internally consistent (75% complete, $100k underbilling)? (3) Is `CURRICULUM_SPEC.md` blueprint weighting faithful to the IMA CMA blueprint?
- Verdict: ⬜ pending Codex sign-off

## [S1-C1] Content validation gate — Claude
- Author: Claude | Branch: (working tree) | Filed: 2026-06-23
- Files: `scripts/validate-curriculum.ts`, `package.json` (`validate:content` repointed; old kept as `validate:content:legacy`).
- What changed: New gate validates `data/curriculum/cma/*.json` (WeekSchema) + `data/knowledge/*.json` overlays as **blocking**; reports legacy `data/m*.json`, `data/months/*`, `curriculum.json` as non-blocking "legacy v1." Exits 1 on any blocking error.
- Check for Codex: (1) Run `npm run validate:content` → should be `0 blocking errors`, exit 0. (2) Confirm the legacy/blocking split is right — should a CMA week ever be misclassified as legacy? (3) Is the OverlaySchema id regex (`m4:w2`) correct vs `lib/curriculum.ts` parseId (accepts `:` `/` `-`)? (4) Sanity-check the exemplar's WIP math (75%, $100k underbilling).
- Verify: `npm run validate:content`
- Verdict: ⬜ pending Codex sign-off
