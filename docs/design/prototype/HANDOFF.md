# Accountrix Academy — Design Handoff

> Living design spec for Claude Code. The visual/UX source of truth is `Accountrix Academy.dc.html`
> (a single self-contained prototype) plus the mascot `Rivet.dc.html`. This doc explains the
> intent, the system, what exists, and the direction to keep building.

---

## 1. Product vision

**"Duolingo × Becker" for the accounting/finance licensing journey.** A gamified but credible
study app that prepares a learner for hard professional exams and, ultimately, the CFO seat.

**North star = MASTERY.** The goal isn't just passing — it's becoming a *master* of finance and
accounting. Aim for **master's-level depth that feels easy and fun**, so anyone could learn from it.
Every section needs genuinely deep material, world-class visuals, and teaching tools no other app
has. "High-level learning, low-friction experience."

**The user (real, single-user for now — not a commercial product yet):**
A finance student who will, in order:
1. Finish the **Finance** degree (corporate finance).
2. Sit the **CMA** exam after graduation.
3. Eventually sit the **CPA** exam.
4. Use all of it to **take over as CFO** of their company.

So the three learning **tracks are a personal timeline**, not just categories. Default track is
**Finance** (where the user is today); CMA and CPA are ahead of them. Monetization, multi-tenant
accounts, and "selling" are **out of scope** until told otherwise — optimize for one serious learner.

**Non-negotiables (keep these):**
- Gamified: XP, day-streak (flame), 5 hearts/day, badges, tiers — celebratory.
- Credible: never looks like a toy; it preps for real licensure.
- Accessible: strong contrast, legible type, **never encode meaning in color alone** (always pair an icon/shape), text-to-speech on every page.

---

## 2. Brand & design system

**Name / theme:** "Blueprint & Safety-Orange" — construction-finance energy (the CPA track is a
construction-finance curriculum), but it generalizes to all three tracks.

**Type**
- Display / headings: **Space Grotesk** (600/700)
- Body: **Inter** (400–700)
- All figures (XP, money, timers, calculator, registers): **JetBrains Mono** — the "ledger" signal. Use mono for every number.

**Color tokens** — defined as CSS variables in a `:root` block, switched by `data-theme` and
`data-mode` attributes on `<html>` (see §4). Map these 1:1 to Tailwind v4 theme tokens.

| Token | Light | Dark | Meaning |
|---|---|---|---|
| `--bg` | `#ECE7DC` | `#0B1521` | app background (warm concrete / blueprint navy) |
| `--surface` | `#FFFFFF` | `#13212F` | cards |
| `--surface2` | `#F7F3EA` | `#0F1C2A` | insets, segmented bg |
| `--line` / `--line2` | `#E4DCCC`/`#D7CDB9` | `#213447`/`#2C4258` | hairlines / stronger rules |
| `--text` / `--dim` / `--mute` | `#16212E`/`#566372`/`#8B95A1` | `#EAF1F8`/`#A2B4C5`/`#7188A0` | text ramp |
| `--ink` | `#0E1B2C` | `#16273B` | deep navy panels |
| `--brand` | `#F5621D` | `#FF7A3C` | safety-orange primary |
| `--signal` | `#2C5DB6` | `#5E92F0` | blueprint-blue secondary |
| `--gold` | `#C7820F` | `#FFC04D` | citron-gold (legendary, streak) |
| `--teal` | `#0E9C9C` | `#27C2C2` | rare/teal accent |
| `--success` / `--danger` | `#188A5C`/`#D2303E` | `#36C98C`/`#FF5C66` | states (always paired w/ ✓/✗ icons) |
| `--accent` | = `--brand` (Study) / `--signal` (Exam) | same | **mode-driven** accent |

**Mascot — "Rivet"**: a hard-hat beaver "site foreman" (`Rivet.dc.html`). Props: `expression` =
`happy | cheer | think | oops`. Used on Home greeting, Ask-AI, onboarding, video poster, and all
celebration/empty states. Keep him present but never childish.

