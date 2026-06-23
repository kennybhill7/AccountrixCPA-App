#!/usr/bin/env tsx
/**
 * build-curriculum.ts — assemble authored week-files into data/curriculum.json.
 *
 * Reads every data/curriculum/cma/m{N}-w{Y}.json (each a Week per lib/schemas.ts),
 * groups them by month, and — for any month that has all 4 weeks — replaces that
 * month in data/curriculum.json with the freshly assembled, CMA-titled month.
 * Months not yet fully authored are left exactly as they are (non-destructive).
 *
 * Run after authoring/auditing a month:  npm run build:curriculum
 */
import * as fs from 'fs';
import * as path from 'path';
import { MonthSchema, CurriculumSchema } from '../lib/schemas';

const DATA = path.join(process.cwd(), 'data');
const CMA = path.join(DATA, 'curriculum', 'cma');
const OUT = path.join(DATA, 'curriculum.json');

// CMA blueprint month titles (from docs/CURRICULUM_SPEC.md). m1–m6 = Part 1, m7–m12 = Part 2.
const MONTH_META: Record<string, { title: string; description: string }> = {
  m1:  { title: 'Month 1 — External Financial Reporting Decisions (CMA P1-A)', description: 'The 4 statements, recognition & measurement, revenue/expense, disclosures — built from MBG’s real GL.' },
  m2:  { title: 'Month 2 — Planning, Budgeting & Forecasting (CMA P1-B)', description: 'Strategic planning, budget methodologies, forecasting, pro-forma statements — on the MBG group plan.' },
  m3:  { title: 'Month 3 — Performance Management (CMA P1-C)', description: 'Cost & variance analysis, responsibility centers, ROI/RI/EVA, balanced scorecard & segments.' },
  m4:  { title: 'Month 4 — Cost Management (CMA P1-D)', description: 'Job-order costing, WIP & over/under billings, job-cost reclass, overhead & retainage — on real MBG jobs.' },
  m5:  { title: 'Month 5 — Internal Controls (CMA P1-E)', description: 'COSO governance, SoD, clearing/cutoff (Account 111), internal audit & systems security.' },
  m6:  { title: 'Month 6 — Technology & Analytics (CMA P1-F)', description: 'Information systems (JCS), data governance & integrity, analytics/BI, finance transformation.' },
  m7:  { title: 'Month 7 — Financial Statement Analysis (CMA P2-A)', description: 'Liquidity, leverage, activity & profitability ratios, DuPont, common-size, special issues.' },
  m8:  { title: 'Month 8 — Corporate Finance (CMA P2-B)', description: 'Risk & return, cost of capital, raising capital, working-capital management, restructuring.' },
  m9:  { title: 'Month 9 — Decision Analysis (CMA P2-C)', description: 'CVP, relevant-cost/marginal analysis, pricing, theory of constraints.' },
  m10: { title: 'Month 10 — Risk Management (CMA P2-D)', description: 'Enterprise risk (COSO ERM), risk identification, mitigation & hedging, quantifying risk.' },
  m11: { title: 'Month 11 — Investment Decisions (CMA P2-E)', description: 'Capital budgeting, NPV & IRR, payback & PI, risk in capital investment.' },
  m12: { title: 'Month 12 — Professional Ethics (CMA P2-F)', description: 'IMA Statement of Ethical Professional Practice; ethics for the individual and the organization.' },
};

const readJson = (f: string) => JSON.parse(fs.readFileSync(f, 'utf8'));

// 1) Gather authored week files, grouped by month id.
const byMonth: Record<string, any[]> = {};
if (fs.existsSync(CMA)) {
  for (const f of fs.readdirSync(CMA)) {
    const m = f.match(/^m(\d{1,2})-w([1-4])\.json$/);
    if (!m) continue;
    const monthId = `m${m[1]}`;
    (byMonth[monthId] ??= []).push({ week: readJson(path.join(CMA, f)), file: f });
  }
}

// 2) Load current curriculum.json (preserve un-authored months).
const curriculum: Record<string, any> = fs.existsSync(OUT) ? readJson(OUT) : {};

let rebuilt = 0, skipped = 0;
console.log('\n🏗️  Assembling curriculum.json from authored week-files\n');

for (const monthId of Object.keys(MONTH_META).sort((a, b) => +a.slice(1) - +b.slice(1))) {
  const weeks = (byMonth[monthId] ?? []).map(x => x.week).sort((a, b) => a.order - b.order);
  if (weeks.length === 0) { continue; }
  if (weeks.length < 4) {
    console.log(`  ⏭️  ${monthId}: only ${weeks.length}/4 weeks authored — leaving existing month untouched`);
    skipped++;
    continue;
  }
  const month = { id: monthId, ...MONTH_META[monthId], weeks };
  const r = MonthSchema.safeParse(month);
  if (!r.success) {
    console.log(`  ❌ ${monthId}: assembled month fails MonthSchema — ${r.error.issues.map(i => `${i.path.join('.')} ${i.message}`).slice(0, 4).join('; ')}`);
    process.exit(1);
  }
  curriculum[monthId] = month;
  console.log(`  ✅ ${monthId}: assembled 4 weeks → "${month.title}"`);
  rebuilt++;
}

// 3) Validate the whole thing if every month now has 4 weeks; otherwise warn (mixed legacy state).
const full = CurriculumSchema.safeParse(curriculum);
if (!full.success) {
  const monthsShort = Object.keys(curriculum).filter(k => (curriculum[k].weeks?.length ?? 0) !== 4);
  console.log(`\n  ⚠️  curriculum.json still mixed (months not yet at 4 weeks: ${monthsShort.join(', ') || 'none'}) — app tolerates this; full schema pass comes when all 12 are authored.`);
}

fs.writeFileSync(OUT, JSON.stringify(curriculum, null, 2));
console.log(`\n────────────────────`);
console.log(`Rebuilt ${rebuilt} month(s); ${skipped} partial month(s) skipped. Wrote ${path.relative(process.cwd(), OUT)}.\n`);
