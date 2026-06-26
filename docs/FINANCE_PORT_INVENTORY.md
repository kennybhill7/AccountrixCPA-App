# Finance Track (FI3300 Corporate Finance) — Port Inventory & Audit Gate

> This is the import inventory for the Accountrix Academy **Finance** track. It records what
> generic finance teaching content was extracted from the source corporate-finance study material,
> how it maps to the 8 authored week-files, the BA II Plus calculator conventions used throughout,
> and the (sanitized) grading-calibration rules rewritten as **generic finance rules**.
>
> **Privacy gate:** the source material was read for formulas, topic spine, and problem-set counts
> ONLY. NO real names, grades, professor names, or school/course-section identifiers were copied.
> Every worked example uses fictional companies (Meridian Building Group, Riverton Development,
> Northstar Services, Keystone Freight, Lakeside Retail, and classroom-style fictional issuers).
> All "verified answer keys" in the source were intentionally **discarded** — every quiz number in
> the authored files is newly invented and independently solved.

---

## 1. Chapter / week map

The track follows the standard FI3300 Corporate Finance spine, organized into 2 units × 4 weeks.

| File                                 | Unit·Week | Title                                                  | Source chapter region                                 |
| ------------------------------------ | --------- | ------------------------------------------------------ | ----------------------------------------------------- |
| `data/curriculum/finance/u1-w1.json` | U1·W1     | Financial statements, the cash-flow statement & taxes  | Ch 1–5 (statements, cash flow, ratios, DuPont, taxes) |
| `data/curriculum/finance/u1-w2.json` | U1·W2     | Time value of money (PV/FV, annuities, perpetuities)   | Ch 6–7 (TVM)                                          |
| `data/curriculum/finance/u1-w3.json` | U1·W3     | Interest rates, compounding & annuities (EAR, BGN/due) | Ch 6–7 (compounding, EAR, annuity due)                |
| `data/curriculum/finance/u1-w4.json` | U1·W4     | Bonds & bond valuation                                 | Ch 9 (bond half)                                      |
| `data/curriculum/finance/u2-w1.json` | U2·W1     | Stocks & dividend growth (Gordon DGM)                  | Ch 9 (stock half)                                     |
| `data/curriculum/finance/u2-w2.json` | U2·W2     | Risk, return & CAPM                                    | Ch 8 (markets, risk, beta, stats)                     |
| `data/curriculum/finance/u2-w3.json` | U2·W3     | Cost of capital / WACC                                 | Ch 11 (WACC)                                          |
| `data/curriculum/finance/u2-w4.json` | U2·W4     | Capital budgeting (NPV/IRR/payback/PI/EAA)             | Ch 10 (capital budgeting)                             |

---

## 2. Topics covered (by week)

- **U1·W1 — Statements, cash flow, taxes:** income statement build (Sales → COGS → GP → EBIT → EBT
  → NI → EPS), balance sheet (TCA/TCL/TA/TSE/RE roll-forward), statement of cash flows (indirect
  method, CFO/CFI/CFF classification & pattern recognition), DuPont (ROE = NPM × TAT × EM), ROA,
  debt ratio, LIFO vs FIFO effect on ending inventory & gross profit, marginal vs average tax,
  operating cash flow.
- **U1·W2 — TVM:** FV = PV(1+r)^n; PV = FV/(1+r)^n; PV/FV ordinary annuity; PV perpetuity; solving
  for n and r; lump sums; BA II Plus TVM register.
- **U1·W3 — Rates/compounding/annuities:** nominal vs periodic vs effective (EAR), m compounding
  periods, continuous compounding (FV = PV·e^(r·t), EAR = e^r − 1), annuity due / BGN mode
  discipline, END vs BGN, amortization worksheet.
- **U1·W4 — Bonds:** semiannual setup (N = yrs×2, I/Y = rate/2, PMT = coupon/2, FV = par), YTM,
  premium/discount/par rule, zero-coupon (Price = Par/(1+r)^n), consol/perpetuity (Price =
  Coupon/YTM), interest-rate sensitivity (rates↑→prices↓; zero & longer maturity & lower coupon =
  more sensitive), current yield vs YTM.
- **U2·W1 — Stocks / Gordon DGM:** P0 = D1/(r−g) = D0(1+g)/(r−g); r = D1/P0 + g; D0 vs D1 "just
  paid" trap; zero-growth (preferred) P0 = D/r; comparative statics (D1↑→P↑, g↑→P↑, r↑→P↓).