**6 XP tiers** (rising-skyscraper metaphor — each tier adds floors + a material upgrade):
`Apprentice → Learner → Scholar → Expert → Master → CFO Ready`. Tier thresholds (XP):
`0 / 1000 / 3000 / 7000 / 14000 / 25000`. Current demo user = **Expert (Lv 14, 8,450 XP)**.
The top tier "CFO Ready" intentionally mirrors the user's end goal.

**Streak** = animated SVG flame (orange→gold). **Hearts** = 5/day, deplete on wrong answers in
Study mode. **Badges** = 40 across 5 rarities (common→legendary) with monogram emblems.

---

## 3. Two axes the UI separates (don't conflate them)

1. **Track** (which body of knowledge): `finance | cma | cpa`. Switchable on Home and Path.
   Each has its own 12-month × 4-week curriculum.
2. **Mode** (how you study): `Study` (forgiving — hints, hearts, instant explanations) vs
   `Exam` (timed, no hints, 90s/item — exam-realistic). Toggled via the status-bar pill.
   *Renamed from "Student/CPA Review" so "CPA" only ever means the track.*

`--accent` follows **mode** (orange in Study, blue in Exam). Theme follows light/dark.

---

## 4. Architecture (current prototype)

- Single Design Component `Accountrix Academy.dc.html` (streams top-to-bottom; inline styles only).
  Child DC: `Rivet.dc.html`.
- **Phone frame** centered on a blueprint backdrop; everything is one mobile column (max ~412px).
  Responsive, but **a tablet/landscape layout is still owed** (see §8 — the Pencil notebook + Excel
  really want iPad/desktop).
- **Router:** `state.screen` string + a `stack` for back. Screens are `sc-if` blocks.
- **Theming:** tokens live in a `:root` stylesheet (so they paint instantly while streaming);
  `applyTheme()` flips `data-theme`/`data-mode` on `<html>`. Do **not** drive theme via React inline
  style (React reverts it) — this is why attributes on `<html>` are used.
- **State:** one class component; `renderVals()` exposes everything to the template. XP/streak/hearts
  are global; path position is per-track.

### Tech stack to build toward
Next.js 15, React 19, Tailwind v4, Radix + shadcn primitives, Framer Motion, Lucide icons,
light+dark via next-themes. Map the tokens above to Tailwind theme variables; the prototype's
`data-theme`/`data-mode` maps cleanly to next-themes + a `data-mode` attribute.

---

## 5. Screens that exist in the prototype

**P0 — daily loop**
- **Home** — greeting + Rivet, **track switcher (Finance/CMA/CPA)**, stat strip (streak/XP/hearts),
  tier "skyscraper" progress, today's-goal ring + "Continue learning", **Study tools** grid (6),
  daily quests.
- **Learning Path** — Duolingo-style winding nodes, 12 months × 4 weeks, locked/current/done,
  per-track curriculum, "START" bubble on the current node. Week-4 of each month = "EXAM" boss node.
- **Week overview** — Lesson / Flashcards / Quiz tabs, time + XP estimates, status chips.
- **Lesson reader** — long-form ASC 606 walkthrough, sticky TOC, field-note callouts, bookmark,
  reading progress. *(Lesson/quiz/flashcard CONTENT is currently shared across tracks — real
  per-track content is a Claude Code task.)*
- **Quiz** — MCQ, instant feedback + explanation, hearts deplete (Study) / 90s timer (Exam),
  score-review screen.
- **Flashcards** — flip (front term → dark definition card), "Got it / Again" recall rating,
  end summary. *(Upgrade to true Leitner spaced-repetition — see §8.)*

**P1 — depth**
- **Rewards hub** — tabs: Badges (40, rarity legend) / Stats (level, streak grid, hearts, achievements) / AI Plan (urgency-tagged weekly plan with rationale).
- **Profile** — tier progression, longest streak / quiz avg / lessons / badges, **CMA vs CPA rings**, settings (mode, theme, re-run AI setup).
- **AI Onboarding** — conversational; quick-reply chips **and a free-text "type your own" input**
  on every step; ends with a generated plan summary.
