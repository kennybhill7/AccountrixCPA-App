# Accountrix

Accountrix is a local-first learning and practice app for Finance, CMA, CPA, and applied controller/CFO workflows. It is built for intensive study: lessons, exam-style drills, simulations, notes, flashcards, readiness scoring, and fictional case-company workpapers all feed the same progress loop.

## Current product scope

- **Finance:** 12 corporate-finance lessons for class prep and B+ target planning.
- **CMA:** 12 months / 48 lessons covering Part 1 and Part 2.
- **CPA:** FAR, AUD, REG, BAR, ISC, and TCP lessons plus the CPA practice bank.
- **Apply Lab:** fictional controller/CFO workflows for practical workpaper judgment.
- **Learning loop:** Mission Control, diagnostic placement, quizzes, simulations, mistake bank, SRS review, notes, bookmarks, and readiness reporting.

Runtime content currently totals:

- **3 tracks**
- **135 lessons**
- **946 lesson questions**
- **1,080 flashcards**
- **2,081 usable CPA practice-bank items**

All company/workpaper data shipped in the app is fictional.

## Tech stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- Zustand local-first stores
- Vitest unit tests
- GitHub Actions CI

## Development

```bash
npm ci
npm run build:curriculum
npm run build:cpa-curriculum
npm run build:finance-curriculum
npm run build:cpa-items
npm run validate:content
npm run type-check
npm test -- --run
npm run build
npm run dev
```

Open <http://localhost:3000>.

## Important routes

- `/mission` — daily command center
- `/diagnostic` — cross-track placement diagnostic
- `/readiness` — readiness report by exam section
- `/learn` — CMA lessons
- `/finance` — corporate-finance lessons
- `/cpa` — CPA lessons
- `/crossover` — CPA practice bank
- `/sims` — TBS and essay simulations
- `/apply` — fictional case-company workflows
- `/notes` — notes and note-derived flashcards
- `/reference` — formula/reference sheet
- `/state` — local backup and restore

## Generated content files

The app renders assembled JSON files. After editing source curriculum, rebuild and commit the generated outputs:

- CMA source: `data/curriculum/cma/*.json` → `data/curriculum.json`
- CPA source: `data/curriculum/cpa/**/*.json` → `data/curriculum-cpa.json`
- Finance source: `data/curriculum/finance/*.json` → `data/curriculum-finance.json`
- CPA item YAML: `data/cpa/content/items/*.yaml` → `data/cpa/items.json`

CI fails if generated files drift.

## Privacy and launch prerequisites

Before public deployment:

1. Configure the GitHub secret `PRIVACY_DENYLIST_REGEX`.
   - CI intentionally fails when this secret is missing.
   - The regex should cover private names, entities, emails, account numbers, and real dollar anchors that must never ship.
2. Pick hosting and environment policy.
   - Vercel is the expected default for the current Next.js app.
   - The app is currently local-first; cross-device sync, paid accounts, and subscriptions require a backend decision.
3. Have counsel review `/privacy` and `/terms`.
   - Current pages accurately describe the local-first model, but they are not legal advice.

## Quality gates

Local baseline before pushing:

```bash
npm run validate:content
npm run type-check
npm test -- --run
npm run build
```

Known non-blocking build warnings:

- `lib/professor-adapter.ts` dynamic dependency warning
- outdated Browserslist/caniuse-lite advisory
- package module-type warning for `tailwind.config.ts`

## Collaboration protocol

Agent work is coordinated through `.agent/tasks.json`.

Statuses:

- `needs_review` — built and waiting for reciprocal audit
- `rework_required` — reviewer found a defect; fix before continuing
- `approved` — reciprocal audit accepted the work

Do not treat old planning docs as source of truth when they conflict with the app. Verify against current code, current generated curriculum, and `.agent/tasks.json`.
