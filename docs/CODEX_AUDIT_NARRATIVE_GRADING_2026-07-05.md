# Codex Audit — Narrative Grading Checklist P1

Task: `narrative-grading-checklist-p1`  
Commit audited: `b3a86d6`  
Verdict: APPROVED

## Scope audited

- `lib/narrativeGrading.ts`
- `components/ApplyWorkflowClient.tsx`
- `components/EssayPlayer.tsx`
- `lib/sims-content.ts`
- `data/essays/cma-p1-variance.json`
- `data/essays/cma-p2-capital-budgeting.json`
- `lib/examReadiness.ts`
- `app/readiness/page.tsx`
- `tests/unit/narrativeGrading.test.ts`
- `tests/unit/sims-content.test.ts`
- `tests/unit/apply-grading.test.ts`
- `tests/unit/examReadiness.test.ts`

## Verdict

Approved. The implementation directly addresses three prior audit follow-ups:

1. Flat keyword stuffing no longer passes narrative grading.
2. CMA essay prompts now use concept groups and higher word floors.
3. Readiness now separates coverage readiness from tested-only mastery.

## Verification

- Repetition attack fails: repeated terms count as one concept, not repeated credit.
- Bare term-list attack fails through the prose gate.
- Bullet-style prose with complete sentences passes, so the gate does not require one paragraph only.
- Fluent but off-topic prose fails because concept coverage is mandatory.
- CMA essay model answers pass the stricter grader with the raised 80–85 word floors.
- Apply writeups, TBS writeups, CMA essays, and conversation-style narrative grading all route through the same `gradeNarrative` surface.
- Legacy flat keywords still work when concept groups are absent.
- Readiness now shows:
  - coverage readiness: includes untested skills as zero
  - mastery of practiced skills: tested-only score, reported separately

## Non-blocking limitation

The known limitation is real and correctly documented by Fable: this deterministic grader still cannot reliably catch a fluent, on-topic answer that reaches the wrong conclusion while mentioning the expected concepts. A test prompt like “DSCR is below the covenant, so there is no headroom” can pass if it hits coverage/prose/depth/judgment. That is not a regression from the previous keyword grader; it is the boundary of deterministic concept matching.

The correct next step is not more keyword tuning. The next step is one of:

- LLM-assisted rubric grading with deterministic fallback;
- negation-aware checklist rules for high-value sims;
- explicit expected-conclusion fields for each narrative requirement.

## Gates

- `npm run type-check`: pass
- `npm test -- --run`: pass, 273/273
- `npm run validate:content`: pass, 0 blocking errors
- `npm run build`: pass, 47/47 generated static pages
- Privacy grep over app/data/docs/task files: no forbidden-token matches
- `git diff --check HEAD~1..HEAD`: pass

