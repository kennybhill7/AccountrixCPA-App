# Skill Taxonomy — seed (v1, for Codex review)

> The tagging key for the skill graph (PRODUCT_MASTER_PLAN §3). Every artifact — lesson, quiz
> item, flashcard, TBS, Excel drill, case workflow — carries `skills: [<id>...]` and a
> `competency: exam | controller | cfo`. Practical seed; expand as needed, but **freeze IDs once
> Codex approves** (renaming a tagged ID is the expensive part).
>
> **Crosswalk rule:** a concept that appears in multiple tracks uses **ONE canonical ID** (marked
> ↔). That single shared ID is what powers the Finance↔CMA↔CPA crosswalk and weak-skill targeting.
> Domains below are organizational; a skill can be tagged on content from any track.
>
> **Data rule:** all examples/workflows use fictional case companies only (§0). No real data.

---

## Codex freeze status — 2026-07-03

Codex approves this taxonomy as frozen v1 after promoting the proposed additions below into the canonical key. Existing IDs are now stable. New IDs may be added through review, but renames/removals require a migration because tagged content depends on them.

Approved additions before freeze:

- `asset-liability-measurement`
- `integrated-reporting`
- `transfer-pricing`
- `erp-data-flow`
- `restructuring-ma`
- `hedge-accounting`
- `real-options`
- `pro-forma`
- `financial-forecasting`
- `dupont`

Additional IDs added for current product direction:

- `calculator-keystrokes`
- `deferred-revenue`
- `unbilled-revenue`
- `workpaper-review`
- `owner-advisory`

## Tagging convention

```
skills: ["wip-schedule", "over-under-billing", "revenue-recognition"]
competency: "controller"        // exam = pass the test | controller = weekly execution | cfo = judgment
case?: "meridian-building-group" // when the artifact is an Apply workflow
```

IDs are kebab-case, concept-level (NOT track-prefixed), so `npv` is one skill whether it appears in
Finance, CMA, or CPA BAR.

---

## 1. Finance (Corporate Finance)

- `tvm` — time value of money (PV/FV/annuities/perpetuities) ↔
- `financial-statements` — IS / BS / SCF structure ↔ (CPA `conceptual-framework`)
- `cash-flow-analysis` — operating/investing/financing, free cash flow ↔
- `ratio-analysis` — liquidity/leverage/profitability/efficiency, DuPont ↔ (CMA, CPA BAR)
- `stock-valuation` — dividend-discount / Gordon growth, CAPM
- `bond-valuation` — pricing, yield, duration basics
- `cost-of-capital` — WACC, cost of equity/debt ↔ (CMA, CPA BAR)
- `capital-budgeting` — NPV, IRR, payback, profitability index ↔ (CMA, CPA BAR, CFO)
- `risk-return` — diversification, beta, SML
- `working-capital-mgmt` — cash conversion cycle ↔ (Controller)

## 2. CMA (Certified Management Accountant — timeline priority)

- `cost-behavior` — fixed/variable/mixed, high-low/regression
- `costing-systems` — job-order / process / activity-based
- `cvp-analysis` — contribution margin, break-even, target profit
- `budgeting` — master & flexible budgets, pro forma
- `variance-analysis` — price/quantity, 4-variance overhead
- `performance-mgmt` — responsibility accounting, balanced scorecard, KPIs ↔ (CPA BAR)
- `decision-analysis` — relevant cost, make-or-buy, special order, keep/drop
- `risk-mgmt` — ERM, hedging, VaR ↔ (CPA BAR)
- `professional-ethics` — IMA / AICPA ethics ↔ (CPA)
- (reuses ↔ `ratio-analysis`, `cost-of-capital`, `capital-budgeting`, `internal-controls`)

## 3. CPA (FAR · AUD · REG · BAR/ISC/TCP)

**FAR:** `conceptual-framework` · `revenue-recognition` · `leases` · `inventory` ·
`ppe-intangibles` · `bonds-payable` · `income-taxes-asc740` · `pensions-stock-comp` ·
`consolidations` · `governmental-accounting` · `nfp-accounting` · `cash-receivables-cecl` ·
`contingencies` · `fair-value` · `accounting-changes`

**AUD:** `audit-risk-model` · `internal-controls` ↔ · `audit-evidence` · `audit-sampling` ·
`substantive-procedures` · `audit-reports` · `it-auditing` ↔ · `group-audits` ·
`quality-management` · `other-engagements`

**REG:** `individual-taxation` · `entity-taxation` · `property-transactions` ·
`tax-procedures-ethics` · `gift-estate-tax` · `business-law` · `secured-transactions`

**BAR/ISC/TCP:** `financial-analysis` · `data-analytics` ↔ (ISC) · `cost-accounting` ↔ (CMA) ·
`public-company-reporting` · `it-governance` (ISC) · `soc-engagements` (ISC) ·
`security-privacy` (ISC) · `tax-planning` ↔ (CFO)

