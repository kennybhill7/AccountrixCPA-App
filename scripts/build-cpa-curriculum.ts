#!/usr/bin/env tsx
/**
 * build-cpa-curriculum.ts — assemble authored CPA week-files into data/curriculum-cpa.json.
 *
 * Reads every data/curriculum/cpa/{section}/u{N}-w{Y}.json (each a Week per
 * lib/schemas.ts), groups them by section+unit (e.g. far-u1), and writes a
 * track-scoped curriculum the /cpa routes consume. Unlike the CMA build, a unit
 * may have fewer than four weeks (units are authored incrementally), so this
 * script validates each Week but does NOT require a full 4-week unit.
 *
 * Run after authoring/auditing a CPA unit:  npm run build:cpa-curriculum
 */
import * as fs from "fs";
import * as path from "path";
import { WeekSchema } from "../lib/schemas";

const DATA = path.join(process.cwd(), "data");
const CPA = path.join(DATA, "curriculum", "cpa");
const OUT = path.join(DATA, "curriculum-cpa.json");

// Display order of CPA sections (CPA Evolution: three Core + chosen Discipline).
const SECTION_ORDER = ["far", "aud", "reg", "bar", "isc", "tcp"];

// Friendly unit titles. Falls back to a derived title if a unit is not listed.
const UNIT_META: Record<string, string> = {
  "far-u1": "FAR Unit 1 — Conceptual Framework, the Four Statements, Assets & Leases",
  "far-u2": "FAR Unit 2 — Investments, Income Taxes, Equity/EPS & Bonds",
  "far-u3": "FAR Unit 3 — Cash Flows, Governmental, Not-for-Profit & Reporting",
  "aud-u1": "AUD Unit 1 — Engagements & Ethics, the Audit Risk Model & Internal Control",
  "reg-u1": "REG Unit 1 — Ethics & Tax Procedures, Individual Taxation & Property Transactions",
  "reg-u2": "REG Unit 2 — Entity Taxation (C corp, S corp, Partnerships) & Business Law",
  "reg-u3": "REG Unit 3 — Estates & Trusts, Gift & Estate Tax, and Tax-Exempt Organizations",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const readJson = (f: string): any => JSON.parse(fs.readFileSync(f, "utf8"));

interface CpaUnit {
  id: string;
  section: string;
  unit: number;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  weeks: any[];
}

// 1) Gather authored CPA week files, grouped by `${section}-u${N}`.
const byUnit: Record<string, { section: string; unit: number; weeks: { week: unknown; file: string }[] }> = {};
if (fs.existsSync(CPA)) {
  for (const section of fs.readdirSync(CPA)) {
    const sectionDir = path.join(CPA, section);
    if (!fs.statSync(sectionDir).isDirectory()) continue;
    for (const f of fs.readdirSync(sectionDir)) {
      const m = f.match(/^u(\d{1,2})-w([1-4])\.json$/);
      if (!m) continue;
      const unitNum = Number(m[1]);
      const key = `${section.toLowerCase()}-u${unitNum}`;
      (byUnit[key] ??= { section: section.toUpperCase(), unit: unitNum, weeks: [] }).weeks.push({
        week: readJson(path.join(sectionDir, f)),
        file: `${section}/${f}`,
      });
    }
  }
}

console.log("\n🏗️  Assembling curriculum-cpa.json from authored CPA week-files\n");

// 2) Validate each week and build the ordered unit list.
const units: CpaUnit[] = [];
let weekCount = 0;
for (const key of Object.keys(byUnit).sort((a, b) => {
  const [sa, ua] = a.split("-u");
  const [sb, ub] = b.split("-u");
  const oa = SECTION_ORDER.indexOf(sa);
  const ob = SECTION_ORDER.indexOf(sb);
  if (oa !== ob) return (oa < 0 ? 99 : oa) - (ob < 0 ? 99 : ob);
  return Number(ua) - Number(ub);
})) {
  const { section, unit, weeks } = byUnit[key];
  const ordered = weeks
    .map((x) => x.week)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .sort((a: any, b: any) => a.order - b.order);
  for (const w of ordered) {
    const r = WeekSchema.safeParse(w);
    if (!r.success) {
      console.log(
        `  ❌ ${key}: a week fails WeekSchema — ${r.error.issues
          .map((i) => `${i.path.join(".")} ${i.message}`)
          .slice(0, 4)
          .join("; ")}`
      );
      process.exit(1);
    }
  }
  const title = UNIT_META[key] ?? `${section} Unit ${unit}`;
  units.push({ id: key, section, unit, title, weeks: ordered });
  weekCount += ordered.length;
  console.log(`  ✅ ${key}: ${ordered.length} week(s) → "${title}"`);
}

fs.writeFileSync(OUT, JSON.stringify({ units }, null, 2));
console.log(`\n────────────────────`);
console.log(
  `Assembled ${units.length} unit(s), ${weekCount} week(s). Wrote ${path.relative(process.cwd(), OUT)}.\n`
);
