# Accountrix Product Roadmap

**Status:** Draft for owner review  
**Updated:** 2026-06-24  
**North star:** Convert source documents into balanced, source-traced construction accounting outputs,
with humans reviewing only genuine ambiguity.

## Product Boundary

Accountrix currently contains an Academy product for construction accounting education. The opportunity
described here is a second product surface: **Accountrix Operations**.

- **Academy** teaches construction accounting and finance.
- **Operations** ingests real operating records, applies approved accounting rules, and produces reviewable
  transactions and reports.
- They may share domain terminology and rule definitions, but they must not share customer transaction data
  or use the curriculum JSON model as an accounting ledger.

Before Operations code is added, create an architecture decision record choosing either a monorepo with
separate applications/services or a separate repository. Operations needs its own database, authorization
model, audit controls, deployment boundary, and retention policy.

## Product Principles

1. **Source before entry.** Every amount links to a timecard, invoice, contract, approval, or other source.
2. **Fail closed.** Unknown entity, job, account, rate, worker, or allocation enters a review queue. It is
   never guessed into a posting.
3. **No plugs.** Allocations must derive from explicit quantities and rates. Residuals remain visible with
   their provenance and disposition.
4. **Append-only accounting history.** Corrections use reversals and superseding events. Posted history is
   never silently overwritten.
5. **Effective-dated rules.** Controller-approved mappings and policies have an effective date, approver,
   evidence, version, and expiration or supersession path.
6. **Entity isolation by default.** Every source line, rule, journal line, and approval belongs to an entity.
   Consolidation and elimination are explicit downstream operations.
7. **Deterministic before intelligent.** Arithmetic, tie-outs, duplicate detection, and known mappings are
   deterministic. Statistical or language models may propose classifications, but cannot bypass controls.
8. **Reproducible processing.** Reprocessing the same source and rule version produces the same draft output
   without duplicates.

## Priority Matrix

| Priority | Capability                                           |   Impact | Effort | Why now                                                         |
| -------- | ---------------------------------------------------- | -------: | -----: | --------------------------------------------------------------- |
| P0       | Accounting event ledger, provenance, RBAC, approvals | Critical |     XL | Foundation for every trustworthy workflow                       |
| P0       | Effective-dated rule registry                        | Critical |      M | Converts repeated controller decisions into durable controls    |
| P0       | Review queue and exception workflow                  | Critical |      M | Makes fail-closed automation operationally usable               |
| P1       | Timecard-to-accounting pipeline                      | Critical |     XL | Highest demonstrated labor savings and clearest product wedge   |
| P1       | No-plug and deterministic tie-out engine             | Critical |      M | Prevents hidden residuals and late forensic cleanup             |
| P1       | Intercompany matching and draft eliminations         |     High |      L | Removes recurring multi-entity reconciliation work              |
| P2       | WIP and over/under-billing schedule                  | Critical |      L | Core construction CFO, bank, and surety output                  |
| P2       | AIA G702/G703 draw and retainage management          |     High |     XL | Core GC billing workflow with strong data reuse from WIP        |
| P2       | Subcontractor compliance and payment gate            |     High |      L | Prevents payment when required compliance evidence is missing   |
| P3       | Continuous anomaly detection                         |     High |      L | Detects unusual mappings and rates before close                 |
| P3       | Rolling 13-week cash forecast                        |     High |      L | Converts AP, payroll, and draw timing into liquidity visibility |
| P3       | One-click audit binder                               |     High |      M | Packages the provenance already required by the ledger          |

Effort is relative: **M** is a bounded feature, **L** crosses multiple domains, and **XL** requires platform
architecture and staged delivery.

## Delivery Sequence

### Phase 0: Trust Foundation

Build the minimum accounting platform before automating entries:

- Tenant, company, user, role, and approval-policy model.
- Append-only source, event, journal-draft, approval, posting, reversal, and attachment records.
- Immutable source-file storage with SHA-256, received timestamp, uploader, and parser version.
- Effective-dated registry for workers, rates, job aliases, GL mappings, WC classes, intercompany rules,
  and special payment arrangements.
- Exception states: `BLOCKED`, `NEEDS_REVIEW`, `APPROVED`, `REJECTED`, `POSTED`, and `SUPERSEDED`.
- Idempotency keys, balanced-journal enforcement, entity boundaries, and complete audit logging.
- Import adapters initially produce drafts; no direct GL posting in this phase.

**Exit gate:** A source line can be traced through every transformation and approval to a balanced draft,
and a correction preserves the original history.

### Phase 1: Timecard-to-Everything MVP

Deliver one complete weekly payroll workflow:

1. Ingest CSV/XLSX timecards and preserve the original file.
2. Normalize worker, date, duration, free-text activity, and source row identifiers.
3. Resolve worker, company, week, pay channel, and effective rate from approved rules.
4. Propose job and activity mappings using deterministic aliases first and language classification second.
5. Split multi-job days only when supported by explicit source detail or approved allocation rules.
6. Route ambiguity, missing jobs, conflicting totals, and novel codes to a review queue.
7. Calculate hours, blended rates, reimbursements, deductions, and burden without residual plugs.
8. Generate balanced drafts for the staffing invoice, direct-pay schedule, intercompany AJE, and payroll
   accounting entry.
