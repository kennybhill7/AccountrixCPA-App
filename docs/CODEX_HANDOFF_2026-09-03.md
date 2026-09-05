# Handoff to Codex — data-driven graphics, not commissioned photography

Written by Claude Code. Self-contained — supersedes `docs/CODEX_HANDOFF_2026-09-02.md` (already deleted from this branch at `93096c1`, along with `data/images.json` and `docs/IMAGE_MANIFEST.md`). Do not resurrect that file or its approach.

## RESOLVED: shell material mismatch — root cause was typography, not blur

Owner feedback: **"doesnt look like the design claude design created."** Investigated and fixed at `4909bcd`. **Correction to what this section said before**: the claim below that `glass-strong`/`backdrop-blur` was the culprit was checked more carefully and was wrong — don't act on an earlier version of this doc if you've cached it.

What actually verified true, via `browser_evaluate` computed-style checks (not grep, not assumption):

- Surface material was already close to spec: `.glass-strong`'s computed `backdropFilter` is `none`, `boxShadow` is `none`, `borderRadius` is `2px` (sharp, not soft), and its background color (`rgb(250,249,244)`) nearly matches the canvas's `--panel: #FAF7EF` exactly. The `backdrop-blur` Tailwind classes that do exist in the codebase are all legitimate, unrelated uses (sticky-header scroll blur, modal dimming scrims) — standard patterns, not the main card material.
- The actual, dominant mismatch was **fonts**: the app was rendering `h1` in Space Grotesk and body text in Inter/system-ui — a completely different typeface pairing from the canvas's IBM Plex Sans / Barlow Condensed / Source Serif 4 / IBM Plex Mono. Typography is one of the most visually dominant signals in any design system; this alone was enough to make the whole app read as "not the same design" even with correct colors.

Fixed in `app/layout.tsx` (swapped `next/font/google` imports from `Inter, Space_Grotesk` to `IBM_Plex_Sans, IBM_Plex_Mono, Barlow_Condensed, Source_Serif_4`), `tailwind.config.ts` (remapped `fontFamily.display/heading` → Barlow Condensed, `body/sans` → IBM Plex Sans, added `serif` → Source Serif 4, `mono` → IBM Plex Mono), and `app/globals.css` (`.lesson-content` prose font Georgia → Source Serif 4). Verified live: `h1` now computes to `"Barlow Condensed"`, body to `"IBM Plex Sans"`, lesson prose to `"Source Serif 4"`. Full test suite (1051/1051) and `tsc --noEmit` clean after the change.

**If it still doesn't look right after this**, the next things to check (not yet investigated) are component-level layout/spacing choices and any remaining literal color values in `.tsx` files that bypass the CSS custom-property tokens — not another pass at the surface-material theory, that one's now confirmed correct.

**Exact ground-truth tokens**, extracted directly from Claude Design's own canvas file (`Accountrix Drafting Table.dc.html`, from the owner's design export zip — confirmed zero `backdrop-filter`/`blur()` anywhere in it, fully flat/opaque). Two palettes, day and night:

```css
/* Day (light) */
--paper: #f2efe6; /* page background — cream vellum, NOT white, NOT translucent */
--ink: #1b1e23; /* primary text */
--panel: #faf7ef; /* card/panel surface — slightly lighter than paper, still opaque */
--rule: #bec6ce; /* hairline border */
--rule2: #8e9aa6; /* stronger hairline/divider */
--ledger: #e7ede8; /* table/ledger zebra-row tint */
--ink2: #5c6470; /* secondary text */
--ink3: #8d949d; /* tertiary/muted text */
--accent: #e85c0c; /* safety-orange accent — used sparingly, once per screen per the brief */
--flagbg: rgba(232, 92, 12, 0.1);
--good: #2e6b4e;
--warn: #8a6a10;
--bad: #9c2b26;

/* Night (dark) */
--paper: #23252a; /* charcoal, not black */
--ink: #f3f0e8; /* warm white, not pure white */
--panel: #2b2e34;
--rule: #3a3e45;
--rule2: #5a6069;
--ledger: #282b31;
--ink2: #a7adb6;
--ink3: #767d87;
--accent: #e8402e; /* accent shifts warmer/redder in dark mode */
--flagbg: rgba(232, 64, 46, 0.14);
--good: #4fa47b;
--warn: #dfa52c;
--bad: #c2554f;
```

