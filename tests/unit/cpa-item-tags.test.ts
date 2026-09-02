/**
 * M-0.1 — CPA practice-item skill tagging.
 *
 * Every item in data/cpa/items.json (built from data/cpa/content/items/*.yaml)
 * must carry at least one canonical skill id from docs/SKILL_TAXONOMY.md
 * (frozen v1). These tags drive the Finance↔CMA↔CPA crosswalk and weak-skill
 * targeting, so a wrong id routes the wrong remediation — the tests below
 * therefore assert (a) non-empty coverage, (b) every id resolves against the
 * frozen taxonomy document itself (not a copy), and (c) per-section counts.
 */
import * as fs from "fs";
import * as path from "path";
import { describe, expect, it } from "vitest";

type BuiltItem = {
  id: string;
  section: string;
  topic?: string;
  blueprintArea?: string;
  skills?: string[];
};

type Bank = { sections: Record<string, BuiltItem[]> };

const ROOT = process.cwd();
const bank: Bank = JSON.parse(
  fs.readFileSync(path.join(ROOT, "data", "cpa", "items.json"), "utf8")
);
const TAXONOMY_DOC = fs.readFileSync(path.join(ROOT, "docs", "SKILL_TAXONOMY.md"), "utf8");

const allItems = (): BuiltItem[] => Object.values(bank.sections).flat();

/**
 * Item ids allowed to carry an empty `skills` array, each with the reason.
 * Deliberately empty: the (section, blueprint_area, topic) map covers 100% of
 * the bank today. Adding an entry here is a conscious admission that no
 * canonical id fits — do not use it to paper over a mapping gap.
 */
const UNTAGGED_ALLOWLIST: Record<string, string> = {};

/**
 * Canonical ids used by the tagging pass, transcribed from docs/SKILL_TAXONOMY.md.
 * Kept explicit so an accidental edit to the frozen doc cannot silently widen
 * what counts as valid; `resolves against the frozen taxonomy` below is the
 * independent second gate that reads the doc itself.
 */
const EXPECTED_IDS = [
  // Finance / CMA crosswalk
  "tvm",
  "ratio-analysis",
  // FAR
  "revenue-recognition",
  "leases",
  "consolidations",
  "governmental-accounting",
  // AUD
  "audit-risk-model",
  "audit-sampling",
  "substantive-procedures",
  "audit-reports",
  "internal-controls",
  "it-auditing",
  "other-engagements",
  "professional-ethics",
  // REG / TCP
  "individual-taxation",
  "entity-taxation",
  "property-transactions",
  "tax-procedures-ethics",
  "gift-estate-tax",
  "business-law",
  "tax-planning",
  "fixed-asset-depreciation",
  // BAR / ISC
  "financial-analysis",
  "restructuring-ma",
  "data-analytics",
  "it-governance",
  "soc-engagements",
  "security-privacy",
  "erp-data-flow",
] as const;

/** Section → expected usable item count in the built bank (build:cpa-items output). */
const EXPECTED_COUNTS: Record<string, number> = {
  FAR: 617,
  AUD: 498,
  REG: 498,
  BAR: 348,
  ISC: 60,
  TCP: 60,
};

describe("CPA item bank — skill tag coverage", () => {
  it("has the expected number of usable items per section", () => {
    const actual = Object.fromEntries(
      Object.entries(bank.sections).map(([section, items]) => [section, items.length])
    );
    expect(actual).toEqual(EXPECTED_COUNTS);
  });

  it("holds 2081 items in total", () => {
    expect(allItems()).toHaveLength(2081);
  });

  it("tags every item with at least one skill, unless explicitly allow-listed", () => {
    const untagged = allItems()
      .filter((item) => !Array.isArray(item.skills) || item.skills.length === 0)
      .filter((item) => !(item.id in UNTAGGED_ALLOWLIST))
      .map((item) => `${item.id} (${item.section} / ${item.topic ?? item.blueprintArea ?? "?"})`);
    expect(untagged).toEqual([]);
  });

  it("gives every item 1–3 skills (a 4th tag dilutes weak-skill routing)", () => {
    const overTagged = allItems()
      .filter((item) => (item.skills?.length ?? 0) > 3)
      .map((item) => `${item.id}: ${item.skills?.join(", ")}`);
    expect(overTagged).toEqual([]);
  });

  it("never repeats a skill id within one item", () => {
    const dupes = allItems()
      .filter((item) => new Set(item.skills ?? []).size !== (item.skills?.length ?? 0))
      .map((item) => item.id);
    expect(dupes).toEqual([]);
  });
});

