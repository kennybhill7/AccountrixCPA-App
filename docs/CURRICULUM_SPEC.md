# Accountrix Curriculum Spec — CMA (now) → CPA (next)

> **Authoring law:** Teach every exam topic through **fictional but CFO-realistic case data**. No real company, bank, vendor, project, employee, personal finance, or private class data may ship in curriculum, cases, docs, screenshots, or generated bundles.
> Trial Balance is the anchor; bank ties beat GL. Exact amounts, entity-segregated, JCS (not Ledgerline 100), no cash labor.
> Each week below = one `Week` object in `lib/schemas.ts` (`lessonHtml`, `flashcards[]`, `quiz{}`).

## Track architecture

The app is a fixed **12-month × 4-week** container. We map the CMA exam onto it 1:1:

| Months     | Track                                                        | Exam          |
| ---------- | ------------------------------------------------------------ | ------------- |
| **m1–m6**  | **CMA Part 1** — Financial Planning, Performance & Analytics | tested first  |
| **m7–m12** | **CMA Part 2** — Strategic Financial Management              | tested second |

CPA Evolution becomes a **second track** (app-code task, Claude lane — see Phase 2 at bottom). Until the multi-track refactor lands, CPA content is staged in `data/cpa/` and surfaced as supplemental "CPA Crossover" callouts inside CMA lessons (every week is tagged with the CPA section it also feeds).

Section weights below are the **IMA CMA blueprint** percentages — drive question counts and study emphasis from them.

---

# PART 1 — Financial Planning, Performance, and Analytics (m1–m6)

## m1 — A. External Financial Reporting Decisions (15%)

| Wk  | Topic                                                        | MBG transaction hook                                                                    | Salvaged source                               | Also feeds |
| --- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------- | --------------------------------------------- | ---------- |
| w1  | The 4 statements + articulation (BS, IS, equity, cash flows) | MBG GL $12,480,000.00 & Riverton $16,920,000.00 — build each statement from the fictional case trial balance | `data/knowledge/professor/financial_modeling` | FAR        |
| w2  | Asset/liability recognition & measurement                    | 14xxxxx WIP as a **balance-sheet asset (CIP)** until close — not expense                | fictional case source §2; `knowledge/construction`     | FAR        |
| w3  | Revenue & expense recognition (intro to ASC 606)             | Cost-to-cost % completion on a fictional case job; Global Status Report % complete                | `data/cpa/modules/module5.json` (Rev Rec)     | FAR, BAR   |
| w4  | Disclosures & integrated reporting                           | Intercompany note disclosure: 89010↔89011, note rec 89012↔89013                     | `knowledge/consolidations`                    | FAR        |

## m2 — B. Planning, Budgeting, and Forecasting (20%)

| Wk  | Topic                                                                | MBG transaction hook                                        | Salvaged source                            | Also feeds |
| --- | -------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------ | ---------- |
| w1  | Strategic planning & budget concepts                                 | MBG group plan: builder vs developer consolidated dashboard | `data/cfo/cfo-month3.json` (CFO dashboard) | BAR        |
| w2  | Budget methodologies (master, flexible, ABB, ZBB, project)           | Project budget vs actual on a single job cost code set      | `knowledge/cost_accounting`                | BAR        |
| w3  | Forecasting techniques (regression, learning curves, expected value) | 13-week cash forecast aligned to WIP draws                  | `Skills 3.3.26` cash-forecast skill        | P2-A       |
| w4  | Pro-forma financial statements & top-level analysis                  | Pro-forma close: 5-day monthly / 3-day quarterly SOP        | fictional case source §6                            | BAR        |

## m3 — C. Performance Management (20%)

| Wk  | Topic                                                                | MBG transaction hook                                                     | Salvaged source            | Also feeds |
| --- | -------------------------------------------------------------------- | ------------------------------------------------------------------------ | -------------------------- | ---------- |
| w1  | Cost & variance analysis (flexible-budget, price/quantity variances) | Job-cost variance: JC-to-GL $390,000.00 on Brookhaven 405                | fictional case source §3.3          | FAR/AUD    |
| w2  | Responsibility centers (cost/profit/investment), transfer pricing    | Each entity as a responsibility center; IC transfer pricing 89010/89011 | `knowledge/consolidations` | BAR        |
| w3  | Performance measures — ROI, residual income, EVA                     | Surety/bonding ratios: working capital, debt-to-equity, backlog          | `knowledge/treasury`       | P2-A, BAR  |
| w4  | Balanced scorecard & segment reporting                               | MBG vs Riverton segment P&L (never combined)                             | fictional case source §6 rule 4     | BAR        |

## m4 — D. Cost Management (15%) ⭐ the construction core

