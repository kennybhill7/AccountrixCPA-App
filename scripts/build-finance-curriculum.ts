#!/usr/bin/env tsx
/**
 * build-finance-curriculum.ts — assemble authored Finance week-files into data/curriculum-finance.json.
 *
 * Adapted from build-cpa-curriculum.ts. Reads every
 * data/curriculum/finance/u{N}-w{Y}.json (each a Week per lib/schemas.ts),
 * groups them by unit (e.g. finance-u1), and writes a track-scoped curriculum
 * the /finance routes consume. Like the CPA build, a unit may have fewer than
 * four weeks (units are authored incrementally), so this script validates each
 * Week but does NOT require a full 4-week unit.
 *
 * Run after authoring/auditing a Finance unit:  npm run build:finance-curriculum
 */
import * as fs from "fs";
import * as path from "path";
import { WeekSchema } from "../lib/schemas";

const DATA = path.join(process.cwd(), "data");
const FINANCE = path.join(DATA, "curriculum", "finance");
const OUT = path.join(DATA, "curriculum-finance.json");

// Friendly unit titles for the Finance track (FI3300 Corporate Finance spine).
// Falls back to a derived title if a unit is not listed.
const UNIT_META: Record<string, string> = {
  "finance-u1":
    "Finance Unit 1 — Financial Statements & Cash Flow, Time Value of Money, Interest Rates & Bonds",
  "finance-u2":
    "Finance Unit 2 — Stock Valuation, Risk & CAPM, Cost of Capital & Capital Budgeting",
  "finance-u3":
    "Finance Unit 3 — Project Cash Flows, Pro Formas & Forecasting, Working Capital & Financial Planning",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const readJson = (f: string): any => JSON.parse(fs.readFileSync(f, "utf8"));

interface FinanceUnit {
  id: string;
  unit: number;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  weeks: any[];
}

// 1) Gather authored Finance week files, grouped by `finance-u${N}`.
const byUnit: Record<string, { unit: number; weeks: { week: unknown; file: string }[] }> = {};
if (fs.existsSync(FINANCE)) {
  for (const f of fs.readdirSync(FINANCE)) {
    const m = f.match(/^u(\d{1,2})-w([1-4])\.json$/);
    if (!m) continue;
    const unitNum = Number(m[1]);
    const key = `finance-u${unitNum}`;
    (byUnit[key] ??= { unit: unitNum, weeks: [] }).weeks.push({
      week: readJson(path.join(FINANCE, f)),
      file: `finance/${f}`,
    });
  }
}

console.log("\n🏗️  Assembling curriculum-finance.json from authored Finance week-files\n");

// 2) Validate each week and build the ordered unit list.
const units: FinanceUnit[] = [];
let weekCount = 0;
for (const key of Object.keys(byUnit).sort((a, b) => {
  const ua = Number(a.split("-u")[1]);
  const ub = Number(b.split("-u")[1]);
  return ua - ub;
})) {
  const { unit, weeks } = byUnit[key];
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
  const title = UNIT_META[key] ?? `Finance Unit ${unit}`;
  units.push({ id: key, unit, title, weeks: ordered });
  weekCount += ordered.length;
  console.log(`  ✅ ${key}: ${ordered.length} week(s) → "${title}"`);
}

fs.writeFileSync(OUT, JSON.stringify({ units }, null, 2));
console.log(`\n────────────────────`);
console.log(
  `Assembled ${units.length} unit(s), ${weekCount} week(s). Wrote ${path.relative(process.cwd(), OUT)}.\n`
);
