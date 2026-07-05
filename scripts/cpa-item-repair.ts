/**
 * cpa-item-repair.ts — S1-C8 mechanical recovery of template-broken CPA items.
 *
 * The salvaged item generator emitted six parametric item families whose
 * option templates (e.g. "${payment * term}") were never evaluated. The
 * parameters live verbatim in each stem, and every family's formula is
 * unambiguous from its rendered anchors and explanation, so the values can
 * be recomputed deterministically at build time. Anything that fails a
 * strict stem match, an anchor self-check, or option-uniqueness validation
 * is left excluded and reported — no silent junk.
 *
 * Families (template signature → formula):
 *  LEAS  (FAR): PV of ordinary annuity; rendered correct answer doubles as a
 *               to-the-dollar self-check on the extraction + formula.
 *  REVE  (FAR): relative-SSP allocation (ASC 606); anchor = Product SSP option.
 *  CONS  (FAR): NCI share of NI (ASC 810); anchor = NI option.
 *  BUSI  (BAR): goodwill = price − FVNA (ASC 805); anchor = price option.
 *  INDI  (REG): AGI with SE-tax deduction; anchor = wages option.
 *  ENTI  (REG): corp TI before DRD/charity; anchor = GI option.
 *
 * Because each family's source data keeps the correct answer in a fixed
 * option slot, repaired items get a deterministic per-item shuffle (seeded
 * by id) so section drills can't learn the answer position.
 */

export interface RawOption {
  text: unknown;
  key: unknown;
}

export interface RawItem {
  id: string;
  stem: string;
  options: RawOption[];
}

export interface RepairedItem {
  stem: string;
  choices: string[];
  answer: number;
}

export interface RepairFailure {
  reason:
    | "unknown-family"
    | "stem-mismatch"
    | "anchor-mismatch"
    | "duplicate-values"
    | "bad-options";
}

const fmtUSD = (n: number): string => {
  const r = Math.round(n);
  return r < 0 ? `-$${Math.abs(r).toLocaleString("en-US")}` : `$${r.toLocaleString("en-US")}`;
};

const parseMoney = (s: string): number => Number(s.replace(/[$,]/g, ""));

/** Add thousands separators to bare $ amounts inside a stem. */
function formatStemDollars(stem: string): string {
  return stem.replace(/\$(\d{4,})(?!\d)/g, (_, digits: string) => `$${Number(digits).toLocaleString("en-US")}`);
}