| Wk  | Topic                                                             | MBG transaction hook                                                     | Salvaged source                              | Also feeds |
| --- | ----------------------------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------- | ---------- |
| w1  | Costing systems — **job-order costing**                           | Cost codes → WIP GL 1401-1405 mapping engine                             | `_salvage/ai-cpa/src/lib/costCodeMapping.ts` | FAR        |
| w2  | **WIP schedule & over/under billings** (costs/billings in excess) | MBG WIP $16.9M; gross-profit fade; post-acquisition reversals                         | `CONTENT/labs/wip_cost_to_complete`          | FAR, BAR   |
| w3  | **Job-cost reclass** — period/job transfers; gross vs net footing | CD Q1→Q2 reclass: net $31,250.00 vs footing $32,650.00 (the $700 credit) | fictional case source §3.11; `CONTENT/labs`           | —          |
| w4  | Overhead allocation, ABC, supply-chain, process improvement       | Burden allocation of labor to jobs (PayStream/Apex); retainage 2120      | `data/cfo/cfo-month2.json`                   | REG        |

## m5 — E. Internal Controls (15%)

| Wk  | Topic                                     | MBG transaction hook                                                  | Salvaged source                                       | Also feeds |
| --- | ----------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------- | ---------- |
| w1  | Governance, risk & compliance (COSO)      | COI audit: 49 vendors, 15 expired ($512,000.00), holder-name mismatch | fictional case source §3.7                                     | AUD        |
| w2  | Internal control activities & SoD         | Multi-system rec (JCS/Ledgerline/PayStream); checkbook config         | `knowledge/internal_controls`                         | AUD, ISC   |
| w3  | **Clearing & suspense / cutoff controls** | Account 111 must net $0; combined $95,000.00 Dr; 102.1 gap $47,200.00 | fictional case source §3.9; `CONTENT/labs/intercompany_matrix` | AUD, FAR   |
| w4  | Internal auditing & systems security      | Transaction registry (VERIFIED/POSTED/FLAGGED), immutable audit trail | `Skills 3.3.26` transaction-registry                  | AUD, ISC   |

## m6 — F. Technology and Analytics (15%)

| Wk  | Topic                                                  | MBG transaction hook                                           | Salvaged source             | Also feeds |
| --- | ------------------------------------------------------ | -------------------------------------------------------------- | --------------------------- | ---------- |
| w1  | Information systems (ERP, JCS architecture, data flow) | JCS job-cost GL vs Ledgerline (MF) — crosswalk required        | fictional case source §1             | ISC        |
| w2  | Data governance & data integrity                       | "Acct Ending Bal is NOT cumulative"; exact-match not substring | fictional case source §2 scars       | ISC, AUD   |
| w3  | Data analytics — BI, data mining, visualization        | Recon dashboards; by-job CTL trace; variance-only proof        | `recon_toolkit`             | BAR, ISC   |
| w4  | Tech-enabled finance transformation & automation       | GL Import Pipeline (JCS CSV/Ledgerline TB/QB → COA → flag)     | `Skills 3.3.26` gl-pipeline | ISC        |

---

# PART 2 — Strategic Financial Management (m7–m12)

## m7 — A. Financial Statement Analysis (20%)

| Wk  | Topic                                                | MBG transaction hook                                    | Also feeds |
| --- | ---------------------------------------------------- | ------------------------------------------------------- | ---------- |
| w1  | Liquidity & leverage ratios                          | MBG working capital, current/quick from fictional case TB         | BAR        |
| w2  | Activity & profitability ratios; DuPont              | Asset turnover on $12.5M / $16.9M GLs                   | BAR        |
| w3  | Profitability & market analysis; common-size & trend | MBG vs Riverton common-size segment compare             | BAR        |
| w4  | Special issues — FX, off-B/S, fair value             | Note rec/IC off-B/S elimination; FX (ASC 830 crossover) | FAR        |

## m8 — B. Corporate Finance (20%)

| Wk  | Topic                                                | MBG transaction hook                                        | Also feeds |
| --- | ---------------------------------------------------- | ----------------------------------------------------------- | ---------- |
| w1  | Risk & return, CAPM, cost of capital (WACC)          | Cost of debt: vehicle/equipment loans $310,000.00 portfolio | REG/BAR    |
| w2  | Long-term financing & raising capital                | Construction draw financing; surety/bonding capacity        | BAR        |
| w3  | Working-capital management (cash, AR, AP, inventory) | Retainage 2120 timing; AP lifecycle $284,500.00             | FAR        |
| w4  | Restructuring, M&A intro, international finance      | Intercompany note structure; consolidation eliminations     | FAR, BAR   |

## m9 — C. Decision Analysis (25%) ⭐ highest weight