- **U2·W2 — Risk, return & CAPM:** expected return, variance & standard deviation (population **n**,
  not n−1), CAPM Required Return = Rf + β(Rm−Rf), SML, beta interpretation, market-risk-premium
  trap (don't subtract Rf twice when (Rm−Rf) is given), portfolio return.
- **U2·W3 — Cost of capital / WACC:** WACC = wd·rd(1−T) + we·re; cost of equity via CAPM and via
  DGM; after-tax cost of debt; capital-structure weights (market value); flotation awareness.
- **U2·W4 — Capital budgeting:** NPV = Σ[CFt/(1+r)^t] − Cost; IRR (NPV = 0); payback; discounted
  payback; PI = PV future CFs / Cost (accept > 1); EAA for unequal lives; key relationships (cost of
  capital↓→NPV↑, no effect on IRR; NPV is the always-correct rule; NPV/IRR conflict on mutually
  exclusive projects).

---

## 3. Problem-set sources (counts only — answers discarded, NOT ported)

The source material contained verified answer keys for several "THPS" (take-home problem set)
collections. These were used ONLY to confirm topic coverage and difficulty calibration. **No source
answer was copied into the track**; every authored quiz number is original and independently solved.

| Source set (generic label) | Topic region                  | Item count referenced               |
| -------------------------- | ----------------------------- | ----------------------------------- |
| Problem Set A              | Ch 1–3 financial statements   | ~7 computational scenarios          |
| Problem Set B              | Ch 4–5 cash flow & ratios     | ~12 computational scenarios         |
| Problem Set C              | Ch 6–7 time value of money    | 50 items (20 MC + 30 computational) |
| Problem Set D              | Ch 8–9 markets, stocks, bonds | item count pending in source        |
| Problem Set E              | Ch 10–11 capital budgeting    | item count pending in source        |

Authored output instead supplies **8 quizzes × 7 questions = 56 original MCQs** and
**8 × 8 = 64 flashcards**, all with fictional figures.

---

## 4. BA II Plus calculator conventions (used throughout the track)

These keystroke conventions are embedded in every relevant lesson.

**Critical settings — check before every problem**

- `P/Y = 1`, `C/Y = 1` (always, for this course's convention).
- `BGN` indicator OFF unless the problem is an annuity due.
- `2ND → CLR TVM` before every TVM problem (clears N, I/Y, PV, PMT, FV).
- `CF → 2ND → CLR WORK` before every cash-flow / NPV / IRR problem.

**TVM register:** enter the four known values (N, I/Y, PV, PMT, FV), then `CPT` the unknown.

**Sign convention:** money OUT = negative, money IN = positive. PV and FV (or PV and PMT) generally
take **opposite signs**; `Error 5` means a sign-convention conflict.

**Semiannual bonds:** `N = years × 2`, `I/Y = annual rate ÷ 2`, `PMT = annual coupon ÷ 2`,
`FV = par`, then `CPT PV`.

**Continuous compounding:** do NOT set `C/Y = 1,000,000` (contaminates the next problem). Use the
`e^x` key (`2ND → LN`): `[rate] × [time] = 2ND LN × [PV] =`.

**Amortization (loan balance):** after solving for PMT, `2ND → AMORT`, set `P1`/`P2`, scroll to
`BAL`.

**Cash-flow worksheet (NPV/IRR):** `CF` → enter CF0 (negative cost), then CFj/Fj pairs; `NPV` →
enter I → `CPT`; `IRR` → `CPT`. Use the worksheet (not term-by-term PV) to avoid rounding drift.

**Common errors:** `Error 4` = invalid CF entry; `Error 5` = sign convention; wrong answer often =
C/Y contamination or BGN left on.

---

## 5. Grading-calibration rules — rewritten as GENERIC finance rules (sanitized)

The source recorded several exam-grader-specific conventions. They are restated here as **generic,
defensible finance rules** with NO grader/professor/school identity. These are surfaced in lessons as
"exam trap" callouts.

1. **Standard deviation uses the population formula (divide by n), not the sample formula (n−1).**
   When a problem gives the _complete_ set of outcomes/returns as the population, σ = √(Σ(Ri − μ)² /
   **n**). Using n−1 understates n and is the single most common stats error on these exams.
2. **Use the calculator's cash-flow worksheet for NPV/IRR** rather than discounting each cash flow
   separately, to avoid cumulative rounding error.
3. **"Just paid" dividend = D0.** The Gordon model needs D1, so multiply by (1+g) first:
   D1 = D0(1+g). Plugging D0 straight into P0 = D/(r−g) is a guaranteed miss.
4. **Market risk premium given ⇒ do not subtract Rf again.** CAPM is Rf + β(Rm−Rf). If the problem
   hands you (Rm−Rf) directly, multiply by β and add Rf once; do not re-net Rf.
5. **Premium/discount/par by inspection:** coupon > YTM ⇒ premium; coupon < YTM ⇒ discount;
   coupon = YTM ⇒ par. Verify the computed price agrees with the relationship.
6. **Sign convention discipline:** PV and FV opposite signs; report dollar amounts as positive
   (absolute value) unless a negative is explicitly required.
7. **Cost of capital ↓ ⇒ NPV ↑; cost of capital change has NO effect on IRR** (IRR depends only on
   the cash flows). NPV is the only rule that is always correct.
8. **Round only at the end.** Carry full precision; round the final reported figure.

---

## 6. Privacy verification (audit gate)

Before sign-off, the authored output (`data/curriculum/finance/*.json`,
`scripts/build-finance-curriculum.ts`, this doc) was grepped for real-identity tokens
(owner name, grade values, professor/school/course-section identifiers). **Result: ZERO matches.**
All examples are fictional; all quiz figures are original. See the final build report for the exact
grep commands and counts.
