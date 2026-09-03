# Accountrix Image Manifest

Of 54 routes in the app, 11 get an image (3 already delivered, 8 still to be
commissioned) and 43 correctly get none — form surfaces, drill/quiz interfaces
where the item is the content, and index/dashboard screens where the numbers
are the content. Machine-readable version: [`data/images.json`](../data/images.json).

**Branch note:** built against `feat/cma-2027-build`, not `main`, because
`/review/[reviewId]` — referenced in the seed verdicts this task shipped with
— only exists on the feature branch. If `main` is the actual target, this
manifest's Review Mode rows don't apply until that branch merges.

No `<Image>` tags were added to any component. This is manifest only.

---

## 1. Assets

| id                      | status    | surface | aspect | min size  | used by                                                                                                             |
| ----------------------- | --------- | ------- | ------ | --------- | ------------------------------------------------------------------------------------------------------------------- |
| `world-drafting-table`  | delivered | day     | 8:3    | 2048×768  | material study, not currently slotted to a route                                                                    |
| `case-meridian`         | delivered | day     | 21:9   | 1916×821  | `/apply/[companyId]/[workflowId]` (meridian-building-group)                                                         |
| `case-riverton`         | delivered | night   | 21:9   | 1916×821  | **unattached** — see Open Questions                                                                                 |
| `lesson-open-contracts` | needed    | night   | 16:6   | 2480×930  | `/learn/[monthId]/[weekId]`, `/finance/[unitId]/[weekId]`, `/cpa/[unitId]/[weekId]` — WIP/contract-accounting weeks |
| `lesson-open-cost`      | needed    | day     | 16:6   | 2480×930  | same three routes — all other (cost/budgeting/etc.) weeks                                                           |
| `review-empty`          | needed    | day     | 4:3    | 1600×1200 | `/mistakes`, `/notes`, `/review` — zero-state only                                                                  |
| `practice-complete`     | needed    | night   | 4:3    | 1600×1200 | `/practice` session-complete state                                                                                  |
| `tile-vellum`           | needed    | day     | 1:1    | 1200×1200 | background texture, day surfaces                                                                                    |
| `tile-charcoal`         | needed    | night   | 1:1    | 1200×1200 | background texture, night surfaces                                                                                  |
| `onboarding-signin`     | needed    | night   | 3:2    | 3000×2000 | `/onboarding`, `/onboarding/chat`, `/diagnostic`                                                                    |
| `planner-schedule`      | needed    | day     | 16:6   | 2480×930  | `/planner`                                                                                                          |

11 assets total — 3 under the 14-image ceiling.

## 2. Route → surface table

Dynamic routes are listed once, as a template, per the task's own instruction.