/** Deterministic small hash for the per-item option shuffle. */
function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed || 1;
  for (let i = a.length - 1; i > 0; i--) {
    // xorshift32
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type OptionValue = { value: number; key: boolean };

interface FamilyDef {
  /** Every one of these template strings must appear among the options. */
  templates: string[];
  stemPattern: RegExp;
  /**
   * Compute the numeric value of every option (template or rendered) from the
   * stem captures. Returns null when an anchor self-check fails.
   */
  evaluate(captures: string[], options: RawOption[]): OptionValue[] | null;
}

/** Evaluate one option list where each template has a value fn and rendered $ options pass through. */
function mapOptions(
  options: RawOption[],
  templateValues: Record<string, number>,
  anchorCheck: (renderedValue: number) => boolean
): OptionValue[] | null {
  const out: OptionValue[] = [];
  for (const o of options) {
    const text = String(o.text);
    if (text.includes("${")) {
      if (!(text in templateValues)) return null;
      out.push({ value: templateValues[text], key: o.key === true });
    } else {
      const v = parseMoney(text);
      if (!Number.isFinite(v)) return null;
      // Rendered non-zero options are stem parameters — verify one of them.
      if (v !== 0 && !anchorCheck(v)) return null;
      out.push({ value: v, key: o.key === true });
    }
  }
  return out;
}

const FAMILIES: FamilyDef[] = [
  {
    // FAR leases: rendered correct answer lets us verify the PV to the dollar.
    templates: ["${pv_calculated * 1.06}", "${payment * term}", "${payment * (term - 1)}"],
    stemPattern:
      /^Lessee enters (\d+)-year lease, annual payments \$([\d,]+), IBR (\d+(?:\.\d+)?)%, no initial costs\. Calculate initial lease liability\.$/,
    evaluate(captures, options) {
      const term = Number(captures[0]);
      const payment = parseMoney(captures[1]);
      const rate = Number(captures[2]) / 100;
      if (!term || !payment || !rate) return null;
      const pv = (payment * (1 - Math.pow(1 + rate, -term))) / rate;

      const rendered = options.find((o) => !String(o.text).includes("${"));
      if (!rendered || rendered.key !== true) return null;
      // Self-check: our PV must reproduce the authored correct answer.
      if (Math.abs(parseMoney(String(rendered.text)) - Math.round(pv)) > 1) return null;

      const templateValues: Record<string, number> = {
        // The literal template hardcoded 1.06; the intended error is the
        // annuity-due value, so use (1 + item rate).
        "${pv_calculated * 1.06}": pv * (1 + rate),
        "${payment * term}": payment * term,
        "${payment * (term - 1)}": payment * (term - 1),
      };
      return mapOptions(options, templateValues, (v) => Math.abs(v - Math.round(pv)) <= 1);
    },
  },
  {
    // FAR revenue allocation (ASC 606) — anchor: the Product-SSP distractor.
    templates: ["${allocated_prod}", "${allocated_prod * 1.1}", "${total * 0.5}"],
    stemPattern:
      /^Contract price \$([\d,]+), standalone selling prices: Product \$([\d,]+), Service \$([\d,]+), Warranty \$([\d,]+)\. Allocate transaction price to Product\.$/,
    evaluate(captures, options) {
      const cp = parseMoney(captures[0]);
      const p = parseMoney(captures[1]);
      const s = parseMoney(captures[2]);
      const w = parseMoney(captures[3]);
      if (!cp || !p || !s) return null;
      const allocated = (cp * p) / (p + s + w);
      const templateValues: Record<string, number> = {
        "${allocated_prod}": allocated,
        "${allocated_prod * 1.1}": allocated * 1.1,
        "${total * 0.5}": cp * 0.5,
      };
      return mapOptions(options, templateValues, (v) => v === p);
    },
  },
  {
    // FAR consolidations NCI (ASC 810) — anchor: the NI distractor.
    templates: ["${nci_ni}", "${div * (100 - pct) / 100}"],
    stemPattern:
      /^Parent owns (\d+(?:\.\d+)?)% of Sub\. Sub reports NI \$([\d,]+), dividends \$([\d,]+)\. Calculate non-controlling interest in NI\.$/,
    evaluate(captures, options) {
      const pct = Number(captures[0]);
      const ni = parseMoney(captures[1]);
      const div = parseMoney(captures[2]);
      if (!pct || !ni) return null;
      const templateValues: Record<string, number> = {
        "${nci_ni}": (ni * (100 - pct)) / 100,
        "${div * (100 - pct) / 100}": (div * (100 - pct)) / 100,
      };
      return mapOptions(options, templateValues, (v) => v === ni);
    },
  },
  {
    // BAR business combinations goodwill (ASC 805) — anchor: the price distractor.
    templates: ["${goodwill}", "${price - bv}"],
    stemPattern:
      /^Acquirer purchases 100% of Target for \$([\d,]+)\. Target's book value \$([\d,]+), FV of identifiable net assets \$([\d,]+)\. Calculate goodwill\.$/,
    evaluate(captures, options) {
      const price = parseMoney(captures[0]);
      const bv = parseMoney(captures[1]);
      const fv = parseMoney(captures[2]);
      if (!price || !fv) return null;
      const templateValues: Record<string, number> = {
        "${goodwill}": price - fv,
        "${price - bv}": price - bv,
      };
      return mapOptions(options, templateValues, (v) => v === price);
    },
  },
  {
    // REG individual AGI — anchor: the wages distractor.
    templates: ["${agi_calc}", "${wages + se_income}", "${agi_calc + ira + sli}"],
    stemPattern:
      /^Taxpayer: Wages \$([\d,]+), SE income \$([\d,]+), IRA contribution \$([\d,]+), student loan interest \$([\d,]+)\. Calculate AGI\.$/,
    evaluate(captures, options) {
      const wages = parseMoney(captures[0]);
      const se = parseMoney(captures[1]);
      const ira = parseMoney(captures[2]);
      const sli = parseMoney(captures[3]);
      if (!wages || !se) return null;
      // Half of SE tax (net earnings × 15.3%) is the above-the-line deduction.
      const seDeduction = (se * 0.9235 * 0.153) / 2;
      const agi = wages + se - seDeduction - ira - sli;
      const templateValues: Record<string, number> = {
        "${agi_calc}": agi,
        "${wages + se_income}": wages + se,
        "${agi_calc + ira + sli}": agi + ira + sli,
      };
      return mapOptions(options, templateValues, (v) => v === wages);
    },
  },
  {
    // REG corp TI before DRD/charity — anchor: the GI distractor. The stated
    // gross income excludes the separately listed dividends (the gi − exp
    // distractor is the "forgot dividends" error), so TI = gi + div − exp.
    templates: ["${ti_before}", "${gi - exp}", "${gi - exp - div}"],
    stemPattern:
      /^C-Corp: Gross income \$([\d,]+), deductible expenses \$([\d,]+), dividends received \$([\d,]+) from (\d+(?:\.\d+)?)%-owned corp, charitable contribution \$([\d,]+)\. Calculate TI before DRD and charity\.$/,
    evaluate(captures, options) {
      const gi = parseMoney(captures[0]);
      const exp = parseMoney(captures[1]);
      const div = parseMoney(captures[2]);
      if (!gi || !exp) return null;
      const templateValues: Record<string, number> = {
        "${ti_before}": gi + div - exp,
        "${gi - exp}": gi - exp,
        "${gi - exp - div}": gi - exp - div,
      };
      return mapOptions(options, templateValues, (v) => v === gi);
    },
  },
];

/** Stem notes for families whose simplified formulas need stated assumptions. */
const STEM_ASSUMPTIONS: Array<{ pattern: RegExp; note: string }> = [
  {
    pattern: /Calculate AGI\.$/,
    note: " (Assume no phaseout or wage-base limitations apply.)",
  },
];

/**
 * Attempt to repair one template-broken item. Returns the repaired stem,
 * uniformly formatted choices, and the (shuffled) answer index — or a
 * failure reason for the build report.
 */
export function repairItem(item: RawItem): RepairedItem | RepairFailure {
  if (!Array.isArray(item.options) || item.options.length !== 4) return { reason: "bad-options" };
  if (item.options.filter((o) => o.key === true).length !== 1) return { reason: "bad-options" };

  const texts = item.options.map((o) => String(o.text));
  const family = FAMILIES.find((f) => f.templates.every((t) => texts.includes(t)));
  if (!family) return { reason: "unknown-family" };

  const match = item.stem.trim().match(family.stemPattern);
  if (!match) return { reason: "stem-mismatch" };

  const values = family.evaluate(match.slice(1), item.options);
  if (!values) return { reason: "anchor-mismatch" };

  const display = values.map((v) => ({ text: fmtUSD(v.value), key: v.key }));
  // Distinctness after rounding — a distractor colliding with the correct
  // answer (or another distractor) makes the item ungradable.
  if (new Set(display.map((d) => d.text)).size !== 4) return { reason: "duplicate-values" };

  const shuffled = seededShuffle(display, hashId(item.id));
  let stem = formatStemDollars(item.stem.trim());
  for (const { pattern, note } of STEM_ASSUMPTIONS) {
    if (pattern.test(stem)) stem += note;
  }

  return {
    stem,
    choices: shuffled.map((d) => d.text),
    answer: shuffled.findIndex((d) => d.key),
  };
}

export function isRepaired(r: RepairedItem | RepairFailure): r is RepairedItem {
  return (r as RepairedItem).choices !== undefined;
}