- **Ask Rivet** overlay — AI tutor chat with a red **"Fix it now · I'm stuck"** SOS button.

**Tools & new modules**
- **Financial calculator** — BA II Plus-style **TVM solver** (functional): store any 4 of
  N/I·Y/PV/PMT/FV, `CPT` + the 5th solves it (incl. iterative I/Y); live register panel + basic
  arithmetic. Global drawer (bottom-left FAB).
- **Notebook** — pressure-sensitive **Apple Pencil** canvas on ruled paper; pen/marker/eraser,
  5 inks, undo, clear, auto-save to localStorage.
- **Video lessons** — player (play/scrubber/chapters/seek), "Prof. Rivet" poster, jump-to-Notes.
- **Tutor sessions** — book a 1:1 (day+time picker), upcoming-session card, and a full **live
  session** view (video tiles + call controls).
- **Task-Based Simulation (TBS)** — Becker-style: an exhibit + graded input cells (WIP schedule:
  % complete, earned revenue, contract asset), per-cell ✓/✗ + score + XP. *This is the pattern to
  expand into a full sim engine.*
- **Licensing roadmap** — state picker (GA/NY/TX/CA/FL), est. license date, milestone tracker
  (150 hrs / 4 exam sections / experience hrs / ethics exam / application), NASBA-aligned.
- **Read-aloud (TTS)** — status-bar speaker button on **every page**; uses Web Speech API to read
  the current screen; auto-stops on navigation.

---

## 6. Calculator decision (asked & answered)