describe("CPA item bank — skill ids resolve against the frozen taxonomy", () => {
  const usedIds = [...new Set(allItems().flatMap((item) => item.skills ?? []))].sort();

  it("uses only kebab-case ids", () => {
    expect(usedIds.filter((id) => !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toEqual([]);
  });

  it("uses only ids listed in this test's expected set", () => {
    expect(usedIds.filter((id) => !(EXPECTED_IDS as readonly string[]).includes(id))).toEqual([]);
  });

  it("resolves every used id against docs/SKILL_TAXONOMY.md (frozen v1)", () => {
    const unresolved = usedIds.filter((id) => !TAXONOMY_DOC.includes(`\`${id}\``));
    expect(unresolved).toEqual([]);
  });
});

describe("CPA item bank — section-appropriate tagging spot checks", () => {
  const bySection = (section: string) => bank.sections[section] ?? [];
  const skillsFor = (section: string, topicMatch: string) => {
    const item = bySection(section).find((i) => (i.topic ?? "").includes(topicMatch));
    expect(item, `no ${section} item with topic containing "${topicMatch}"`).toBeDefined();
    return item!.skills ?? [];
  };

  it("routes BAR Financial Ratios to the CMA/Finance crosswalk id", () => {
    expect(skillsFor("BAR", "Financial Ratios")).toEqual(["ratio-analysis", "financial-analysis"]);
  });

  it("routes BAR Business Combinations to consolidations + M&A", () => {
    expect(skillsFor("BAR", "Business Combinations")).toEqual([
      "consolidations",
      "restructuring-ma",
    ]);
  });

  it("routes AUD Sampling to audit-sampling", () => {
    expect(skillsFor("AUD", "Sampling")).toContain("audit-sampling");
  });

  it("routes AUD Ethics to professional-ethics only", () => {
    expect(skillsFor("AUD", "Ethics")).toEqual(["professional-ethics"]);
  });

  it("routes FAR Leases to the leases + TVM crosswalk", () => {
    expect(skillsFor("FAR", "Leases")).toEqual(["leases", "tvm"]);
  });

  it("keeps every AUD item inside the AUD/shared skill space", () => {
    const audAllowed = new Set([
      "audit-risk-model",
      "audit-sampling",
      "substantive-procedures",
      "audit-reports",
      "audit-evidence",
      "internal-controls",
      "it-auditing",
      "group-audits",
      "quality-management",
      "other-engagements",
      "professional-ethics",
    ]);
    const strays = bySection("AUD")
      .flatMap((item) => (item.skills ?? []).map((s) => `${item.id}:${s}`))
      .filter((pair) => !audAllowed.has(pair.split(":")[1]));
    expect(strays).toEqual([]);
  });

  it("keeps every ISC item inside the ISC/shared skill space", () => {
    const iscAllowed = new Set([
      "it-governance",
      "soc-engagements",
      "security-privacy",
      "data-analytics",
      "erp-data-flow",
      "it-auditing",
      "internal-controls",
      "audit-reports",
      "other-engagements",
    ]);
    const strays = bySection("ISC")
      .flatMap((item) => (item.skills ?? []).map((s) => `${item.id}:${s}`))
      .filter((pair) => !iscAllowed.has(pair.split(":")[1]));
    expect(strays).toEqual([]);
  });

  it("keeps every REG/TCP item inside the tax skill space", () => {
    const taxAllowed = new Set([
      "individual-taxation",
      "entity-taxation",
      "property-transactions",
      "tax-procedures-ethics",
      "gift-estate-tax",
      "business-law",
      "tax-planning",
      "fixed-asset-depreciation",
    ]);
    const strays = [...bySection("REG"), ...bySection("TCP")]
      .flatMap((item) => (item.skills ?? []).map((s) => `${item.id}:${s}`))
      .filter((pair) => !taxAllowed.has(pair.split(":")[1]));
    expect(strays).toEqual([]);
  });
});
