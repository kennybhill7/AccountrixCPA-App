# Accountrix: the drafting-table system

A prompt for Claude Design. Paste this whole document into a new design in claude.ai/design (or attach it as a brief file) and let it build the design package the same way it built Scarlet Thread's — one grounded material world, one restrained accent, hard surface rules, and a screen-by-screen package rather than a single mockup.

---

## 0. The one-line pitch this all serves

_"Every other exam-prep app is a quiz with a progress bar. This one is the drafting table you actually work at — lessons read like a well-set textbook, numbers read like a ledger, and the one thing that's ever orange is the thing that needs your signature."_

If a design choice doesn't serve that sentence, cut it.

---

## 1. The governing metaphor — and why it's not decoration

Scarlet Thread's whole system came from one constraint: _the films are the design system. Rock is desaturated near-black. Light is warm and comes from one direction. The only saturated thing in the frame is the thread._ That discipline — one real material world, one signal color, everything else in service of legibility — is what to reproduce here. Not the palette. The discipline.

Accountrix's real material world is not "finance app blue." It's the two physical objects a construction controller actually lives inside all day:

- **The blueprint.** Drafting paper, orthogonal grid, hairline linework, revision triangles, scale bars, north arrows, a title block in the corner. Precise, technical, calm. This is the _shell_ — navigation, panels, the read-only structure everything else sits inside.
- **The ledger.** Ruled columns, tabular figures that line up to the decimal, a debit side and a credit side, a total that either ties or doesn't. This is the _content_ — every number in this app, from a quiz answer to a WIP schedule to a trial balance, lives on this grid.

One material connects them and gives the app its single accent: **safety orange.** The color of a hard hat, a traffic cone, a survey stake, the "sign here" flag on a change order. On a real jobsite it means exactly one thing — _this needs a human decision_ — and it should mean exactly that here too: the current lesson, the thing that's wrong in a Review Mode workpaper, the button that submits an answer. Never decoration. Never a second accent color competing with it.

This is already half-built: the product's own naming calls this the "Blueprint + Safety-Orange identity." It has never actually been designed — the shipped app is a generic aurora-blue-and-violet SaaS gradient with rounded cards and soft shadows, the exact look every AI-generated dashboard defaults to. This brief is the instruction to finally build the real thing instead.

---

## 2. Palette — sampled from the material, not invented

Two full themes, not one mood. This is a tool people open at 6am before work and at 11pm after the kids are asleep — both have to be genuinely comfortable to read for an hour, not just "dark mode exists."

**Light — the drafting table under office light.**
| Token | Sampled from | Use |
|---|---|---|
| `--paper` | Cream drafting vellum, not stark white | Page background |
| `--ink` | Near-black graphite, not pure `#000` | Body text |
| `--panel` | A half-step warmer than paper | Cards, raised surfaces |
| `--rule` | Faint blue-grey, the color of a printed grid line | Hairlines, table rules |
| `--ledger-line` | The palest blue-green, barely there | Table row zebra, ruled-paper texture on numeric surfaces only |
| `--orange` | Safety orange, real hard-hat orange, not a pastel | The one accent — current item, submit, the flagged cell |

**Dark — the same table at night, drafting lamp only.**
| Token | Sampled from | Use |
|---|---|---|
| `--paper` | Near-black blueprint blue, not neutral grey | Page background |
| `--ink` | Warm off-white, not `#fff` | Body text |
| `--panel` | One step up from paper, cool | Cards, raised surfaces |
| `--rule` | Desaturated blueprint cyan at low opacity | Hairlines, table rules |
| `--ledger-line` | The same cyan, barely visible | Ruled-paper texture on numeric surfaces |
| `--orange` | The identical safety orange, unchanged | It has to read as the same color in both themes — that's what makes it a signal instead of a mood |

**Semantic state colors are a separate set, not the accent.** This app makes pass/fail calls constantly — a quiz answer, a covenant test, a Review Mode sign-off, an over/under-billing position. Define `--good` (a quiet green, ledger-black-ink green, not a UI-kit green), `--warn` (amber, distinct from the orange accent), `--bad` (a restrained red, never the loud red of a form-validation toast). None of the three may be reachable for from the accent — a reader must never wonder "is that orange a status or the identity color." Scarlet Thread drew this exact line ("no unfinished day is ever red") for its own reasons; draw it here for the opposite reason — this app _does_ need to say "wrong," clearly, without borrowing the identity color to do it.

---

## 3. Type — four voices for four different jobs

Scarlet Thread used Fraunces for headlines, Spectral for scripture, Archivo Narrow for labels, Inter for UI. The principle — a dedicated face for the one content type that deserves special treatment — maps directly here, except the content type that deserves it isn't scripture. It's numbers.

- **A serif for lesson prose.** Something with real texture — a text-book face, not a screen-UI face — for the ~2,000-word lessons, the essay scenarios, the case narratives. This is where someone reads for twenty minutes straight; it should feel like a well-set textbook, not an app screen.
- **A tabular-numeral monospace or near-monospace for every number.** This is the single most important typographic decision in the whole brief. Every dollar figure, every quiz answer, every ledger cell, every WIP schedule column must line up on its decimal point the way real accounting paper does. A finance app that doesn't tabular-align its numbers looks amateur to anyone who has actually worked a trial balance — and this user has. Pick a face built for it (a real accounting/mono face, not a generic sans forced into `tabular-nums`), and use it for every number in the product: quiz choices with dollar amounts, generator answers, workpaper cells, the readiness percentage, the exam countdown.
- **A condensed, tracked-out, all-caps face for labels.** Section eyebrows, nav items, blueprint-style annotations ("REV 3", "SCALE 1:4", "SEC 00 — CMA PART 1"). This is what makes the shell feel drafted rather than designed-in-Figma.
- **A clean sans for interactive UI chrome** — buttons, form labels, the stuff that has to disappear so content can lead.