| route                             | class     | image                                                                                               |
| --------------------------------- | --------- | --------------------------------------------------------------------------------------------------- |
| `/`                               | dashboard | none                                                                                                |
| `/apply`                          | dashboard | none                                                                                                |
| `/apply/[companyId]/[workflowId]` | case      | `case-meridian` for meridian-building-group; **none** for northstar-services, whitfield-dissolution |
| `/assist`                         | shell     | none                                                                                                |
| `/assist/[sessionId]`             | reading   | none                                                                                                |
| `/calculator`                     | drill     | none                                                                                                |
| `/coa-builder`                    | drill     | none                                                                                                |
| `/coa-builder/examples`           | reading   | none                                                                                                |
| `/coa-builder/integration`        | reading   | none                                                                                                |
| `/cpa`                            | dashboard | none                                                                                                |
| `/cpa/[unitId]/[weekId]`          | reading   | `lesson-open-cost` (default) / `lesson-open-contracts` (WIP/BAR units)                              |
| `/crossover`                      | drill     | none                                                                                                |
| `/custom/[id]`                    | reading   | none                                                                                                |
| `/diagnostic`                     | entry     | `onboarding-signin` (intro screen only)                                                             |
| `/exam`                           | drill     | none                                                                                                |
| `/finance`                        | dashboard | none                                                                                                |
| `/finance/[unitId]/[weekId]`      | reading   | `lesson-open-cost` (default) / `lesson-open-contracts` (construction-applied units)                 |
| `/flashcards`                     | drill     | none                                                                                                |
| `/gamification`                   | dashboard | none                                                                                                |
| `/help`                           | account   | none                                                                                                |
| `/learn`                          | dashboard | none                                                                                                |
| `/learn/[monthId]`                | dashboard | none                                                                                                |
| `/learn/[monthId]/[weekId]`       | reading   | `lesson-open-cost` (default) / `lesson-open-contracts` (WIP/rev-rec weeks)                          |
| `/learn/[monthId]/[weekId]/quiz`  | drill     | none                                                                                                |
| `/ledger`                         | dashboard | none                                                                                                |
| `/ledger/[bookId]`                | workpaper | none                                                                                                |
| `/map`                            | shell     | none                                                                                                |
| `/mastery`                        | dashboard | none                                                                                                |
| `/methods`                        | reading   | none                                                                                                |
| `/mission`                        | dashboard | none                                                                                                |
| `/mistakes`                       | empty     | `review-empty` (zero-state only)                                                                    |
| `/notes`                          | empty     | `review-empty` (zero-state only)                                                                    |
| `/onboarding`                     | entry     | `onboarding-signin`                                                                                 |
| `/onboarding/chat`                | entry     | `onboarding-signin` (reused)                                                                        |
| `/plan`                           | dashboard | none                                                                                                |
| `/planner`                        | dashboard | `planner-schedule`                                                                                  |
| `/practice`                       | drill     | none (`practice-complete` on session-complete state)                                                |
| `/privacy`                        | account   | none                                                                                                |
| `/profile`                        | account   | none                                                                                                |
| `/readiness`                      | dashboard | none                                                                                                |
| `/reference`                      | reading   | none                                                                                                |
| `/review`                         | empty     | `review-empty` (zero-state only)                                                                    |
| `/review/[reviewId]`              | workpaper | none — see correction below                                                                         |
| `/scratchpad`                     | drill     | none                                                                                                |
| `/search`                         | shell     | none                                                                                                |
| `/settings`                       | account   | none                                                                                                |
| `/sims`                           | drill     | none                                                                                                |
| `/sims/essay/[essayId]`           | drill     | none                                                                                                |
| `/sims/tbs/[simId]`               | drill     | none                                                                                                |
| `/state`                          | account   | none                                                                                                |
| `/templates`                      | reading   | none                                                                                                |
| `/terms`                          | account   | none                                                                                                |
| `/tools/cost-codes`               | drill     | none                                                                                                |
| `/tracks`                         | dashboard | none                                                                                                |

## 3. Prompts for needed assets

### `lesson-open-contracts` (night)

> Photograph of a partially completed concrete structure at dusk, shot from ground level looking up along a row of cast-in-place columns. Formwork still on two columns, rebar stubs at the top, a plywood deck above. Charcoal and warm-grey concrete, cool blue-grey sky, everything desaturated. A single warm work light low on the left rakes across the concrete face; deep shadow to the right. One safety-orange strand of barrier netting is visible at the bottom left corner, very small. No people, no readable signage, no logos. Photographic, 50mm, natural depth of field, fine grain. Dark overall — this sits behind warm white text — confirm the concrete face reads mid-to-dark grey, not bright, so #F3F0E8 text stays legible over it.

### `lesson-open-cost` (day)

> Overhead photograph of a drafting table lit by cool window light from the upper left. On cream drafting paper: a folded structural drawing at an angle, a triangular architect's scale, a mechanical pencil, and a stack of loose ruled schedule sheets fanned slightly. Cream, bone, graphite, faint blue-grey printed grid lines. One orange marking crayon lies diagonally near the right edge — the only saturated object in the frame. Text on the drawings is soft and unreadable. No hands, no coffee cup, no laptop. Photographic, straight-down, shallow depth of field falling off at the edges, fine grain.

### `review-empty` (day)

> Photograph of a single blank ruled accounting worksheet lying square on a cream drafting table, shot from directly above, cool light from the upper left. The sheet is genuinely empty — pale printed column rules and a faint title block in one corner, nothing written in it. A sharpened pencil rests along the right edge, parallel to the page. Cream, bone, graphite, palest blue-green rule lines. Nothing else in frame. No text, no numbers, no illustration. Photographic, straight-down, quiet and still, fine grain.

### `practice-complete` (night)

