# Handoff to Codex — data-driven graphics, not commissioned photography

Written by Claude Code. Self-contained — supersedes `docs/CODEX_HANDOFF_2026-09-02.md` (already deleted from this branch at `93096c1`, along with `data/images.json` and `docs/IMAGE_MANIFEST.md`). Do not resurrect that file or its approach.

## Why the previous plan is dead

Two rounds of owner feedback, both rejecting the same underlying idea, not just its execution:

1. "im not a fan of these" — the 8 generated photos (moody desk lamp + blueprints + hard hat, dusk concrete pour).
2. "the pictures of the notebooks and graphs killing me. kill the idea." — rejecting the _concept_ of decorative stock/editorial photography sitting behind content, not just that one batch.

The core problem: any commissioned photo — no matter how well-executed or how many creative directions get proposed — is decoration. It repeats across dozens of pages, doesn't change with content, and reads as generic AI-stock-photo filler. **Do not propose another round of photographic mood images.** The fix isn't a better photo, it's not using photos for this.

## Current state, verified

- Branch `feat/cma-2027-build`, HEAD `93096c1` on both local clones and `origin`, working tree clean.
- Zero image references anywhere in `app/` or `components/` (confirmed via grep). Zero `assets/img/`. `data/images.json`, `docs/IMAGE_MANIFEST.md`, and the previous handoff doc are all gone.
- The UI-foundation work from commits `0276d41`..`477cbe7` (blueprint+ledger shell, light/dark paper themes, lesson/ledger surface styling, home + controller-desk surfaces, focus states) is real, committed, and verified — typecheck clean, 1051/1051 tests passing, production build green. That work stands; nothing here undoes it.

## The new direction: small graphics built from real content, not commissioned art

Replace "decorative photo behind a page" with "a tiny diagram that IS the page's own content, rendered from live data." Concretely, five surfaces, in priority order:

### 1. Lesson openers (`/learn/[monthId]/[weekId]`, `/finance/[unitId]/[weekId]`, `/cpa/[unitId]/[weekId]`)

No photo, no shared banner reused across 48+ weeks. Instead: a small inline SVG (or lightweight canvas) diagram generated from **that specific week's own worked example data** (already present in the curriculum JSON — check `data/curriculum/cma/*.json` etc. for the numbers each lesson actually teaches). Pick the diagram shape by the week's `skills` tags:

- WIP / percentage-of-completion / contract-asset-liability weeks → a small multi-stage bar (a building rising in steps), each stage labeled with that week's actual %-complete figures.
- Variance-analysis weeks → a number line with a "standard" marker and an "actual" marker, the gap between them labeled with the real variance dollar amount from that lesson.
- Capital-structure / WACC weeks → a two-sided balance (debt block vs. equity block) sized/tipped by that lesson's real debt-to-equity numbers.
- Anything that doesn't cleanly fit one of these shapes → no diagram, just skip it. Don't force a metaphor onto content it doesn't fit — that's the same mistake as before, just in a new medium.

This is a code task (read the lesson's JSON, render an SVG), not an image-generation task. Build 2-4 reusable diagram _components_ (parameterized by data), not per-lesson assets.

### 2. Practice session-complete (`/practice`)

No photo. A short, simple animation: two columns (e.g. "target" / "actual", or debit/credit depending on what's being drilled) sliding into alignment and locking with a checkmark when the session's score data confirms mastery. Build with CSS/Framer Motion or whatever animation approach this codebase already uses elsewhere — check for existing patterns before introducing a new dependency.

### 3. Onboarding (`/onboarding`, `/onboarding/chat`)

No photo. A short animated sequence: a small ledger with debit/credit figures sliding into place until they balance (visually demonstrates double-entry, which is the actual subject of the app). This can be pure decorative/illustrative since there's no "real" onboarding data yet — but keep it schematic/graphic, not photographic.

### 4. Case pages — KEEP existing behavior, no change needed

`/apply/[companyId]/[workflowId]` for `meridian-building-group` already has real, already-delivered photos (`case-meridian.png`, `case-riverton.png` — check if these still exist in `assets/img/` in the OneDrive clone at `C:\Users\kenny\OneDrive\Apps\Accountrix\assets\img\`; they were generated before tonight's cleanup and may or may not have survived — verify before assuming). These are legitimately relevant (a specific fictional company's actual jobsite), not generic mood-setting, so they're the one exception to "no photography." If they're gone, this is a "nice to have later," not urgent — the case pages work fine with no image, same as most of the app.

### 5. Empty states and Planner — nothing

`/mistakes`, `/notes`, `/review` empty states: no image, clean typography only. `/planner`: no image — instead, if it's not already strong, improve the _real_ backward-pass timeline component itself (milestone markers, a live progress indicator against the exam date) rather than illustrating it with a decorative graphic next to it.

## What NOT to do

- Do not generate more photographic images in any style ("technical graphic," "restrained hybrid," or otherwise) — that whole menu from earlier tonight is moot. The owner's objection was to the concept, not the style within it.
- Do not reintroduce `data/images.json` / `IMAGE_MANIFEST.md` as photography-manifest files. If you want a tracking file for the new SVG-diagram components, that's fine, but scope it to "which lesson tag maps to which diagram shape," not an asset/prompt manifest.
- Do not spend generation budget (image-gen API calls, etc.) on this at all for items 1-3 and 5 — they're code, not commissioned art.

## Verify before calling it done

Same standard as before: `npx tsc --noEmit` clean, full test suite green, and actually load a few lesson pages + `/practice` completion + `/onboarding` in a browser (Playwright MCP tools are available) to confirm the diagrams render correctly against real data and don't look broken/empty when a lesson's data doesn't cleanly fit a diagram shape (that should degrade to "no diagram," never a broken/empty box).

Commit messages end with:

```
Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
```

Push to `origin/feat/cma-2027-build` when done.
