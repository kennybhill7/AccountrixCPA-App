# Codex Audit — Notes Engine

Date: 2026-07-05  
Reviewer: Codex  
Task: `notes-engine-p1`  
Fable commit: `6675848`

## Verdict

Approved with reviewer fix.

Fable's notes engine is a strong product increment: notes are no longer a passive archive. They now feed flashcards, SRS, Mistake Bank/readiness, and AskAI.

## What passed

- Inline hashtags are parsed at read time; no storage migration required.
- `/notes` shows tag chips/counts, supports tag filtering, and searches note text plus tags.
- Notes can be converted to editable flashcards.
- Converted cards persist in `custom-flashcards` and appear as a client-side `My Notes` deck on `/flashcards`.
- Converted cards carry `skills`, `href`, `sourceId`, and track metadata, so ratings feed the same attempt ledger/SRS path as curriculum cards.
- Any note can dispatch the global `askai:open` event and prefill the AskAI overlay.
- Note deletion writes back to the correct origin store.
- `custom-flashcards` is included in `/state` export/import and validated as a Zustand-persist value.

## Reviewer fix applied

Original issue: smart notes converted from non-lesson paths defaulted to `cma`. That would misclassify notes captured on `/finance`, `/cpa`, `/crossover`, or `/apply`.

Fix:

- `cardFromNote()` now infers smart-note track from `note.path`:
  - `/finance...` → `finance`
  - `/cpa...` or `/crossover...` → `cpa`
  - `/apply...` → `apply`
  - otherwise → `cma`
- `/notes` conversion state now keys by `origin:id` to avoid a lesson-note/smart-note ID collision opening multiple editors.
- Unit coverage was extended for finance, CPA, and Apply smart-note paths.

## Gates

- `npm run type-check` — pass.
- `npm test -- --run` — pass; 24 files / 240 tests.
- `npm run build` — pass; 45/45 routes.
- `git diff --check` — pass.

Existing build warnings are unchanged and non-blocking: `professor-adapter` dynamic dependency, stale Browserslist DB, and Tailwind module-type warning.

## Remaining non-blocking gap

Highlight-to-note inside lesson HTML is still not built. That needs a selection-anchor design, so deferring it is correct.