> Close photograph of a printed accounting schedule on charcoal-grey paper, shot at a slight angle under a single warm drafting lamp from the left. The page has been worked over by hand: red felt-pen circles around two figures, a red check mark in the margin, a small triangle drawn beside one line. Charcoal ground, warm white printed figures too soft to read as numbers, red pen the only saturated colour. The pen itself lies at the bottom of the frame, cap off. No hands, no readable text. Photographic, 85mm macro, shallow depth of field, fine grain. Dark enough overall to carry warm white #F3F0E8 UI text below the image without a scrim.

### `tile-vellum` (day)

> Seamless tileable texture of cream drafting vellum, #F2EFE6, photographed flat under even diffuse light. Very subtle fibre and tooth, faint warm mottling, no folds, no creases, no edges, no shadows, no objects. Almost featureless — this is used at 10% opacity behind tables. Perfectly tileable, no visible seams, no vignette. Photographic, straight-down.

### `tile-charcoal` (night)

> Seamless tileable texture of charcoal-grey paper stock, #23252A, photographed flat under even diffuse light. Very subtle tooth and a faint cool sheen, no folds, no creases, no edges, no shadows, no objects. Almost featureless — used at 8% opacity behind numeric panels. Perfectly tileable, no visible seams, no vignette. Photographic, straight-down.

### `onboarding-signin` (night)

> Photograph of a controller's desk at night, shot from a low three-quarter angle. A single warm drafting lamp at the left edge lights a stack of drawings and one folded schedule; the rest of the desk falls into charcoal darkness. Visible: rolled drawings standing in a tube, a triangular scale, a hard hat resting upside down at the far right — the hat is safety orange and is the only saturated object, occupying a small part of the frame. Deep falloff, most of the image is near-black with warm highlights. Text unreadable. No people, no screens. Photographic, 50mm, shallow depth of field, fine grain. Leave the upper right third dark and uncluttered — a form sits there.

### `planner-schedule` (day)

> Photograph of a printed construction bar-chart schedule — a long fold-out sheet of horizontal task bars — lying across a drafting table, shot from directly above under cool window light. The bars read as rows of pale grey rectangles; the text is too small and soft to read. A straightedge lies across the sheet on the diagonal, and a small orange sticky flag marks one row near the right — the only saturated element. Cream paper, graphite linework, blue-grey rules. No people, no readable words or dates. Photographic, straight-down, deep focus, fine grain.

---

## Open questions

**1. Branch discrepancy.** This manifest is built against `feat/cma-2027-build`, not `main`, because `/review/[reviewId]` (used in the seed verdicts) only exists there. If `main` is the intended target for wiring, hold off on any Review Mode row until that branch merges — or confirm the target branch and this gets re-run against it.

**2. No standalone Riverton case.** `data/cases/` has exactly three companies: `meridian-building-group`, `northstar-services`, `whitfield-dissolution`. "Riverton" appears 8 times, but only inside `meridian-building-group/case.json` as company-profile data (a related entity), never in any of Meridian's 8 workflow files. There is currently no route or UI slot a Riverton-specific image could attach to — `case-riverton` (already delivered, strong asset) has nowhere to go until either a Riverton case ships or Meridian's case detail page grows a "related entities" band that could carry it.

**3. Review Mode companies corrected.** The seed table assumed Review Mode workpapers tie to Meridian/Riverton. They don't: `data/review/*.json` holds 7 one-off fictional companies (Ashgrove Constructors, Rivet & Stone Holdings, Bellhaven Interiors, Vantage Mill Development, Cardinal Ridge Contracting, Foxglove Utility Services, Harbor Line Builders), none reused, none tied to the Apply Lab cases. One photo per company would blow the asset ceiling for exercises used once each, so `/review/[reviewId]` gets no image — the flaggable workpaper grid is already the visual.

**4. Northstar and Whitfield get `none`, not a reused construction photo.** Northstar Services is professional services; Whitfield Dissolution is a forensic/litigation-support matter. Neither has a jobsite. Reusing `case-meridian` there would make the image a metaphor for "case work" rather than real material, which the decision rule this task shipped with explicitly forbids.

**5. New Ledger routes not in the original seed table.** `/ledger` and `/ledger/[bookId]` (the double-entry posting engine built this session) didn't exist when the seed verdicts were written. Both get `none` — the four live tabs (post entry, trial balance, statements, chart of accounts) are the screen's own content, the `workpaper`/`dashboard` classes' explicit hard stop.
