#!/usr/bin/env tsx
/**
 * build-cpa-items.ts — S1-C4 step 1.
 *
 * Parses the salvaged CPA item bank (data/cpa/content/items/items_<SECTION>.yaml,
 * multi-document YAML) into a clean, app-ready JSON the quiz engine can serve as a
 * "CPA Crossover" practice mode.
 *
 * IMPORTANT data-quality filter: many salvaged items have UNRENDERED template
 * expressions in their distractor options (e.g. "${payment * term}") — the item
 * generator never evaluated them. Serving those would show raw template syntax as
 * answer choices. We therefore drop any item whose stem or options contain "${",
 * and any item without exactly one correct key. The dropped count is reported so
 * the gap is visible (no silent truncation).
 *
 * Output: data/cpa/items.json  →  { generatedAtNote, sections: { FAR: [...], ... }, stats }
 * Run: npm run build:cpa-items
 */
import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";
import { repairItem, isRepaired } from "./cpa-item-repair";

const SRC = path.join(process.cwd(), "data", "cpa", "content", "items");
const OUT = path.join(process.cwd(), "data", "cpa", "items.json");
const SECTIONS = ["FAR", "AUD", "REG", "BAR", "ISC", "TCP"] as const;

type CleanItem = {
  id: string;
  section: string;
  difficulty?: string;
  topic?: string;
  blueprintArea?: string;
  stem: string;
  choices: string[];
  answer: number;
  explain?: string;
  refs?: string[];
  /** Canonical docs/SKILL_TAXONOMY.md (frozen v1) ids, from the YAML `skills:` list (M-0.1). */
  skills: string[];
};

const hasTemplate = (s: unknown) => typeof s === "string" && s.includes("${");

/** Skill ids tagged on the source YAML item (M-0.1). Passed through verbatim — never invented here. */
const skillsOf = (it: any): string[] =>
  Array.isArray(it?.skills) ? it.skills.map(String).filter((v: string) => v.length > 0) : [];

const out: Record<string, CleanItem[]> = {};
const stats: Record<
  string,
  {
    total: number;
    clean: number;
    repaired: number;
    templateBroken: number;
    noKey: number;
    untagged: number;
  }
> = {};
const failReasons: Record<string, number> = {};
let grandTotal = 0,
  grandClean = 0,
  grandRepaired = 0;

for (const section of SECTIONS) {
  const p = path.join(SRC, `items_${section}.yaml`);
  out[section] = [];
  stats[section] = { total: 0, clean: 0, repaired: 0, templateBroken: 0, noKey: 0, untagged: 0 };
  if (!fs.existsSync(p)) {
    console.log(`  ${section}: (file missing)`);
    continue;
  }

  let docs: any[] = [];
  try {
    docs = yaml.loadAll(fs.readFileSync(p, "utf8")) as any[];
  } catch (e: any) {
    console.log(`  ${section}: YAML parse error — ${e.message}`);
    continue;
  }

  for (const it of docs) {
    if (!it || !it.id || !Array.isArray(it.options)) continue;
    stats[section].total++;
    const options: Array<{ text: any; key: any }> = it.options;
    const templateBroken = hasTemplate(it.stem) || options.some((o) => hasTemplate(o.text));
    const keyIdx = options.findIndex((o) => o.key === true);
    if (templateBroken) {
      // S1-C8 recovery: the six parametric families are deterministic —
      // recompute option values from the stem parameters (see cpa-item-repair).
      const result = repairItem({ id: String(it.id), stem: String(it.stem), options });
      if (isRepaired(result)) {
        out[section].push({
          id: String(it.id),
          section,
          difficulty: it.difficulty,
          topic: it.topic,
          blueprintArea: it.blueprint_area,
          stem: result.stem,
          choices: result.choices,
          answer: result.answer,
          explain: it.explanation ? String(it.explanation).trim() : undefined,
          refs: Array.isArray(it.refs) ? it.refs.map(String) : undefined,
          skills: skillsOf(it),
        });
        stats[section].repaired++;
        stats[section].clean++;
        continue;
      }
      failReasons[result.reason] = (failReasons[result.reason] ?? 0) + 1;
      stats[section].templateBroken++;
      continue;
    }
    if (keyIdx < 0) {
      stats[section].noKey++;
      continue;
    }
    out[section].push({
      id: String(it.id),
      section,
      difficulty: it.difficulty,
      topic: it.topic,
      blueprintArea: it.blueprint_area,
      stem: String(it.stem).trim(),
      choices: options.map((o) => String(o.text)),
      answer: keyIdx,
      explain: it.explanation ? String(it.explanation).trim() : undefined,
      refs: Array.isArray(it.refs) ? it.refs.map(String) : undefined,
      skills: skillsOf(it),
    });
    stats[section].clean++;
  }
  stats[section].untagged = out[section].filter((i) => i.skills.length === 0).length;
  grandTotal += stats[section].total;
  grandClean += stats[section].clean;
  grandRepaired += stats[section].repaired;
  console.log(
    `  ${section}: ${stats[section].total} items | clean=${stats[section].clean} (repaired=${stats[section].repaired}) | still-broken=${stats[section].templateBroken} | no-key=${stats[section].noKey} | untagged=${stats[section].untagged}`
  );
}

if (Object.keys(failReasons).length > 0) {
  console.log(`  Repair failures by reason: ${JSON.stringify(failReasons)}`);
}

const payload = {
  note: "Built by scripts/build-cpa-items.ts from data/cpa/content/items/*.yaml. Parametric template items are repaired deterministically (scripts/cpa-item-repair.ts); unrepairable items are excluded.",
  sections: out,
  stats,
};
fs.writeFileSync(OUT, JSON.stringify(payload, null, 2));

console.log(
  `\n  TOTAL: ${grandTotal} items | usable=${grandClean} (${grandTotal ? ((100 * grandClean) / grandTotal).toFixed(1) : 0}%)`
);
console.log(`  Wrote ${path.relative(process.cwd(), OUT)}`);
if (grandClean === 0) {
  console.log(
    "  ⚠️ No usable items — the bank is entirely template-broken; do not surface CPA-crossover yet."
  );
}
