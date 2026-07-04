# 100-User Market Readiness Audit

Date: 2026-07-04  
Auditor: Codex  
Scope: Accountrix app in the canonical OneDrive repo, after the Fable/Claude repair wave.

## Executive verdict

Accountrix is now usable as a serious private beta for you. It is not yet at “senior engineer selling on the market” quality because the daily learning loop is still uneven: the content library is strong, Mission Control is close, but CPA Practice and Apply Lab are not yet fully connected into the same adaptive assessment system.

The product should not add more lesson volume right now. It already has enough content:

- CMA: 48 lessons, 337 quiz questions, 384 flashcards.
- CPA: 75 lessons, 525 lesson quiz questions, 600 flashcards.
- Finance: 12 lessons, 84 quiz questions, 96 flashcards.
- CPA practice bank: 1,178 exam-style items across FAR, AUD, REG, BAR, ISC, and TCP.
- Apply Lab: 11 workflows across Meridian and Northstar fictional case companies.

The next market-readiness work is product coherence, grading quality, adaptive routing, and first-run polish.

## Method

This is a simulated 100-user product audit, not a live beta. I used code reads, route/API smoke tests, and persona-based walkthroughs. The simulated users were split like this:

| Cohort | Count | What they cared about |
|---|---:|---|
| Controller / junior-CFO learners | 25 | Apply Lab, WIP, close, cash, lender/CPA conversations |
| CPA candidates | 20 | Section coverage, exam-style MCQ, review loop, readiness |
| CMA candidates | 20 | Full 12-month path, practical accounting judgment |
| Finance students | 15 | B+ target, class prep, TVM/bonds/WACC/capital budgeting |
| Mobile / short-session users | 10 | Navigation, quick review, flashcards, resume flow |
| Returning users | 5 | Progress, backup/restore, “what should I do today?” |
| Skeptical buyers | 5 | Does this feel finished, coherent, and trustworthy? |

## What users would like

1. The content depth is real. A serious learner can spend months here without exhausting the material.
2. The fictional company strategy is correct. It protects privacy while still teaching controller/CFO patterns.
3. Mission Control is the right home base. The app should open with “what to do next,” not a generic catalog.
4. Apply Lab is the differentiator. Users immediately understand why doing a WIP schedule, bank rec, cash forecast, or close workflow is more valuable than passive MCQ repetition.
5. The Finance page has the right angle for your August class: grade target, parametric drills, and practical formulas.
6. The profile/progress separation by CMA, CPA, and Finance is much cleaner than mixing every result into one bucket.
7. The app finally feels like one product instead of a pile of content routes: header, mobile nav, Mission, Learn, CPA Lessons, Finance, Apply, CPA Practice, Search, and Profile all load.

## What still feels clunky

### 1. The first-run experience does not yet act like a coach

A new user still has to decide where to start. For you, that is costly because you are studying Finance, CMA, and CPA simultaneously while working a controller/junior-CFO job.

Expected senior-product behavior:

- Ask the user’s goal: “B+ in Finance by semester start,” “CMA in 12–18 months,” “CPA after CMA,” and “controller/CFO work readiness.”
- Generate the first 7-day plan.
- Put the next action directly on Mission Control.
- Route missed work back into review automatically.

Current behavior: Mission Control is improving, but the empty state still feels more like a dashboard than a prescriptive coach.

### 2. CPA Practice is visibly stale

The backend serves FAR, AUD, REG, BAR, ISC, and TCP. The UI still exposes only AUD/FAR/REG/BAR and says ISC/TCP need reformatting. That is a direct trust hit. A CPA candidate notices this immediately.

This is a P0 market-readiness issue because the app has the content but hides it and misstates its own capability.

### 3. CPA Lessons page copy undersells and mislabels the app

The page says “CPA Core” and “FAR/AUD,” but the app actually has FAR, AUD, REG, BAR, ISC, and TCP lessons. Users need section filters and section-level progress, not one long unit list.

Expected behavior:

- FAR, AUD, REG, BAR, ISC, TCP tabs or grouped sections.
- Unit count and completion per section.
- “Next CPA lesson” CTA.
- Clear split between lesson quizzes and CPA Practice bank drills.

### 4. Apply Lab is better, but not yet CFO-grade

Fable was right that the original Apply Lab exposed answers. That is now improved: answers are hidden until submit, attempts enter the ledger, and misses seed SRS.

The remaining weakness is grading precision:

- Calculation tasks with multiple fields still ask for JSON.
- Journal-entry grading checks broad account presence and balance, not exact account + debit/credit direction + amount per line.
- Writeups can pass by keyword coverage rather than business judgment.
- Conversation simulations collect text but do not score tone, stakeholder fit, quantified support, or risk framing.

