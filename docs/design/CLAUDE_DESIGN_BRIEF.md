# Accountrix Academy — Claude Design Brief

**Goal:** Design the UI/UX (interactive prototype) for Accountrix Academy — a gamified
CMA → CPA exam-prep app that teaches accounting through real construction-finance transactions.
Think **Duolingo for the CPA/CMA exam**.

> Scope note: design the **Academy** (the study app) only. Ignore the "Operations"
> construction-SaaS roadmap — that's a separate, unbuilt product.

---

## 1. Product in one line
A gamified study app that turns CMA Part 1/2 and CPA (AUD/FAR/REG/BAR) prep into a
streak-driven, XP-earning daily habit — with an AI tutor, personalized plans, and
hands-on accounting simulators (journal entries, bank rec, WIP, month-end close).

## 2. Who it's for
- Working accountants/CFOs prepping for the CMA, then CPA.
- Wants short daily sessions, clear progress, and "do the actual work" practice — not passive video.

## 3. Existing tech (design must fit this)
- Next.js 15, React 19, Tailwind v4, Radix + shadcn UI primitives, Framer Motion, Lucide icons.
- Fonts: **Poppins** (headings), **Inter** (body).
- Light + dark themes already wired (next-themes).

## 4. Visual direction — FRESH REDESIGN
We want a **bold new visual identity**, not a copy of the current look. Treat the values
below as *reference only* — you have freedom to propose a stronger, more distinctive system.

Hard constraints to keep:
- **Stay gamified** — XP, streaks, hearts, badges must feel celebratory and game-like.
- **Stay credible** — it preps people for a hard professional exam; avoid looking like a toy.
- **Accessible** — strong contrast, legible type, color-blind-safe states (don't encode meaning in color alone).
- Must work in **light AND dark**, **mobile AND desktop**.

Current palette (for reference, feel free to replace):
- Blue `#3B82F6`, deep blue `#1E3A8A`, success green `#10B981`, amber `#F59E0B` (XP/streak), red `#EF4444` (hearts).
- Poppins headings + Inter body; rounded chunky cards; confetti + bounce animations; a paper-airplane mascot.

Push for: a signature color story, a memorable progress/streak visual, and a mascot/illustration
style that gives the brand personality. Surprise us — then we'll map the winning direction back to Tailwind tokens.

## 5. Screens to design (priority order)

**P0 — core daily loop**
1. **Home / Dashboard** — XP + level, day-streak (flame), hearts (5/day), "Continue Learning" CTA, today's goal, progress bar.
2. **Learning Path** (`/months`, `/learn`) — 12-month map, 4 weeks each, locked/unlocked nodes, progress dots. (Duolingo path feel.)
3. **Week Overview** — tabs for Lesson / Flashcards / Quiz, time estimates, status.
4. **Lesson** — readable long-form content, table of contents, inline notes, bookmark.
5. **Quiz** — MCQ, instant feedback + explanation, hearts deplete on wrong, score summary/review.
6. **Flashcards** — flip animation, spaced-repetition session, progress.

**P1 — gamification & motivation**
7. **Gamification dashboard** — XP/level, streak, hearts, daily goals, achievements.
8. **Badges** — 40 badges, 5 rarities (common→legendary), 5 categories; grid/list/showcase (pin 5), unlock notification w/ confetti.
9. **Profile** — level progression, longest streak, quiz average, bookmarks, CMA vs CPA progress side-by-side.

**P1 — AI personalization**
10. **Onboarding** — form + conversational variants; collects role, industry, software, pain points (with urgency), goals, timeline, hours/week.
11. **Personalized Plan** — AI-generated weekly plan; urgency tags (CRITICAL→LOW), due dates, mark-done, rationale.
12. **AI Tutor ("Ask AI")** — global overlay chat; **"Fix It Now"** SOS button → assist session with suggestions/follow-ups.

**P2 — interactive practice (differentiators)**
13. **Simulators** — Journal Entry, Bank Reconciliation, Trial Balance, Month-End Close, Cost-Code Posting, Chart-of-Accounts Builder. Hands-on, form-driven, validate-as-you-go.
14. **CPA Crossover** — exam-style timed drills across AUD/FAR/REG/BAR with rationale.
15. **Settings / Mode switch** — Student Mode (guided, hints, unlimited retakes, hearts) vs CPA Review Mode (timed, no hints, analytics).
16. **Search** — full-text across lessons/flashcards.

## 6. Core mechanics to make visible in the UI
- **XP & levels:** 6 tiers — Apprentice → Learner → Scholar → Expert → Master → CFO Ready.
- **Hearts:** 5/day, lose one per failed quiz, daily refill.
- **Streaks:** daily, flame icon, longest-streak record, at-risk state.
- **Two learning modes:** Student (forgiving) vs CPA Review (exam-realistic) — needs a clear toggle and visual difference.
- **Two tracks:** CMA (12 months) and CPA (units/exams) — progress tracked separately; surface both without confusing them.

## 7. Design priorities
1. **Daily-habit feel** — the home screen must make "do today's lesson" the obvious one-tap action.
2. **Progress is the dopamine** — streaks, XP bar, badges should feel earned and celebrated.
3. **Mobile-first** — short sessions on phone; desktop is secondary.
4. **Trustworthy + fun** — it's a professional exam, but engagement is the moat. Balance credibility (clean, blue, competent) with playfulness (mascot, confetti, bounce).
5. **Reduce the two-track confusion** — make CMA vs CPA, and Student vs Review mode, legible at a glance.

## 8. Deliverable from Design
Interactive prototype of P0 + P1 screens, light & dark, mobile + desktop, using the
color/typography system above. A clean component set (cards, buttons, progress, badges,
quiz states, streak/XP/hearts header widget) we can map back to the existing Radix/shadcn components.
