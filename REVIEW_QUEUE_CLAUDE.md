# Review Queue — CLAUDE audits

Things **Claude** must audit (work produced by **Codex**). Codex: add an entry here when content is ready.
Claude: review against the accounting-accuracy checklist in `AGENT_CHARTER.md`, then mark ✅/🔴 and update `TASKBOARD.md`.

### Entry template
```
## [task-id] <month/week> — <title>
- Author: Codex   | Branch: feat/<id>   | Filed: <date>
- Files: data/months/mX.json
- What changed: ...
- Check: numbers tie to MBG? blueprint weight right? schema valid? quiz answers correct?
- Verify: npm run validate:content
- Verdict: ⬜ pending
```

---

## [S1-X1] m4 — Cost Management
- Author: Codex   | Branch: `feat/s1-x1-m4`   | Filed: 2026-06-23
- Files: `data/curriculum/cma/m4-w1.json`, `m4-w2.json`, `m4-w3.json`, `m4-w4.json`
- What changed: Authored four 1,200–2,000-word lessons with 8 flashcards each and 7–8 exam-style questions each. Covers cost-code mapping to 1401–1405, WIP and contract positions, the CD Q1→Q2 reclass, overhead/ABC, payroll burden, supply chain, and retainage 2120.
- Check: Numbers tie to MBG? In particular, verify $14,480,000.00/$11,360,000.00 WIP, CD net $31,250.00 vs $32,650.00 footing with one $700 credit, $7,125.00 retained Q1 cost, and account 2120 treatment. Confirm real vs illustrative labeling, blueprint weight, quiz answers, and schema.
- Verify: `npm run validate:content`
- Verdict: ✅ **APPROVED** by Claude 2026-06-23.
  - Gate: 0 blocking errors (all 4 weeks pass WeekSchema; 29 answer indices in range).
  - Accounting audit — all 29 quiz answers correct; worked examples internally consistent:
    w1 (M001→1402, $360k/18k=$20, intra-account reclass=$0, corporate retreat=period cost, $2,500→investigate, underapplied $7k, validation control);
    w2 (60%, $1.2M rev, overbilled $150k=contract liability, late invoice understates cost, $240k current, timing≠quality);
    w3 (D=$31,950.00, net $31,250.00, gross $32,650.00, spread=2×$700; holds the unresolved "second $700" as open — does not invent it);
    w4 (ABC A $7,600/B $8,000, $11,200 labor+burden with no withholding double-count, full $100k retainage w/ 2120 split).
  - Conventions honored: JCS-not-Ledgerline-100, no cash labor, entity-segregated, exact-match/ending-bal-not-cumulative, real ($14,480,000.00 / $11,360,000.00 / $31,250.00 / 2120) vs illustrative correctly labeled.
  - Assembled into `data/curriculum.json` via `npm run build:curriculum`.
  - Non-blocking note for Codex: depth is excellent (~2,000 words); keep it consistent as months scale.

## [S1-X2] m1 — External Financial Reporting Decisions
- Author: Codex   | Branch: `feat/s1-x2-m1`   | Filed: 2026-06-23
- Files: `data/curriculum/cma/m1-w1.json`, `m1-w2.json`, `m1-w3.json`, `m1-w4.json`
- What changed: Authored four 1,200–2,000-word lessons with 8 flashcards and 7 exam-style questions each. Covers statement articulation, recognition/measurement and WIP, ASC 606 revenue, disclosures, reciprocal intercompany accounting, consolidation, and integrated reporting.
- Check: Verify all 28 answers and worked examples. Confirm the real MBG/Riverton GL totals ($12,480,000.00/$16,920,000.00), WIP ($14,480,000.00/$11,360,000.00), reciprocal 89010↔89011 ($850,000.00), note 89012↔89013 ($12,000.00), and later $400.00 drift. Check real-vs-illustrative labels, entity segregation, ASC 606 over-time caveat, and worksheet-only eliminations.
- Verify: `npm run validate:content`
- Verdict: ⬜ pending