---

## 4. Surface rules — the hard constraints

Numbered on purpose, the way a real spec is numbered. Every screen either follows all of these or has an explicit, argued exception.

1. **Radius is 0–2px on every structural surface.** Blueprints don't have rounded corners. The only round things are avatars and true circular controls (a radio dot, a ring progress indicator).
2. **Separation comes from a 1px hairline, never a drop shadow.** Panels sit on a grid and touch their neighbors at a rule, the way drawings on a sheet share a border. No floating cards with soft shadows — that's the aurora-gradient look this brief exists to replace.
3. **Every numeric table gets ledger rules**, not zebra-striped SaaS-table styling: a top-and-bottom double rule on totals, a single rule between rows, tabular-aligned figures, right-aligned by default.
4. **Orange appears exactly once per screen**, at most twice on a dashboard with a genuinely distinct second signal. If a screen wants three orange things, that's a sign three things are competing for the same "act now" attention and the hierarchy is wrong, not that the rule should bend.
5. **A correct/incorrect/pass/fail state is never rendered in the orange accent.** Use the semantic set from §2. This is the rule most likely to get broken by habit — watch for it specifically in quiz and Review Mode UI.
6. **Labels are the condensed caps face; nothing else is.** If it's not a section eyebrow, a nav item, or a blueprint-style annotation, it doesn't get letter-spacing and small-caps treatment.
7. **44px minimum tap target, 48px in any persistent nav**, safe-area respected on mobile web.
8. **A blank or loading state is drafted, not apologized for.** No cutesy empty-state illustrations. A page with nothing in it yet looks like an unstarted sheet on the drafting table — a title block, a grid, maybe a pencil-light placeholder — not a sad-robot graphic.

---

## 5. The density doctrine — the part Scarlet Thread didn't need

Scarlet Thread is an experience: sparse, cinematic, full-bleed art carrying most screens. Accountrix is a working tool: a 48-week curriculum tree, a 2,081-item practice bank, dense generator drills, multi-column ledger worksheets, a readiness dashboard rolling up dozens of skills. Most screens here are closer to a real trial balance than a movie still. **Don't fight that by trying to airily minimalist it into a landing page — resolve it the way a well-drafted engineering sheet resolves density: real hierarchy, real structure, nothing wasted.**

Concretely:

- A dense table earns its density through alignment and rules, not through shrinking type until it feels crowded. Real body-text size, real row height, real breathing room _between_ ruled sections even while the rows inside a section are tight.
- Summary before detail on every dashboard surface — the readiness percentage and the "start here" recommendation lead; the 48-skill breakdown is one click away, not stacked on the same screen.
- A stat or a score is a small, quiet number in the ledger face, not a giant hero numeral in a gradient card. This app has dozens of numbers on any given screen; treating every one like a marketing KPI would make the real signal (the orange thing) disappear into noise.
- State is encoded in form, not just color: a chip, a stripe, a checkmark glyph — so a colorblind reader or a black-and-white printout of a workpaper still reads correctly. Review Mode specifically depends on this: a reviewer flagging a wrong cell needs the flag to survive being screenshotted in grayscale.

---

## 6. Concrete surfaces — design these, in this order

Ask Claude Design to build a design package the same shape as Scarlet Thread's (numbered pages, a palette page, a type page, a components page), covering these real screens:

1. **The world** — palette, type, surface rules, the blueprint/ledger material study (the equivalent of Scarlet Thread's "00 · The world" opener).
2. **Mission Control** (`/mission`) — the daily home screen: today's plan across CMA/CPA/Finance/Apply lanes, the exam countdown, weak-skill callouts.
3. **A lesson page** (`/cma/[month]/[week]` or `/finance/[unit]/[week]`) — the serif reading surface, a worked numeric example rendered in the ledger face, the "trap" callout box.
4. **A quiz/practice screen** — MCQ choices with dollar figures (tabular-aligned!), the correct/incorrect state in the semantic set, not orange.
5. **A Review Mode workpaper** (`/review/[id]`) — this is the screen that most needs the ledger discipline: a dense multi-column worksheet, a cell the reviewer can flag, the sign-off vs. exception verdict, the reveal of root cause vs. consequence.
6. **The readiness dashboard** (`/readiness` or `/mastery`) — the density-doctrine test case: dozens of skills rolled up by blueprint section, summary-first.
7. **The exam-date planner** (`/planner`) — the backward-pass timeline, blueprint-weighted coverage blocks, rendered like a construction schedule (which, structurally, it is).
8. **Command palette / nav** — how the condensed-caps label face and the hairline system carry the shell across every other screen.

---

## 7. What NOT to build (protect the thesis)

- No rounded cards, no soft drop shadows, no gradient hero panels. That is the exact look this brief exists to leave behind.
- No decorative illustration standing in for content. This app's entire value is density of real material — a cute empty-state graphic or a generic "learning" hero image is the opposite of the pitch.
- No second accent color. If a screen seems to need one, it's a semantic state — pull it from §2, not from a new hue.
- No shrinking type to fit more in. Resolve density with structure (§5), not with a smaller font.
- Don't let the numeric/ledger face bleed into prose, and don't let the prose serif bleed into numbers. The whole point of having two content voices is that a reader's eye instantly knows "this is something to read" versus "this is something to check."