**One calculator, not two.** The TI **BA II Plus** is the standard for *both* accounting (CMA/CPA)
and corporate finance. Keep the single device and add **worksheet modes** rather than a second
calculator:
- **CF / NPV / IRR** (uneven cash flows) — capital budgeting (Finance) + DCF.
- **Bond** (price/yield), **Depreciation** (SL/DB/SYD), **% / Δ%**, **Amortization**.
Surface a small worksheet switcher inside the existing calc drawer. (Separately, the real CPA exam
is **Excel-based** — that's the Excel module below, not a calculator.)

---

## 7. ⭐ Excel training (new requirement — build this)

The user must be able to **study on the phone app or laptop, and do hands-on Excel work on a
computer.** Treat Excel fluency as a first-class module, because (a) the CPA exam interface is
Excel-based and (b) a CFO lives in spreadsheets.

Design intent for Claude Code:
- **Cross-device, continuous:** lessons/drills are consumed on mobile; the *doing* happens in real
  Excel on desktop. A learner starts a drill on the phone → "Continue on desktop" hands off the same
  task to the laptop (same account/session).
- **In-browser spreadsheet trainer** on desktop: a real grid where the user types formulas and gets
  instant validation (formula + result checked). Start with a lightweight grid (e.g. a
  formula-evaluating sheet) before integrating a heavier engine.
- **Curriculum:** core formulas (SUM/IF/VLOOKUP-XLOOKUP/INDEX-MATCH/SUMIF/PMT/NPV/IRR), financial
  modeling (3-statement, WIP schedule in Excel, budget vs actual, DCF), keyboard-shortcut drills,
  and "rebuild this CFO report" capstones.
- **Mobile role:** watch the technique, take the quiz, queue the desktop drill, review keystrokes —
  *not* full spreadsheet editing on a phone.
- Mirror the existing TBS scoring pattern (cell-by-cell ✓/✗ + XP) for Excel drills.
- Add an **"Excel" tool tile** on Home and a track-agnostic Excel section in the Path/Tools.

---

## 7b. Content depth & AI media pipeline (core differentiator — build this)

The teaching material is the moat. Every section (across Finance, CMA, CPA) ships **two paired
formats**, both deep:

1. **Video lesson** — a narrated, visual explainer (animations, infographics, worked examples).
2. **Textbook-style written lesson** — long-form, genuinely in-depth reference (formulas, callouts,
   worked examples, exam traps). The prototype's Lesson reader is the shell; the *content* must be
   master's-level for every section. (Claude Code authors this.)

**AI content/media pipeline to integrate:**
- **NotebookLM API** — generate video lessons, infographics, and explainer media from source
  material per section. Use it to mass-produce the visual teaching layer (diagrams, animated
  walkthroughs, "deep dive" overviews) at scale.
- **ElevenLabs API** — human-form **audio + video** narration so lessons feel like a real instructor,
  not a robot. Pairs with the existing read-aloud (TTS) layer: ElevenLabs for produced lessons,
  Web Speech as the on-device fallback for arbitrary page read-aloud.
- **Visual ambition:** infographics, motion, and interactive diagrams should be best-in-class —
  "incredible visuals no other app has." Treat the video player + infographic blocks as first-class
  lesson components, not afterthoughts.

**Design implication:** the Lesson/Video screens already model the dual format (a video player + a
rich text reader + jump-to-Notes). Extend every section to carry: deep written lesson, generated
video, narrated audio, infographics, and the matching quiz/flashcards/TBS.

---

## 8. Roadmap / what's still missing (prioritized)

1. **Deep dual-format content + AI media pipeline** (§7b) — the differentiator: master's-level
   written + video lessons for *every* section, via NotebookLM (video/infographics) + ElevenLabs
   (human-form audio/video). This is the heart of "mastery."
2. **Excel training module** — *designed* in the prototype (Excel screen + tile: cross-device
   handoff, live spreadsheet-trainer preview, drills). Build out the real in-browser graded grid +
   desktop layout + full curriculum (§7).
3. **Real per-track content** — Finance/CMA/CPA each need their own lessons, quizzes, flashcards,
   and TBSs (currently the engine is shared with CPA/ASC-606 sample content).
3. **Full TBS / sim engine** — more sim types (journal entries, document review, ratio analysis),
   the WIP card is just the seed.
4. **Exam-readiness score** — predicted pass-likelihood meter (Becker's signature hook; great
   motivation even for a single user).
5. **Diagnostic placement test** at onboarding — set the starting tier from real performance, not
   just self-report.
6. **Backward study planner** — enter the exam/CFO-transition date → schedule months in reverse with
   daily targets + countdown.
7. **Adaptive review** — true Leitner spaced-repetition on flashcards + a weak-topic review queue.
8. **Accounts / cross-device sync + offline (PWA)** — required for the mobile↔laptop Excel handoff;
   the prior "Fluency" app was offline-first, match that.
9. **Notifications / streak-savers** — retention nudges.
10. **Calculator worksheets** (§6: CF/NPV/IRR, bond, depreciation, amortization).
11. **Tablet/landscape + desktop layouts** — the Pencil notebook and Excel trainer need real estate;
    the phone frame is only the mobile view.
12. **Settings / loading / empty / error states, in-app search** — the unglamorous-but-required set.
13. **CPA Evolution disciplines** — 2024 CPA is 3 Core + 1 Discipline (BAR/ISC/TCP); add a discipline
    picker to the CPA track.
14. **Accessibility depth** — dynamic type, video captions, full keyboard nav, ARIA labels (TTS + contrast already done).

**Deprioritized (per user):** monetization, paywalls, multi-tenant accounts, marketing — not selling yet.

---

## 9. Prototype caveats (so you don't mistake them for bugs)

- The design preview **freezes CSS animations/transitions at t=0** — so state changes are driven by
  instant swaps and discrete values, not transitions. Motion (flip, confetti, streak flame, video
  progress) animates correctly in a real browser; don't rely on `transition`-driven reveals.
- **3D `transform` flip** mirrors under flat capture — the flashcard uses an opacity/sc-if swap instead.
- **Lesson/quiz/flashcard content is shared across tracks** in the prototype — wire real per-track content.
- **TTS** uses the browser Web Speech API; provide narrated audio + offline download for production.
- Theme/mode are applied via `<html data-theme data-mode>` (React reverts inline-style token writes).

---

## 10. File map

| File | What |
|---|---|
| `Accountrix Academy.dc.html` | The whole app prototype (all screens, logic, tokens). |
| `Rivet.dc.html` | Mascot component (`expression` prop). |
| `HANDOFF.md` | This document. |
