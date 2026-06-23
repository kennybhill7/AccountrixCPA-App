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

- Author: Codex | Branch: `feat/s1-x1-m4` | Filed: 2026-06-23
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

- Author: Codex | Branch: `feat/s1-x2-m1` | Filed: 2026-06-23
- Files: `data/curriculum/cma/m1-w1.json`, `m1-w2.json`, `m1-w3.json`, `m1-w4.json`
- What changed: Authored four 1,200–2,000-word lessons with 8 flashcards and 7 exam-style questions each. Covers statement articulation, recognition/measurement and WIP, ASC 606 revenue, disclosures, reciprocal intercompany accounting, consolidation, and integrated reporting.
- Check: Verify all 28 answers and worked examples. Confirm the real MBG/Riverton GL totals ($12,480,000.00/$16,920,000.00), WIP ($14,480,000.00/$11,360,000.00), reciprocal 89010↔89011 ($850,000.00), note 89012↔89013 ($12,000.00), and later $400.00 drift. Check real-vs-illustrative labels, entity segregation, ASC 606 over-time caveat, and worksheet-only eliminations.
- Verify: `npm run validate:content`
- Verdict: ✅ **APPROVED** by Claude 2026-06-23 (loop cycle 1).
  - Gate: 0 blocking errors (all 4 weeks pass WeekSchema; 28 answer indices in range).
  - Accounting audit — all 28 quiz answers correct; worked examples internally consistent:
    w1 ($160k net income, $250k RE w/ dividends, equipment=investing, balanced-TB=debits=credits, $5k articulation→investigate, balance-sheet=point-in-time, entities-separate);
    w2 ($120k full WIP w/ retainage split, $18k SL depr, advertising≠WIP, $100k PV, accrue late invoice, close→COGS);
    w3 (40% progress, $1.2M cumulative rev, $300k current, $150k contract asset, control transfers, variable-consideration constraint, denominator↑→progress↓);
    w4 (89010/89011 $850,000.00 eliminate, consolidation-layer only, $400.00 drift→trace, **211 does NOT eliminate**, materiality=nature+magnitude, don't invent note terms, integrated reporting≠replace GAAP).
  - Real numbers tie to Master Brain: GL $12,480,000.00/$16,920,000.00, WIP $14,480,000.00/$11,360,000.00, 89010↔89011, 89012↔89013 $12,000.00, $400.00 drift. Conventions honored throughout.
  - Assembled into `data/curriculum.json` via `npm run build:curriculum` (m1 + m4 now render).
  - ⚠️ Coordination note: m1 was authored on `feat/s1-x2-m1`; Claude did NOT merge/commit across branches (two-agent working-tree safety). Merge `feat/s1-x2-m1` when ready.

## [S1-X3] m5 — Internal Controls

- Author: Codex | Branch: `feat/s1-x3-m5` | Filed: 2026-06-23
- Files: `data/curriculum/cma/m5-w1.json`, `m5-w2.json`, `m5-w3.json`, `m5-w4.json`
- What changed: Authored four 1,200–2,000-word lessons with 8 flashcards and 7 exam-style questions each. Covers COSO/governance through the COI audit, control activities and SoD across JCS/Ledgerline/PayStream/Apex/banks, account 111 clearing and cutoff, and internal audit/security through the transaction registry.
- Check: Verify all 28 answers and worked examples. Confirm COI facts (49 vendors, 33 compliant, 15 expired/$512,000.00, one mismatch, 29/49 wrong holder), account 111 $95,000.00 debit versus distinct 102.1 gap $47,200.00, no unsupported cash entry, and VERIFIED/POSTED/FLAGGED semantics. Check real-vs-illustrative labels, entity segregation, no cash labor, and COSO/AUD/ISC fidelity.
- Verify: `npm run validate:content`
- Verdict: ✅ **APPROVED** by Claude 2026-06-23 (loop cycle 2).
  - Gate: 0 blocking errors (4 weeks pass WeekSchema; 28 answer indices in range).
  - Accounting audit — all 28 answers correct; examples consistent:
    w1 (67.35% compliance, control environment, alert=monitoring control, $512,000.00=exposure-not-loss, 29/49 systemic root-cause fix, internal audit=independent assurance, insurance≠eliminates-risk);
    w2 (vendor-create+bank+invoice+pay=worst SoD, $56k labor+burden, trace $750, JCS-not-Ledgerline-100, vendor-bank callback, automation needs ITGC, signature insufficient);
    w3 ($95,000.00 Dr and $47,200.00 gap correctly DISTINCT, internal-reclass-not-credit-102.1, zero-balance needs gross support, bank-settlement cutoff, persistent item=error, exact-match);
    w4 (VERIFIED≠posted, append-not-overwrite, functional reporting to audit committee, 75% resolution, hash=integrity-not-truth, unique IDs=accountability, restore-test for backups).
  - COI facts exact (49/33/15/$512,000.00/1/29), Account 111 $95,000.00 vs 102.1 gap $47,200.00 kept distinct, registry tiers accurate. Conventions honored (JCS-not-Ledgerline-100 explicitly tested, no cash labor, internal-reclass-not-credit-bank).
  - Assembled into `data/curriculum.json` (m1+m4+m5 render). ⚠️ Merge `feat/s1-x3-m5` when ready.