9. Produce a controller packet showing source, proposed mapping, rule version, arithmetic, exceptions,
   approvals, and tie-outs.

**MVP acceptance criteria:**

- One uploaded timecard package produces all expected draft outputs without spreadsheet editing.
- Every output line traces to source rows and an effective-dated rule.
- Unknown or conflicting lines cannot enter a posting draft.
- Weekly worker hours tie to source; accounting entries balance by entity.
- No formula or process can absorb an unexplained residual.
- Re-importing an unchanged source creates no duplicate transaction.
- The normal weekly review target is ten minutes after mappings have matured.

### Phase 2: Construction Close and Billing

- Intercompany matching, due-to/due-from reconciliation, elimination drafts, and consolidated reporting.
- Contract, change-order, budget, commitment, cost-to-complete, and billing data model.
- WIP schedule with percent complete, earned revenue, billed-to-date, and over/under-billing.
- AIA schedule of values, G702/G703 generation, retainage, stored materials, and draw-package workflow.
- Subcontractor master with W-9, COI, lien-waiver, expiration, project, and payment-hold controls.

### Phase 3: Intelligence and Executive Controls

- Deterministic anomaly rules followed by statistical detection for unusual rates, WC classes, GLs,
  workers, job codes, duplicates, and period behavior.
- Rolling 13-week cash forecast driven by approved AP, payroll, draw schedules, debt service, and scenarios.
- Audit-binder generation for a period, job, draw, payroll, or journal entry.
- Controller dashboards for unresolved exceptions, close readiness, cash risks, compliance holds, and model
  performance.

## Timecard Pipeline Architecture

```text
Source file
  -> immutable document + hash
  -> parser output with source-row IDs
  -> normalized time entries
  -> deterministic rule resolution
  -> classification proposals
  -> exception/review queue
  -> approved allocations
  -> calculation and no-plug controls
  -> balanced journal and schedule drafts
  -> controller approval
  -> export/posting adapter
```

Suggested core records:

- `source_documents`, `source_rows`, `parser_runs`
- `companies`, `workers`, `jobs`, `job_aliases`, `accounts`, `activity_codes`
- `rule_versions`, `rule_approvals`, `effective_rates`, `allocation_rules`
- `time_entries`, `classification_proposals`, `allocation_lines`, `exceptions`
- `journal_drafts`, `journal_lines`, `schedule_drafts`, `approvals`, `postings`, `reversals`
- `intercompany_matches`, `contracts`, `change_orders`, `wip_snapshots`, `draws`
- `vendors`, `compliance_documents`, `payment_holds`

## AI Control Boundary

Language models may:

- Extract activity and location signals from notes.
- Rank approved job/activity candidates.
- Explain why a line is ambiguous or anomalous.
- Draft a proposed rule for controller review.

Language models may not:

- Create a new job, GL, rate, entity relationship, or accounting policy without approval.
- Change source quantities or force a transaction to tie.
- Post an entry, release a payment hold, or approve their own proposal.
- Learn from corrected customer data without tenant controls and explicit policy.

Every proposal stores model/provider version, prompt or classifier version, candidates, confidence, evidence,
and the human disposition. Confidence alone never converts a blocked line into an approved line.

## Metrics

Track product value and control quality together:

- Median source-upload-to-approved-draft time.
- Percentage of source lines resolved without human edits.
- Exceptions per 100 source lines, by reason and recurrence.
- Controller review minutes per payroll and close.
- First-pass tie-out rate and unexplained residual count.
- Duplicate, reversal, and post-close correction rates.
- Percentage of posted lines with complete source and rule provenance.
- Classification precision by job, activity, entity, and worker.
- Days to close, intercompany aging, compliance holds prevented, and forecast accuracy.

## Immediate Backlog

1. Write an ADR for Academy versus Operations deployment and repository boundaries.
2. Define the accounting-event and source-provenance schemas.
3. Define RBAC and approval segregation for preparer, reviewer, controller, CFO, and administrator.
4. Convert the existing rule registry concepts into effective-dated database entities.
5. Define the timecard canonical schema and parser contract using anonymized fixtures.
6. Build a deterministic job-alias resolver and unknown-code blocker.
7. Build the exception queue contract and approval audit log.
8. Build hours/rate/allocation calculations with property-based no-plug and balance tests.
9. Generate the four MVP outputs from approved allocations.
10. Pilot against anonymized historical weeks and measure review time and exception accuracy.

## Explicit Non-Goals for the First Release

- Replacing the general ledger.
- Autonomous posting without controller approval.
- Supporting every timekeeping, payroll, ERP, or document format.
- Full WIP, AIA, cash forecasting, and compliance workflows before the timecard pipeline is reliable.
- Treating spreadsheet import/export as the system of record.
- Storing real customer accounting data in curriculum files, fixtures, prompts, or source control.

## Decision Gates

Implementation does not start until the owner approves:

1. Academy/Operations product and deployment boundary.
2. Initial system of record and database platform.
3. First supported timecard and accounting export formats.
4. Controller approval roles and segregation of duties.
5. Data retention, encryption, backup, tenant isolation, and incident-response requirements.
6. Whether the first pilot exports approved drafts or integrates directly with an accounting platform.
