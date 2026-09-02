# Claude Collaboration Playbook

Purpose

- Define exactly what you (Claude) should write when the UI is missing data or when you recommend additions. All paths are workspace‑relative, UTF‑8 JSON, no BOM.

When something is missing

- No intake found for a user
  - Write: `data/ai/intake/<userId>.json`
  - Include all fields from `data/ai/README.md` (role, industry, entities, software, painPoints with urgency, goals, timeline, hoursPerWeek, notes).

- No plan found or plan lacks direct lesson links (mapping)
  - Preferred: Write `data/ai/plan/<userId>.json` with `items[].mapping = { monthId, weekId }`.
  - If mapping is uncertain: Set `mapping: null` and include a clear `rationale` and 3–6 `keywords` to guide local search.
  - Additionally: Write `data/ai/mappings.json` with reusable mappings for common keys.

- User triggers “Fix It Now” and suggestions are weak
  - Write: `data/ai/assist/<sessionId>.json` with 1–5 actionable suggestions. Prefer mapped lessons; otherwise include concrete step lists.

- Content exists but doesn’t cover a requested scenario
  - Write: `data/ai/custom-lessons/<id>.json` containing a focused lesson (HTML, optional flashcards, quiz).
  - Also write: `data/ai/recommendations/content.json` with an entry describing why the custom lesson was created and proposed permanent placement (month/week or new module).

- Templates requested by plan or assistant
  - Write: `data/ai/templates/index.json` — an array of template cards (see schema below). Place actual files in `public/templates/` (or describe external link).

- UI or data gaps observed
  - Write: `data/ai/recommendations/ui.json` — list gaps with type, priority, rationale, and suggested acceptance criteria.
  - Write: `data/ai/recommendations/data-fixes.json` — propose precise fixes to curriculum data (file, monthId/weekId, summary).

Schemas

- mappings.json

```
{
  "version": 1,
  "entries": [
    {
      "painPointKey": "bank_recs",
      "keywords": ["bank reconciliation", "cash account"],
      "mapping": { "monthId": "m1", "weekId": "w4" },
      "confidence": 0.9,
      "notes": "Best match for bank rec walkthrough"
    }
  ]
}
```

- templates/index.json

```
{
  "version": 1,
  "templates": [
    {
      "id": "bank-rec-intacct",
      "name": "Bank Rec Template - Ledgerline Intacct",
      "category": "Bank Recs",
      "file": "/templates/bank-rec-intacct.xlsx",
      "customized": false,
      "description": "Reconciliation workbook with GL vs statement tabs"
    }
  ]
}
```

- recommendations/ui.json

```
{
  "version": 1,
  "items": [
    {
      "type": "page|component|cta|copy",
      "id": "templates-library",
      "priority": "HIGH",
      "rationale": "Plan and assistant reference downloadable templates",
      "proposed": {
        "route": "/templates",
        "data": "data/ai/templates/index.json"
      }
    }
  ]
}
```

- recommendations/content.json

```
{
  "version": 1,
  "proposals": [
    {
      "id": "cl-bank-rec-fix",
      "reason": "High-urgency intake for bank rec beginning balances",
      "proposedPlacement": { "monthId": "m1", "weekId": "w4" },
      "impact": "Unblocks CRITICAL users; lender deadlines"
    }
  ]
}
```

- recommendations/data-fixes.json

```
{
  "version": 1,
  "fixes": [
    {
      "file": "data/m1.json",
      "monthId": "m1",
      "weekId": "w4",
      "issue": "Missing keyword synonyms for search",
      "suggest": ["Add \"bank reconciliation\" to lesson intro"]
    }
  ]
}
```

Quality rules

- Keep JSON < 1MB/file, deterministic keys, and stable IDs.
- Prefer specific mappings; when not possible, add rationale + keywords.
- Sanitize any HTML; no scripts.

Examples you can write now

- intake: `data/ai/intake/demo-user.json` (see README)
- plan: `data/ai/plan/demo-user.json` with mapped items or rationale
- assist: `data/ai/assist/session-001.json` for current blocker
- mappings: `data/ai/mappings.json` to codify common pain point → lesson links
- templates: `data/ai/templates/index.json` with at least one Bank Rec template