For your actual goal — becoming sharper than peers in lender, insurance, CPA, and executive conversations — this is the most important area to harden.

### 5. Flashcards overclaim spaced repetition

There is an SRS review card, and missed items can enter review. But the deck-based flashcard experience still behaves more like “review a deck” than true spaced repetition unless each card rating writes into the same SRS engine.

Market copy should either wire this fully or stop implying every flashcard interaction is adaptive.

### 6. Track metadata still contains old product state

`lib/tracks.ts` still says:

- CMA Part 2 is “in-progress” even though CMA is complete.
- CPA Practice is FAR/AUD/REG/BAR only.
- CPA Core is FAR/AUD/REG only.

This is small code, but high-trust copy. Buyers infer sloppiness from these mismatches.

### 7. Profile is useful but not yet a command center

Profile shows progress and SRS, but users still need a consolidated “readiness forecast”:

- Finance: required average to reach B+.
- CMA: Part 1 / Part 2 readiness and weak domains.
- CPA: per-section readiness and item-bank performance.
- Apply: controller/CFO workflow proficiency.

Right now the data exists in pieces. It needs one simple read: “You are ahead/behind/on-track, and here is the next highest-value action.”

### 8. There are still public-facing placeholders

Examples:

- Settings: “Account settings coming soon,” “Notification settings coming soon.”
- Profile: “Daily goals and calendar visualization coming soon.”
- Quiz review: PDF export alert says “coming soon.”

For a private tool this is acceptable. For market-quality polish, hide unavailable features or label them as “not included in this version.”

## What is missing for your specific use case

You are not a normal student user. Your app needs to accelerate three lanes at once:

1. Finance class performance before August.
2. CMA pass readiness within 12–18 months.
3. CPA/accounting depth for controller/junior-CFO work, then CPA after CMA.

The missing feature is not more content. It is a weekly operating plan that blends all three:

- Monday/Wednesday/Friday: CMA + Apply Lab.
- Tuesday/Thursday: CPA section work + CPA Practice.
- Daily short block: Finance drill or flashcards.
- Weekly review: “what changed in readiness, what mistakes repeated, what to do next week.”

That should be the app’s private “market-ready for Ken” mode.

## Ranked fix list

### P0 — Must fix before calling it market-ready

1. Expose ISC/TCP in CPA Practice and wire CPA Practice attempts into the same attempt ledger, SRS, and Mission readiness.
2. Upgrade Apply Lab grading:
   - exact JE line grading;
   - form inputs instead of JSON for multi-field calculations;
   - rubric scoring for writeups and conversation sims.
3. Build first-run plan generation:
   - target B+ in Finance;
   - CMA 12–18 month timeline;
   - CPA after CMA;
   - controller/CFO work-practice lane.
4. Remove or correct stale product copy on `/cpa`, `/crossover`, `/tracks`, `lib/tracks.ts`, Settings, and Profile.

### P1 — Should fix during final polish

1. CPA Lessons section dashboard: FAR/AUD/REG/BAR/ISC/TCP grouping, progress, next lesson, weak section.
2. Flashcards either write ratings into SRS or stop using adaptive-language claims.
3. Profile readiness forecast across Finance, CMA, CPA, and Apply.
4. Full exam/practice sessions from the CPA bank with timing, review, and mistake classification.
5. State backup restore needs one-click restore, dry run, schema validation, and version/build SHA.

### P2 — Nice but not blocking for your personal market-ready version

1. Polish visual consistency: remove hardcoded old blue values where design tokens should handle it.
2. Reduce route sprawl or hide low-value routes from navigation.
3. Accessibility pass: keyboard navigation, focus states, ARIA, contrast, and reduced-motion behavior.
4. Archive stale docs that claim unbuilt features are complete.
5. Add Playwright happy paths for Mission → lesson → quiz → miss → SRS review → Apply task.

## The pushback

Do not restart the design. Do not add more bulk lesson content right now. Do not spend the next cycle on video, tutor booking, or cosmetic gamification.

The highest-leverage product is:

> Mission Control tells you what to do today. You learn a concept. You drill it. You apply it in a fictional controller/CFO workflow. Your mistakes feed review. The app updates the next plan.

Everything else is secondary.

## Recommended next build order

1. Fix CPA Practice ISC/TCP + ledger/SRS wiring.
2. Fix stale copy/track metadata in the same pass.
3. Upgrade Apply Lab exact grading.
4. Build the first-run “Ken plan” generator and Mission Control weekly plan.
5. Add CPA section dashboard and readiness forecast.
6. Run a final mobile/accessibility/placeholder sweep.

If those land, the app will feel like a serious senior-engineered personal learning system rather than a large content library with several good engines attached.
