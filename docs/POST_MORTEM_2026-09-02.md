# Post-Mortem — CMA 2027 Build, 2026-09-01 → 2026-09-02

**Prepared by:** Claude (Fable 5.1), continuing a session started by Claude (Opus 5) after a session rate limit interrupted the prior model mid-build.
**Purpose:** full audit of two days of work, prosecuted rather than taken on report, so the next session — Opus or otherwise — has a true state of the repo instead of a set of agent self-reports.
**Branch:** `feat/cma-2027-build` (12 commits, tree clean, not pushed, not merged to `main`).

---

## 1. Status in one paragraph

Two days ago this app had a CMA track that was a well-built outline, not a course: 48 lessons averaging 1,244 words, 337 practice questions for both parts combined, 4 essay scenarios against an exam that scores essays at 25%, and a CPA item bank of 2,081 questions carrying zero skill tags. As of this commit: CMA lessons average ~1,850 words with worked arithmetic and named traps, essays are at 24, the CPA bank is fully tagged and wired into two consumers, a Review Mode defect-detection engine exists with 7 workpapers, a forensic case with 6 graded workflows exists, 78 parametric generators are reachable (was 44, briefly 78-but-unreachable), and the exam planner runs a real backward pass from a committed date (2027-09-15, September/October IMA window) against primary-source-verified blueprint weights. All of that is committed, gated, and privacy-swept. It is not finished — see §5.

## 2. What is good (verified, not assumed)

**The verification discipline held up under its own test.** Nearly every claim in this document was independently recomputed rather than read off an agent's self-report, and that discipline caught real defects — see §4. That is the single most valuable thing about how this two days went, more than any individual feature.

**CMA content depth is real.** Spot-checked two full worked examples (percent-complete/earned-revenue/gross-profit on a construction contract, and a WIP quiz on the same topic) by independent recomputation — both correct, including a quiz item that correctly teaches that computing percent-complete from billings instead of cost _structurally zeroes the over/under-billing signal_, which is the exact defect class flagged in the owner's own 620 pro forma review two days ago. The curriculum is now teaching the owner's own scar tissue.

**The 34 CMA parametric generators are arithmetically sound.** 6,800 instances (34 generators × 200 seeds) were dumped and independently recomputed in a separate Python implementation on 2026-09-01 — zero formula mismatches. Two defects were found and fixed _before_ that number was clean (negative operating income in a leverage ratio, negative hours in a variance generator).