| Wk  | Topic                                                                             | MBG transaction hook                                    | Also feeds |
| --- | --------------------------------------------------------------------------------- | ------------------------------------------------------- | ---------- |
| w1  | **CVP analysis** — breakeven, margin of safety, operating leverage                | Job-level contribution margin on a fictional cost-code set   | BAR        |
| w2  | **Marginal/relevant-cost analysis** — make-or-buy, special order, sell-or-process | Subcontract vs self-perform decision (labor + burden)   | —          |
| w3  | Pricing decisions; target costing                                                 | Bid pricing off job cost + markup; change-order pricing | BAR        |
| w4  | Constraints (theory of constraints), keep-or-drop                                 | Crew/equipment bottleneck allocation across jobs        | —          |

## m10 — D. Risk Management (10%)

| Wk  | Topic                                           | MBG transaction hook                                   | Also feeds |
| --- | ----------------------------------------------- | ------------------------------------------------------ | ---------- |
| w1  | Enterprise risk management (COSO ERM) framework | MBG risk register: liquidity, surety, COI, single-bank | AUD/ISC    |
| w2  | Operational & financial risk identification     | 7 dormant accounts → $400,000.00 stranded cash         | AUD        |
| w3  | Risk mitigation — hedging, insurance, controls  | COI compliance program; FX hedging (ASC 815 crossover) | ISC        |
| w4  | Quantifying & reporting risk (VaR, sensitivity) | Sensitivity of cash forecast to draw timing            | BAR        |

## m11 — E. Investment Decisions (10%)

| Wk  | Topic                                            | MBG transaction hook                                | Also feeds |
| --- | ------------------------------------------------ | --------------------------------------------------- | ---------- |
| w1  | Capital budgeting process & cash-flow estimation | Equipment purchase vs lease; capitalize vs expense  | REG/FAR    |
| w2  | **NPV & IRR**                                    | NPV of a spec home build (cost-to-complete + draws) | BAR        |
| w3  | Payback, discounted payback, profitability index | Compare two job opportunities by PI                 | BAR        |
| w4  | Risk in capital investment; real options         | Scenario analysis on a development (LJC2 $3.88M)    | BAR        |

## m12 — F. Professional Ethics (15%)

| Wk  | Topic                                                          | MBG transaction hook                                             | Also feeds |
| --- | -------------------------------------------------------------- | ---------------------------------------------------------------- | ---------- |
| w1  | IMA Statement of Ethical Professional Practice (4 standards)   | Author-integrity rule; exact amounts; no summarizing away detail | REG/AUD    |
| w2  | Ethics for the individual — conflicts, resolution              | **No cash labor** legal exposure; correct holder-name on COI     | REG        |
| w3  | Ethics for the organization — culture, fraud, whistleblowing   | SoD; transaction registry as fraud control                       | AUD        |
| w4  | Corporate responsibility, sustainability, integrated reporting | Accurate, bank-tied reporting as fiduciary duty                  | BAR        |

---

# Lesson anatomy (every week must contain)

1. **Cold open — the fictional case problem** (the "hook" above), with internally tied case numbers.
2. **Concept** — the exam topic taught from first principles.
3. **Worked example** — step it through on the MBG numbers; show the JE / schedule / ratio.
4. **CPA Crossover callout** — how the same idea is tested on the CPA section in "Also feeds."
5. **Exam-style practice** — `quiz` of 5–10 questions at exam difficulty; `explain` teaches the why.
6. **Flashcards** — 6–12 problem→solution / term→definition pairs for spaced repetition.

# Quality bar

- Aim ~1,200–2,000 words of `lessonHtml` per week (sanitized HTML; the app sanitizes on render).
- Every numeric claim labeled **fictional case** (traceable to bundled case data) or **illustrative**.
- Difficulty calibrated to actual CMA MCQ + essay rigor, not trivia.

---

# Phase 2 — CPA Evolution track (Claude app-code task, then Codex content)

After the CMA track is content-complete and audited, extend the data model to multiple tracks:

- **Core (all candidates):** AUD (Auditing & Attestation), FAR (Financial Accounting & Reporting), REG (Taxation & Regulation).
- **Discipline (pick one):** BAR (Business Analysis & Reporting), ISC (Information Systems & Controls), TCP (Tax Compliance & Planning). \*Recommended for the owner: **BAR\*** — it reuses the most construction/WIP/ratio content already built.
- Source material already salvaged: `data/cpa/modules/module1–12.json` (ASC topics: consol, FX, gov/NFP, leases, rev rec, income tax, derivatives, pensions/SBC, EPS, partnerships, M&A, SEC) and `data/cpa/content/` (2,580 items across FAR/AUD/REG/BAR/ISC/TCP + 12 exam forms + 8 labs).
- Mapping from CMA → CPA is pre-tagged in the "Also feeds" column above, so crossover is already traced.