## 4. Excel (cross-track, desktop-first)

- `excel-formulas-core` — SUM/IF/nesting/error-handling
- `excel-lookup` — VLOOKUP / XLOOKUP / INDEX-MATCH
- `excel-aggregation` — SUMIF(S) / COUNTIF(S) / AVERAGEIF
- `excel-financial-fns` — PMT / NPV / IRR / RATE / FV
- `excel-modeling` — 3-statement model, schedules
- `excel-data-tools` — pivot tables, data tables, scenarios
- `excel-shortcuts` — keyboard fluency drills
- `excel-formatting` — number formats, conditional formatting

## 5. Controller Execution (weekly real work — case-company workflows)

- `wip-schedule` — percentage-of-completion WIP build
- `over-under-billing` — billings vs costs-and-earnings, contract asset/liability
- `bank-rec` — book-to-bank reconciliation
- `month-end-close` — close checklist, accruals, cutoff
- `ap-aging` — payables aging & disbursement planning
- `ar-aging` — receivables aging & collections
- `payroll-burden` — burdened labor rate, by class code
- `insurance-certs` — COI tracking / compliance
- `debt-schedule` — amortization, current vs long-term split
- `financial-statement-prep` — assemble GAAP statements from TB
- `lender-cpa-packet` — review/assemble the reporting packet
- `journal-entries` — record/adjust/reclass entries
- `account-reconciliations` — GL account recs
- `fixed-asset-depreciation` — schedules (SL/DB/SYD/MACRS) ↔ (REG/Excel)

## 6. CFO Judgment (decision reps + stakeholder conversations)

- `cash-forecasting` — 13-week cash flow, runway ↔ (Controller)
- `covenant-monitoring` — debt covenant compliance & headroom
- `bonding-capacity` — surety / WIP-driven bonding analysis
- `insurance-risk` — coverage adequacy, risk transfer
- `pricing-margin-analysis` — bid markup, margin by job
- `tax-planning-strategy` — entity/timing/wealth-transfer planning ↔ (REG/TCP)
- `scenario-planning` — best/base/worst, sensitivity
- `board-owner-reporting` — packet narrative, variance explanation
- `lender-conversation` — explain results to a lender (Conversation Sim)
- `cpa-conversation` — respond to CPA/auditor questions (Conversation Sim)
- `insurance-conversation` — work with the insurance/surety agent (Conversation Sim)
- (reuses ↔ `capital-budgeting`, `working-capital-mgmt`, `ratio-analysis`)

---

## Notes for Codex review

**Codex verdict 2026-07-03:** Approved / frozen v1. The sections below that say "Proposed additions" are historical; the listed IDs are approved. `dupont` remains standalone rather than being merged into `ratio-analysis`.

- ~85 seed skills across 6 domains. **Question for Codex:** is this the right granularity, or
  should any be split/merged before freeze? Flag missing high-value skills.
- The ↔ shared IDs are deliberate (crosswalk). Confirm each shared concept should be ONE id, not
  per-track duplicates.
- Once approved, this becomes the closed tagging key; new CPA loop units (ISC, TCP, …) and the
  ported Finance/CMA content get `skills`/`competency` tags from creation.

---

## Proposed additions (from CMA tagging — pending Codex review)

The CMA tagging pass surfaced 7 concepts not in the seed. Codex: approve / merge / rename before freeze.

- `asset-liability-measurement` — recognition & subsequent measurement (cost vs FV, impairment); distinct from `financial-statements`/`fair-value`. (CMA m1:w2 / CPA FAR)
- `integrated-reporting` — <IR> framework, six capitals, ISSB/GRI/SASB connectivity. (CMA m1:w4, m12:w4 / CPA BAR)
- `transfer-pricing` — internal pricing between responsibility centers. (CMA m3:w2)
- `erp-data-flow` — ERP sub-ledger→GL architecture, cross-system reconciliation; distinct from `it-governance`. (CMA m6 / CPA ISC)
- `restructuring-ma` — restructuring, M&A, international finance basics. (CMA m8:w4 / CPA BAR)
- `hedge-accounting` — ASC 815 fair-value vs cash-flow hedges, effectiveness, OCI; distinct from `risk-mgmt`. (CMA m10:w3 / CPA FAR)
- `real-options` — option to expand/abandon/defer; distinct from `capital-budgeting`. (CMA m11:w4 / CPA BAR)

## Proposed additions (from CFO case universe — pending Codex review)

- `pro-forma` — percent-of-sales projected IS/BS, plug figures. (CFO / Finance forecasting)
- `financial-forecasting` — AFN/EFN, sustainable growth rate, forecast assumptions & sensitivity. (CFO / Finance)
- `dupont` — DuPont ROE decomposition (NPM × TAT × EM); Finance agent used it (u1-w1). Codex: keep standalone or roll into `ratio-analysis`.