**The forensic case is unusually well-constructed.** `marital-balance-sheet.json` was independently recomputed by hand today, all 11 tasks including the equalizing-payment logic and a reversed-premise scenario — every figure ties exactly, and both parties' final totals land on the case's stated half-share to the penny. This is not a toy exercise; it teaches a genuinely hard skill (isolating gap-neutral rows so a judge or opposing counsel can't waste time arguing about them) with airtight numbers.

**The Review Mode architecture is better than what was asked for.** A defect is a formula operation applied to a clean workpaper's cell, not a hand-typed corrupted copy — so every downstream consequence falls out of a real recompute and can never drift out of sync with its stated root cause. 44.8% of draws are clean on purpose, and the grader scores a false exception at zero — a reviewer who can't sign off on correct work is graded as failing, same as one who signs off on bad work.

**Four real grader defects were found and fixed, not just flagged.** See §4.4. This matters because a grading bug in a study tool is worse than no grading — it actively teaches the wrong lesson (that a correct answer is wrong) or teaches nothing (a wrong answer that passes).

## 3. The pattern that matters more than any single feature

**Four separate times in two days, something was built, tested, and reported done — while being either unreachable, unwired, or silently producing the wrong output — with green tests the whole time.**

| #               | What                                                                                                                                                                                                                                                     | How it hid                                                                                                                                                                              | Who caught it                                                                                                                                                             |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1               | `lib/cpaSkillMap.ts` routed ASC 830 (foreign currency translation) to `hedge-accounting` (ASC 815)                                                                                                                                                       | The unit test asserted the _bug_ as correct behavior, so it passed                                                                                                                      | Opus, while wiring the tagging into consumers                                                                                                                             |
| 2               | 2,081 tagged CPA items had no effect on the app                                                                                                                                                                                                          | Neither `/crossover` nor the diagnostic API read the new `skills` field — both still called the old keyword mapper                                                                      | Opus, by checking consumers instead of trusting the tagging report                                                                                                        |
| 3               | `buildExamTimeline` silently produced a 2-phase plan (6-week first pass + 33 weeks of undifferentiated "exam mode") for any unrecognized section id, with `unallocatedAreas` reporting nothing wrong                                                     | 43 tests passed while the primary output — the actual weighted schedule — was wrong                                                                                                     | Opus, by probing the function directly instead of reading the test file                                                                                                   |
| 4               | 34 CMA parametric generators shipped, verified, tested — and were never imported by anything. Zero practice surfaces could reach them                                                                                                                    | The generator file itself was internally correct and well-tested; the _registry_ that composes practice surfaces never grew                                                             | Opus, by grepping for importers before declaring the task complete                                                                                                        |
| 5 (found today) | Real intercompany account numbers (`89010`, `89011`, `89012`, `89013` — the owner's actual employer's ICP/ICR/note accounts, documented in the workspace's own CLAUDE.md) appeared in three CMA lessons, attached to the app's fictional company names | The company _labels_ were correctly fictionalized; the account _numbers_ were copied verbatim from source material the authoring agent had read, and nothing checks numbers, only names | Fable, running a targeted regex sweep for the exact real account numbers on record — the earlier privacy sweeps only checked entity/person names, not numeric identifiers |

**The lesson, stated plainly:** a green test suite and a task marked "done" are claims about what was attempted, not about what works. Every one of these five was caught by someone actually calling the function, checking who imports it, or grepping for the specific real-world string — not by reading the report. **This should become a standing step, not a one-off.** See §6.

## 4. Findings from today's audit, in detail

### 4.1 Rate-limit interruption, not a build failure

Four agents were terminated mid-task by a session rate limit (resets 3pm ET), not by an error in their own work. Their partial output was sound as far as it went:

- CMA depth agents (m1–m3, m4–m6): all 24 files present, schema-valid, none catastrophically short (worst case 2,119 words against a 2,600 target — still nearly double the pre-build average).
- Applied-construction agent: completed U4 (4/4 weeks) and U5 (3/4 weeks — **w4 missing**), then stopped. U6 and U7 (multi-entity, development pro forma) were **not started at all**.
- Forensic-batch-2 agent: completed all 4 assigned workflows and a 70-test suite before being cut off at "now the full gates" — the gates were never actually confirmed by the agent itself. Fable re-ran them: all pass.

### 4.2 Privacy leaks — found and fixed

Two categories, both fixed and re-verified clean:

- **`m4-w2.json`**: the real acquirer abbreviation "the acquirer" (Dream Finders Homes) appeared in a WIP-reversal example. Genericized to "post-acquisition reversals."
- **`m1-w4.json`, `m3-w2.json`, `m3-w4.json`**: the real HBG/Keowee intercompany account numbers 89010/89011/89012/89013 appeared attached to the fictional MBG/Riverton case names. **The company names being fictional did not make this safe** — anyone who knows the real chart of accounts recognizes the numbers regardless of the label next to them. Renumbered to an arbitrary 89010–89013 block with no relationship to any real account documented anywhere in the workspace. First fix pass only touched `lessonHtml` and missed quiz/flashcard fields; second pass did a whole-file replace and re-verified clean.

**Implication for §6:** the standing privacy sweep needs to check numeric identifiers (account numbers, dollar anchors) with the same rigor as entity/person names. It currently does not, by default.

### 4.3 Schema and integration gaps — found and fixed

- `SKILL_TAXONOMY.md` false-positive check: an early grep against only the bullet-defined ids flagged 26 "violations" that were actually canonical — declared in the CPA sections using an inline `` `id` · `id` `` format instead of bullets. **This was Fable's own error, caught before being reported to the user.** Worth remembering: the taxonomy has two declaration formats, and any future automated check needs both.
- `UNIT_META` in `scripts/build-finance-curriculum.ts` only covered u1–u3, so u4/u5 rendered with the generic fallback title "Finance Unit 4." Extended, and u6/u7 titles pre-registered so they resolve correctly the moment those units are authored.

### 4.4 The four grader defects (context for readers who only see this doc)

Documented in full in the `feat(cma): 24 essay scenarios and four grader fixes` commit; summarized here because it is the clearest example of the §3 pattern applied to _grading logic_ rather than content:

1. A **correct answer was marked wrong** — a capital-rationing conclusion blocked on the exact phrase its own prompt demanded and its own concept rubric rewarded.
2. **Substring matching** credited figures never computed (`"$30"` matched inside `"$300,000"`).
3. **Conclusion gates were satisfied by numbers handed to the learner** in the scenario itself, not derived (`"6,000,000"` is a substring of the given `"$146,000,000"`).
4. **Negation was near-blind** — "not a prior period adjustment" and "neither method changes the total" both scored as _asserting_ what they deny.

All four fixed in `lib/narrativeGrading.ts`, all 48 model answers re-verified to still pass their own rubrics after the fix.

## 5. What is not built — the honest gap list

Pulled forward from `docs/MASTERY_BUILD_PLAN.md` and updated with today's actual state, not the plan's aspirational state:

| Item                                                                       | Plan ref          | Status                                                                                                                                      |
| -------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Applied Finance U6 (multi-entity: clearing vs elimination)                 | —                 | **Not started.** This is arguably the single highest-value unit given the real Account 111 problem documented in the workspace — priority.  |
| Applied Finance U7 (development pro forma, draw-to-cash)                   | —                 | **Not started.**                                                                                                                            |
| Applied Finance U5-w4                                                      | —                 | **Missing one file** out of an otherwise-complete unit.                                                                                     |
| F7 Fixed Income & Credit Analysis, F5 Valuation, F4 Capital Structure      | `M-3.1`–`M-3.3`   | **Not started.** These are the finance-degree-gap units; F7 was flagged "build first" in the plan and has not been touched.                 |
| Finance-depth parametric generators                                        | `M-3.5`           | **Not started.**                                                                                                                            |
| AUD item tagging for CFE/forensic skills                                   | `M-4.3`           | **Not started** — the 498 AUD items are tagged to CPA skills (done today) but not yet cross-tagged for the forensic/CFE track specifically. |
| WIP worksheet, SOV/G702 builder, pro forma builder, draw-to-cash simulator | `M-4.5`           | **Not started.** No UI component work has happened yet; everything built in two days is data and grading logic.                             |
| Document-request drafting workflow, cross-examination sim                  | `M-4.2` (partial) | **Not started** — only 4 of the originally-scoped forensic workflows landed; these two were never attempted.                                |
| CMA m7–m12 (Part 2) depth pass                                             | —                 | **Not started.** All depth work so far is Part 1 only. Part 2 is still at the original ~1,244-word average.                                 |
| Money-math prosecution pass, Wave 5                                        | `M-5.x`           | **Not started as a formal pass** — today's audit substitutes for part of it but was not exhaustive (see §5.1).                              |

### 5.1 What this audit did NOT check

Being honest about the limits of what got verified today, in the spirit the owner's own CLAUDE.md demands:

- Only 1 of 6 forensic workflows (`marital-balance-sheet`) was hand-recomputed end to end. The other 3 new ones (`population-correction`, `retirement-trueup-gap`, `net-not-drawn-back`) were validated for JSON structure and passed their own 70-test suite, but **not independently recomputed by a second method** the way `marital-balance-sheet` and yesterday's two workflows were.
- Only 2 quiz items and 0 full worked-examples were spot-checked out of 24 deepened CMA lesson files. The word-count and schema checks are complete; the _arithmetic_ checks are a sample, not a census.
- The privacy sweep for real account numbers used a curated list built from what CLAUDE.md happens to document. It is not exhaustive — it would not catch a real dollar figure or entity detail that isn't already written down somewhere Fable could grep.
- No UI/browser verification happened at all today — everything checked was data, logic, and test output. `npm run dev` was never started.

## 6. Direction for the next session (Opus or otherwise)

**Immediate, in order:**

1. Finish Applied Finance U5-w4, then U6 and U7 — U6 (clearing vs elimination) is the highest-leverage unit not yet built given the real Account 111 problem on record.
2. Hand-recompute the remaining 3 forensic workflows the way `marital-balance-sheet` was checked today. Don't take the 70-test suite as sufficient on its own — §3 is the reason why.
3. Before marking _any_ future task done, grep for importers/consumers of what was just built. This is now a proven failure mode, not a hypothetical one — it happened four times in two days.
4. Extend the privacy sweep script (currently ad hoc, run by hand each time) into something reusable that checks numeric identifiers, not just names. Consider making it a pre-commit hook given how many times it has already caught something real.
5. F7 (credit analysis) was designated "build first" in the finance-depth plan and has had zero work. If the next session has capacity for one new content area, that's it.

**Don't re-litigate:**

- CMA target is locked: **September/October 2027**, planning date `2027-09-15`, persisted in `lib/store.ts` as `DEFAULT_EXAM_TARGET`. Do not re-ask.
- CPA is deferred to ~2028; CFE is the next credential after CMA. Also locked, see the memory file `cma-exam-target-2027.md`.
- The IMA blueprint weights in `lib/examSections.ts` are verified against the primary Content Specification Outlines source, cited inline. Do not re-derive them from a search summary.
- The ~300-hour anchor in `lib/studyPlan.ts` is explicitly labeled unverified. Don't quote it as fact; don't "fix" it without a primary source either.

**Push/merge decision:** branch is `feat/cma-2027-build`, 12 commits, gated clean, not pushed anywhere and not merged to `main`. That's the owner's call, not something to do automatically.