Fonts (all loaded from Google Fonts, matching the CSP-allowed host):

```css
--serif: "Source Serif 4", Georgia, serif; /* reading voice — lesson prose */
--mono: "IBM Plex Mono", ui-monospace, monospace; /* numbers, ledger figures */
--cond: "Barlow Condensed", Impact, sans-serif; /* labels, eyebrows, section tags */
--sans: "IBM Plex Sans", system-ui, sans-serif; /* UI chrome, buttons, nav */
```

Map these onto this app's existing `hsl(var(--...))` token system in `app/globals.css` (convert hex to HSL, keep the existing token _names_ where they already serve the same role — e.g. `--background`→`--paper`, `--foreground`→`--ink`, `--card`→`--panel`, `--border`→`--rule`, `--primary`→`--accent` — check current token names before renaming wholesale) rather than introducing a parallel, disconnected variable set. The point is replacing the _material_ (opaque flat paper vs. translucent blurred glass), not just adding new named colors alongside the old ones.

## Why the previous plan is dead

Two rounds of owner feedback, both rejecting the same underlying idea, not just its execution:

1. "im not a fan of these" — the 8 generated photos (moody desk lamp + blueprints + hard hat, dusk concrete pour).
2. "the pictures of the notebooks and graphs killing me. kill the idea." — rejecting the _concept_ of decorative stock/editorial photography sitting behind content, not just that one batch.

The core problem: any commissioned photo — no matter how well-executed or how many creative directions get proposed — is decoration. It repeats across dozens of pages, doesn't change with content, and reads as generic AI-stock-photo filler. **Do not propose another round of photographic mood images.** The fix isn't a better photo, it's not using photos for this.

## Current state, verified

- Branch `feat/cma-2027-build`, HEAD `a4b422f` on both local clones and `origin`, working tree clean. (This hash will drift — check `git log -1` rather than trusting this number if it's been a while.)
- The UI-foundation work from commits `0276d41`..`477cbe7`, the font fix at `4909bcd`, Codex's own onboarding/practice-tie-out work at `ac75905`, the Mission Control layout rebuild at `a4337c7`, and the lesson TOC/trap-callout work at `a4b422f` are all real, committed, verified. That work stands.
- **IMPORTANT — a real, unresolved DOM-reset bug exists in `components/LessonBody.tsx`, mitigated but not root-caused.** Confirmed via a live MutationObserver, in a production build (rules out Strict Mode): shortly after a lesson page mounts, something performs a full `childList` replacement of the `<article>`'s children, silently discarding any imperative DOM mutation an effect made (heading ids, classes, the bookmark-button feature's appended spans). Ruled out: Strict Mode double-invoke (still happens in `next build && next start`), the bookmark-button effect's create-root/unmount race (separately real and fixed — see below — but not the cause), `dangerouslySetInnerHTML` string identity (memoizing `sanitizedHTML` via `useMemo` did not fix it). **Not actually found**: what triggers the reset. Mitigated pragmatically — the outline/trap-callout effect now watches for this reset via its own `MutationObserver` and re-applies itself whenever it fires, so those two features are reliable regardless of the cause. **The separate bookmark-button feature does NOT have this same self-healing and can still silently lose its buttons** — a real, still-open gap if you touch that feature. If you ever get a real lead on the root cause (a Zustand store hydration flag flipping and re-rendering the whole tree shortly after mount would be my next guess, given the ~150-200ms timing, but this is a guess, not a finding), worth fixing at the source instead of the reactive patch.
- **Item 1 (lesson-opener diagrams): 11 of ~48+ CMA weeks plus Finance/CPA weeks populated.** Two diagram components exist:
  - `components/diagrams/VarianceLineDiagram.tsx` — standard-vs-actual (or option-vs-option) comparisons. Wired: `m3:w1` (material price), `m2:w2` (flexible budget), `m3:w3` (residual income — note the _opposite_ favorable/unfavorable polarity from a cost variance), `m9:w2` (make-or-buy — reused this component for a two-option comparison rather than building a third one, relabeling "standard/actual" as "cost to make/cost to buy"), `bar-u1:w2` CPA (labor rate).
  - `components/diagrams/MetricBreakdownDiagram.tsx` — N labeled input terms combined by real arithmetic into one derived metric. Wired: `m8:w3` + `finance-u3:w3` (cash conversion cycle), `m9:w1` (operating leverage), `m3:w2` (transfer price), `m4:w4` (ABC driver rate), `m2:w3` (cash collections schedule), `m9:w4` (contribution margin per constraint hour).
  - All wired into all three lesson pages (`app/learn`, `app/cpa/[unitId]/[weekId]`, `app/finance/[unitId]/[weekId]`) — check `lib/lessonDiagrams.ts`'s `WEEK_DIAGRAMS` map for exact keys before adding more; each route uses a different id convention (see below).
  - Every entry verified two ways before wiring: (1) hand-recomputed the generator's math independently — including trying multiple seeds when the first one produced a nonsensical example (e.g. `cmPerConstraintUnit` seed 9401 had price below variable cost, never a real "keep this product" scenario — seed 9402 used instead), (2) loaded the actual route live via Playwright and read the rendered `aria-label` back out.
  - **Bug fixed along the way**: `VarianceLineDiagram`'s `aria-label` used to hardcode the words "standard"/"actual" regardless of the labels actually passed in — wrong for non-variance comparisons like make-or-buy. Now builds the label from the real prop values. If you add more `VarianceLineDiagram` entries, the visible SVG text was always correct (uses the real labels); only the screen-reader text had this bug, now fixed.

