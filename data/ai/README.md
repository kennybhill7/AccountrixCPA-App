Accountrix AI Data Drop (for Claude)

Purpose

- This folder is where Claude writes AI outputs (the “brains”). The app UI reads these JSON files locally to power onboarding, personalized plans, and the Fix It Now assistant.

Folder Structure

- intake/ One JSON per user with onboarding answers
- plan/ One JSON per user with a prioritized learning plan
- assist/ One JSON per chat session with assistant suggestions
- custom-lessons/ Optional custom lessons created by Claude

Intake Schema (intake/<userId>.json)
{
"userId": "string",
"timestamp": 1730851200000,
"role": "CFO|Controller|Staff Accountant|Bookkeeper|Accounting Manager|Other",
"industry": "Construction|Real Estate|Manufacturing|Technology|Non-Profit|Government|Healthcare|Other",
"entities": "1|2-5|6-10|10+",
"software": "Ledgerline Intacct|QuickBooks|NetSuite|Xero|SAP|Other",
"painPoints": [
{ "key": "bank_recs", "label": "Bank reconciliations are a mess", "urgency": "CRITICAL|HIGH|MEDIUM|LOW" }
],
"goals": ["Fix work problems", "Pass CPA", "Both", "Promotion", "New CFO role"],
"timeline": "1week|1-3months|6months|12months",
"hoursPerWeek": 5,
"notes": "free text"
}

Pain Point Keys (suggested)

- Month-End Close: bank_recs, beginning_balances, prior_year_not_closed, cannot_tie_cash, close_too_slow
- Journal Entries: je_mystery, re_opening_balance_je_unclear, reverse_entries, no_docs_complex_jes
- Construction: retainage_setup, wip_confusing, job_costing_reports, progress_billing, change_order_accounting
- Multi-Entity: ic_not_balance, no_ic_elimination_process, track_due_to_from, consolidation_ad_hoc
- Excel/Automation: too_much_excel, no_power_query, recs_time_consuming, no_dashboards
- Process/Controls: no_close_checklist, no_recon_matrix, missing_docs_standards, ad_hoc_processes
- CPA: cpa_need_pass, cpa_topics_struggle

Personalized Plan Schema (plan/<userId>.json)
{
"userId": "string",
"generatedAt": 1730851200000,
"items": [
{
"week": 1,
"urgency": "CRITICAL|HIGH|MEDIUM|LOW",
"title": "Bank Reconciliation Mastery",
"hours": 6,
"deliverables": ["Complete Jan 2024 bank rec"],
"mapping": { "monthId": "m1", "weekId": "w4" }, // optional when known
"rationale": "Based on bank_recs:CRITICAL and beginning_balances:CRITICAL"
}
]
}

Fix It Now Suggestions (assist/<sessionId>.json)
{
"sessionId": "string",
"userId": "string",
"createdAt": 1730851200000,
"input": "User free-text problem",
"suggestions": [
{
"type": "lesson|lab|template",
"title": "Fix Beginning Balance Issues",
"description": "Step-by-step to resolve opening balance mismatches",
"mapping": { "monthId": "m1", "weekId": "w4" }, // optional
"steps": ["Verify opening balance JE", "Tie prior year close", "Re-run bank rec"]
}
]
}

Optional Custom Lessons (custom-lessons/<id>.json)
{
"id": "cl-bank-rec-fix",
"title": "Bank Rec: Beginning Balance Troubleshooting",
"html": "<h1>...</h1>",
"flashcards": [{"front":"What is ...?","back":"..."}],
"quiz": {"id":"cl-bank-rec-fix","title":"Quiz","questions":[]}
}

Mapping Guidance

- Prefer adding mapping.monthId/weekId to deep‑link to existing content in data/m\*.json.
- If mapping is unknown, set mapping: null and include a helpful rationale and keywords.

Triggers & Overwrites

- After new intake: write intake/<userId>.json, then write plan/<userId>.json.
- After a Fix It Now prompt: write assist/<sessionId>.json.
- It’s OK to overwrite files atomically; always write complete JSON.

Constraints

- UTF‑8 JSON, no BOM, <1MB per file. Sanitize any HTML (no scripts).

Example (user “demo-user”)

- intake/demo-user.json
  {
  "userId": "demo-user",
  "timestamp": 1730851200000,
  "role": "CFO",
  "industry": "Construction",
  "entities": "10+",
  "software": "Ledgerline Intacct",
  "painPoints": [
  { "key": "bank_recs", "label": "Bank reconciliations are a mess", "urgency": "CRITICAL" },
  { "key": "beginning_balances", "label": "Beginning balance issues", "urgency": "CRITICAL" },
  { "key": "retainage_setup", "label": "Retainage setup", "urgency": "HIGH" }
  ],
  "goals": ["Both"],
  "timeline": "12months",
  "hoursPerWeek": 5,
  "notes": "Lender deadline this week; $12k recon difference; 2023 not closed."
  }