### Route id conventions — checked directly against each curriculum JSON, don't assume

- CMA (`app/learn/[monthId]/[weekId]`): keys like `m3`, `w1` — e.g. `m3:w1`.
- CPA (`app/cpa/[unitId]/[weekId]`): unit ids are like `bar-u1`, `far-u2` (section prefix + unit number, hyphenated), week ids are plain `w1`..`w4` — e.g. `bar-u1:w2`. Verified against `data/curriculum-cpa.json`.
- Finance (`app/finance/[unitId]/[weekId]`): unit ids are like `finance-u1`..`finance-u5` (prefixed, **not** bare `u1`..`u5` — this was wrong in an earlier draft of this doc and caught before wiring), week ids are plain `w1`..`w4` — e.g. `finance-u3:w3`. Verified against `data/curriculum-finance.json`.

### Two things the original plan below got wrong — verified against real data, don't repeat these

1. **CMA lesson-week JSON carries no `skills` tags at all.** `grep -c '"skills"' data/curriculum.json` → 0, repo-wide. (CPA and Finance JSON _do_ sometimes carry a `skills?: string[]` field per week — checked the page components directly — but it's optional/inconsistent, not a reliable classifier either.) Match a week to a diagram type by reading its **title** and content by hand (e.g. `m3-w1` = "Cost & Variance Analysis" → obviously a variance-line candidate), same as you'd pick a `WEEK_TOOLS` entry.
2. **Most CMA lesson prose has no embedded worked-example dollar figures to parse.** Checked: 0 of 48 CMA weeks combine "% complete" language with 3+ dollar figures. **Do not try to regex/scrape `lessonHtml` for numbers.** Source diagram data from `lib/parametricCma.ts`'s generators instead (call the matching generator with a fixed seed, read its `params`/`answer` fields). If no generator matches a week's topic, skip that week — don't force it. (Concrete example of "don't force it": `overUnderAppliedOverhead` was deliberately left unwired for `m4:w4` — over/underapplied overhead is an allocation-timing question, not a favorable/unfavorable performance judgment, so it doesn't honestly fit either existing diagram type. Building a third diagram type for it, rather than mislabeling it, would be the right move if you pick this back up.)

**Generators still unused that are worth checking for title matches**: `materialQuantityVariance`, `laborEfficiencyVariance`, `vohSpendingVariance`, `fohVolumeVariance`, `economicValueAdded`, `transferPriceMinimum`, `sustainableGrowthRate`, `cashCollectionsSchedule`, `cashBudgetEndingBalance`, and others in `lib/parametricCma.ts` — grep `export const` there for the full list. **Still no generator exists** for WIP/percentage-of-completion or WACC/capital-structure specifically — those two diagram concepts from the original plan below remain unbuildable without first extending `lib/parametricCma.ts` (follow its existing patterns and the golden-value-test discipline in `tests/unit/parametricCma.test.ts`).

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
