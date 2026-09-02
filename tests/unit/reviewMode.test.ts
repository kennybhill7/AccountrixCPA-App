import { describe, expect, it } from "vitest";
import {
  DEFECT_LIBRARY,
  REVIEW_WORKPAPERS,
  applyVariant,
  buildReviewCase,
  cellKey,
  getReviewWorkpaper,
  gradeReviewSubmission,
  hashSeed,
  listReviewWorkpapers,
  parseRef,
  pickVariant,
  recomputeSections,
  seededDefectTypes,
  verifyWorkpaper,
  type DefectType,
  type ReviewCase,
  type ReviewSection,
  type ReviewWorkpaper,
} from "@/lib/reviewMode";

/** Read a cell out of a built case by its canonical key. */
function cell(sections: ReviewSection[], key: string): number | string | null {
  const [sectionId, rowId, columnId] = key.split("/");
  const section = sections.find((s) => s.id === sectionId);
  const row = section?.rows.find((r) => r.id === rowId);
  return row?.values[columnId] ?? null;
}

function num(sections: ReviewSection[], key: string): number {
  const v = cell(sections, key);
  if (typeof v !== "number") throw new Error(`${key} is not numeric: ${JSON.stringify(v)}`);
  return v;
}

/** Build a specific variant by id, bypassing the seed lottery. */
function caseFor(workpaperId: string, variantId: string): ReviewCase {
  const wp = getReviewWorkpaper(workpaperId);
  if (!wp) throw new Error(`unknown workpaper ${workpaperId}`);
  const variant = wp.variants.find((v) => v.id === variantId);
  if (!variant) throw new Error(`unknown variant ${workpaperId}/${variantId}`);
  const built = applyVariant(wp, variant);
  return {
    workpaperId: wp.id,
    title: wp.title,
    company: wp.company,
    period: wp.period,
    preparedBy: wp.preparedBy,
    purpose: wp.purpose,
    assertion: wp.assertion,
    skills: wp.skills,
    seed: 0,
    variant,
    isClean: variant.type === "none",
    sections: built.sections,
    cleanSections: built.cleanSections,
    changedCells: built.changedCells,
    acceptedCells:
      variant.type === "none"
        ? []
        : [variant.rootCell.replace(":", "/").replace("@", "/"), ...(variant.acceptedCells ?? [])],
  };
}

// ---------------------------------------------------------------------------
// Seed-data arithmetic — the clean workpapers must actually foot
// ---------------------------------------------------------------------------

describe("seed data — clean arithmetic is proven, not asserted", () => {
  it("has at least 6 review workpapers", () => {
    expect(REVIEW_WORKPAPERS.length).toBeGreaterThanOrEqual(6);
  });

  it.each(REVIEW_WORKPAPERS.map((wp) => [wp.id, wp] as [string, ReviewWorkpaper]))(
    "%s: every authored derived cell equals what its own formula computes",
    (_id, wp) => {
      expect(verifyWorkpaper(wp)).toEqual([]);
    }
  );

  it("covers every defect in the library", () => {
    const seeded = new Set(seededDefectTypes());
    const missing = (Object.keys(DEFECT_LIBRARY) as DefectType[]).filter((t) => !seeded.has(t));
    expect(missing).toEqual([]);
  });

  it("gives every workpaper a clean variant so the drill is not pattern-matching", () => {
    for (const wp of REVIEW_WORKPAPERS) {
      expect(wp.variants.some((v) => v.type === "none")).toBe(true);
    }
  });

  // Negative controls: a gate that never fails is not a gate. These prove
  // verifyWorkpaper would actually catch bad seed data.
  it("REJECTS an authored derived value that disagrees with its own formula", () => {
    const wp = JSON.parse(
      JSON.stringify(getReviewWorkpaper("equipment-yard-allocation"))
    ) as ReviewWorkpaper;
    const total = wp.sections[0].rows.find((r) => r.id === "total")!;
    total.values.allocated = 640001; // off by one dollar
    const problems = verifyWorkpaper(wp);
    expect(problems.length).toBeGreaterThan(0);
    expect(problems[0].where).toBe("alloc/total/allocated");
  });

  it("REJECTS a defect variant that changes nothing, and a clean variant that changes something", () => {
    const wp = JSON.parse(
      JSON.stringify(getReviewWorkpaper("job-margin-scope"))
    ) as ReviewWorkpaper;
    const defect = wp.variants.find((v) => v.type === "scope-mismatch")!;
    // rewrite the op so it "corrupts" the cell to its own clean value
    defect.ops = [{ cell: "margin:gross-margin@amount", value: 330000 }];
    expect(verifyWorkpaper(wp).some((p) => /changed nothing/.test(p.message))).toBe(true);

    const clean = wp.variants.find((v) => v.type === "none")!;
    clean.ops = [{ cell: "margin:contract-total@amount", value: 1 }];
    expect(verifyWorkpaper(wp).some((p) => /clean variant must not change/.test(p.message))).toBe(
      true
    );
  });

  it("REJECTS a defect variant with no cause rubric", () => {
    const wp = JSON.parse(
      JSON.stringify(getReviewWorkpaper("intercompany-clearing"))
    ) as ReviewWorkpaper;
    const defect = wp.variants.find((v) => v.type !== "none")!;
    delete defect.cause;
    expect(verifyWorkpaper(wp).some((p) => /cause rubric/.test(p.message))).toBe(true);
  });

  it("summarises workpapers for the hub without leaking the answer", () => {
    const summaries = listReviewWorkpapers();
    expect(summaries).toHaveLength(REVIEW_WORKPAPERS.length);
    for (const s of summaries) {
      expect(s.defectTypes).not.toContain("none");
      expect(s.variantCount).toBeGreaterThanOrEqual(2);
    }
  });
});

// ---------------------------------------------------------------------------
// The engine
// ---------------------------------------------------------------------------

describe("recompute engine", () => {
  it("resolves cross-section references and skips blanks in a SUM", () => {
    const wp = getReviewWorkpaper("tb-variance-review")!;
    const clean = recomputeSections(wp.sections);
    // Two accounts have a null (suppressed) prior year — SUM must ignore them.
    expect(num(clean, "tb/total/py")).toBe(4763800);
    expect(num(clean, "tb/total/cy")).toBe(5292590);
    expect(num(clean, "tb/total/variance")).toBe(528790);
    // Prior-year 0/null denominator yields "not meaningful", not Infinity.
    expect(cell(clean, "tb/acct-5450/variancePct")).toBeNull();
  });

  it("rolls a running balance forward across columns", () => {
    const wp = getReviewWorkpaper("retainage-rollforward")!;
    const clean = recomputeSections(wp.sections);
    expect(num(clean, "roll/retainage-balance/q1")).toBe(62000);
    expect(num(clean, "roll/retainage-balance/q2")).toBe(96250);
    expect(num(clean, "roll/retainage-balance/q3")).toBe(108750);
  });

  it("throws on a circular reference instead of looping", () => {
    const sections: ReviewSection[] = [
      {
        id: "s",
        title: "s",
        columns: [{ id: "amount", label: "Amount" }],
        rows: [
          {
            id: "a",
            label: "a",
            values: { amount: 0 },
            formulas: { amount: { kind: "sum", of: ["b"] } },
          },
          {
            id: "b",
            label: "b",
            values: { amount: 0 },
            formulas: { amount: { kind: "sum", of: ["a"] } },
          },
        ],
      },
    ];
    expect(() => recomputeSections(sections)).toThrow(/circular/i);
  });

  it("parses the whole cell-ref grammar", () => {
    expect(parseRef("row")).toEqual({ sectionId: null, rowId: "row", columnId: null });
    expect(parseRef("row@col")).toEqual({ sectionId: null, rowId: "row", columnId: "col" });
    expect(parseRef("sec:row")).toEqual({ sectionId: "sec", rowId: "row", columnId: null });
    expect(parseRef("sec:row@col")).toEqual({ sectionId: "sec", rowId: "row", columnId: "col" });
    expect(() => parseRef("not a ref")).toThrow();
  });

  it("is deterministic: the same seed always yields the same defect", () => {
    for (const wp of REVIEW_WORKPAPERS) {
      for (const seed of [1, 7, 42, 1234]) {
        const a = buildReviewCase(wp, seed);
        const b = buildReviewCase(wp, seed);
        expect(a.variant.id).toBe(b.variant.id);
        expect(a.sections).toEqual(b.sections);
      }
    }
  });

  it("reaches every variant across seeds, clean ones included", () => {
    for (const wp of REVIEW_WORKPAPERS) {
      const seen = new Set<string>();
      for (let seed = 1; seed <= 200; seed++) seen.add(pickVariant(wp, seed).id);
      expect(Array.from(seen).sort()).toEqual(wp.variants.map((v) => v.id).sort());
    }
  });

  it("hashes seeds stably", () => {
    expect(hashSeed("abc")).toBe(hashSeed("abc"));
    expect(hashSeed("abc")).not.toBe(hashSeed("abd"));
  });

  it("leaves a clean variant byte-identical to the recomputed clean workpaper", () => {
    for (const wp of REVIEW_WORKPAPERS) {
      const cleanVariant = wp.variants.find((v) => v.type === "none")!;
      const built = applyVariant(wp, cleanVariant);
      expect(built.changedCells).toEqual([]);
      expect(built.sections).toEqual(recomputeSections(wp.sections));
    }
  });

  it("marks the seeded cell as the root and everything else as downstream", () => {
    const built = caseFor("land-dev-sources-uses", "soft-block-total");
    const roots = built.changedCells.filter((c) => c.isRoot);
    expect(roots).toHaveLength(1);
    expect(roots[0].key).toBe("uses/total-uses/amount");
    expect(built.changedCells.length).toBeGreaterThan(1);
  });
});

// ---------------------------------------------------------------------------
// Defect-by-defect arithmetic: clean value vs corrupted value
// ---------------------------------------------------------------------------

describe("defect 1 — footing break (allocation parts do not sum to the pool)", () => {
  const c = caseFor("equipment-yard-allocation", "double-counted-driver");

  it("clean: 16,000 hours at 40.00 fully allocates the 640,000 pool", () => {
    expect(num(c.cleanSections, "alloc/total/machineHours")).toBe(16000);
    expect(num(c.cleanSections, "alloc/total/allocated")).toBe(640000);
    expect(num(c.cleanSections, "alloc/unallocated/allocated")).toBe(0);
    expect(num(c.cleanSections, "alloc/rate-check/rate")).toBe(40);
  });

  it("corrupted: the utilities driver double-counts concrete hours and the parts over-foot", () => {
    expect(num(c.sections, "alloc/div-utilities/machineHours")).toBe(6400); // 3,600 + 2,800
    expect(num(c.sections, "alloc/div-utilities/allocated")).toBe(256000);
    expect(num(c.sections, "alloc/total/allocated")).toBe(752000);
    expect(num(c.sections, "alloc/unallocated/allocated")).toBe(-112000);
    expect(num(c.sections, "alloc/rate-check/rate")).toBeCloseTo(34.042553, 5);
  });
});

describe("defect 10 — hardcoded arithmetic buried in a formula", () => {
  const c = caseFor("equipment-yard-allocation", "plugged-paving");

  it("corrupted: paving is a plug that ties to no input", () => {
    expect(num(c.sections, "alloc/div-paving/allocated")).toBe(178500);
    // hours x rate would be 4,200 x 40 = 168,000 — the tell is the 10,500 gap
    expect(
      num(c.sections, "alloc/div-paving/machineHours") * num(c.sections, "alloc/rate-row/rate")
    ).toBe(168000);
    expect(num(c.sections, "alloc/total/allocated")).toBe(650500);
    expect(num(c.sections, "alloc/unallocated/allocated")).toBe(-10500);
    // hours still foot and the rate still re-derives — that is what hides it
    expect(num(c.sections, "alloc/total/machineHours")).toBe(16000);
    expect(num(c.sections, "alloc/rate-check/rate")).toBe(40);
  });
});

describe("defect 2 — wrong-range summary (negative loan balance downstream)", () => {
  const c = caseFor("land-dev-sources-uses", "soft-block-total");

  it("clean: uses foot to 13,335,000 and the draw fits the commitment", () => {
    expect(num(c.cleanSections, "uses/total-uses/amount")).toBe(13335000);
    expect(num(c.cleanSections, "sources/loan-draw/amount")).toBe(10000000);
    expect(num(c.cleanSections, "sources/availability/amount")).toBe(400000);
    expect(num(c.cleanSections, "returns/margin/pct")).toBeCloseTo(16.13, 2);
  });

  it("corrupted: the total sums only the soft block, and the loan balance goes NEGATIVE", () => {
    expect(num(c.sections, "uses/total-uses/amount")).toBe(1790000); // 1,325,000 + 465,000
    expect(num(c.sections, "sources/loan-draw/amount")).toBe(-1545000);
    expect(num(c.sections, "sources/loan-draw/amount")).toBeLessThan(0);
    expect(num(c.sections, "returns/project-profit/amount")).toBe(14110000);
    expect(num(c.sections, "returns/margin/pct")).toBeCloseTo(88.74, 2);
  });
});

describe("defect 5 — percent complete computed on revenue", () => {
  const c = caseFor("wip-percent-complete", "pct-on-billings");

  it("clean: 45% on cost gives 2,160,000 earned and a 100,000 overbilling", () => {
    expect(num(c.cleanSections, "wip/pct-complete/pct")).toBe(45);
    expect(num(c.cleanSections, "wip/earned-revenue/amount")).toBe(2160000);
    expect(num(c.cleanSections, "wip/over-under/amount")).toBe(100000);
  });

  it("corrupted: billings-based completion makes the over/under collapse to zero", () => {
    expect(num(c.sections, "wip/pct-complete/pct")).toBeCloseTo(47.0833, 4);
    expect(num(c.sections, "wip/earned-revenue/amount")).toBeCloseTo(2260000, 2);
    expect(num(c.sections, "wip/over-under/amount")).toBeCloseTo(0, 2);
    // the stale classification note still claims a 100,000 liability
    expect(String(cell(c.sections, "wip/classification/memo"))).toContain("LIABILITY");
  });
});

describe("defect 8 — over/under billing reversed", () => {
  const c = caseFor("wip-percent-complete", "reversed-over-under");

  it("corrupted: a 100,000 overbilling is presented as a contract asset", () => {
    expect(num(c.sections, "wip/over-under/amount")).toBe(-100000);
    expect(String(cell(c.sections, "wip/classification/memo"))).toContain("ASSET");
    expect(String(cell(c.cleanSections, "wip/classification/memo"))).toContain("LIABILITY");
    // the inputs are untouched: billed > earned, so the answer must be positive
    expect(num(c.sections, "wip/billed-to-date/amount")).toBeGreaterThan(
      num(c.sections, "wip/earned-revenue/amount")
    );
  });
});

describe("defect 4 — clearing account does not net to zero", () => {
  const c = caseFor("intercompany-clearing", "residual-clearing");

  it("clean: the three entities net to exactly 0.00", () => {
    expect(num(c.cleanSections, "clearing/combined/amount")).toBe(0);
  });

  it("corrupted: a 17,300 residual sits under a conclusion that still claims zero", () => {
    expect(num(c.sections, "clearing/combined/amount")).toBe(17300);
    expect(String(cell(c.sections, "clearing/conclusion/memo"))).toContain("nets to 0.00");
  });
});

describe("defect 3 — scope mismatch (full revenue vs partial cost)", () => {
  const c = caseFor("job-margin-scope", "phase1-only-cost");

  it("clean: both phases of cost against a two-phase contract = 13.47%", () => {
    expect(num(c.cleanSections, "margin/cost-total/amount")).toBe(2120000);
    expect(num(c.cleanSections, "margin/gross-margin/amount")).toBe(330000);
    expect(num(c.cleanSections, "margin/margin-pct/pct")).toBeCloseTo(13.47, 2);
  });

  it("corrupted: Phase 2 cost drops out and the margin quadruples", () => {
    expect(num(c.sections, "margin/gross-margin/amount")).toBe(1270000); // 2,450,000 - 1,180,000
    expect(num(c.sections, "margin/margin-pct/pct")).toBeCloseTo(51.84, 2);
    // the omitted amount is exactly Phase 2
    expect(
      num(c.sections, "margin/gross-margin/amount") -
        num(c.cleanSections, "margin/gross-margin/amount")
    ).toBe(num(c.cleanSections, "margin/cost-phase2/amount"));
  });
});

describe("defect 9 — retainage double-counted", () => {
  const c = caseFor("retainage-rollforward", "retainage-added-back");

  it("clean: the presented total ties to the aging at 0.00", () => {
    expect(num(c.cleanSections, "ar/ar-current-portion/amount")).toBe(3011250);
    expect(num(c.cleanSections, "ar/ar-presented/amount")).toBe(3120000);
    expect(num(c.cleanSections, "ar/tie-to-aging/amount")).toBe(0);
  });

  it("corrupted: retainage is added to an aging that already contains it", () => {
    expect(num(c.sections, "ar/ar-presented/amount")).toBe(3228750);
    expect(num(c.sections, "ar/tie-to-aging/amount")).toBe(108750);
    // the overstatement equals the retainage balance exactly
    expect(num(c.sections, "ar/tie-to-aging/amount")).toBe(
      num(c.sections, "ar/retainage-in-ar/amount")
    );
  });
});

describe("defect 6 — period activity presented as an ending balance", () => {
  const c = caseFor("retainage-rollforward", "activity-as-balance");

  it("corrupted: the balance falls while withholdings exceed releases", () => {
    expect(num(c.sections, "roll/retainage-balance/q1")).toBe(62000);
    expect(num(c.sections, "roll/retainage-balance/q2")).toBe(34250); // 79,250 - 45,000
    expect(num(c.sections, "roll/retainage-balance/q3")).toBe(12500); // 70,500 - 58,000
    expect(num(c.sections, "roll/retainage-withheld/q3")).toBeGreaterThan(
      num(c.sections, "roll/retainage-released/q3")
    );
    // and the AR split inherits the understatement
    expect(num(c.sections, "ar/retainage-in-ar/amount")).toBe(12500);
    expect(num(c.sections, "ar/ar-current-portion/amount")).toBe(3107500);
    expect(
      num(c.cleanSections, "ar/retainage-in-ar/amount") -
        num(c.sections, "ar/retainage-in-ar/amount")
    ).toBe(96250);
  });

  it("the tie-out check does NOT catch it — that is the lesson", () => {
    expect(num(c.sections, "ar/tie-to-aging/amount")).toBe(0);
  });
});

describe("defect 7 — false-positive variance from a suppressed TB row", () => {
  const c = caseFor("tb-variance-review", "suppressed-rows-as-exceptions");

  it("the numbers are identical to the clean paper — only the dispositions are wrong", () => {
    for (const key of [
      "tb/total/py",
      "tb/total/cy",
      "tb/total/variance",
      "tb/acct-5450/variance",
    ]) {
      expect(num(c.sections, key)).toBe(num(c.cleanSections, key));
    }
    expect(c.changedCells.every((x) => x.key.endsWith("/disposition"))).toBe(true);
  });

  it("corrupted: two suppressed-row accounts are written up as unexplained exceptions", () => {
    expect(String(cell(c.sections, "tb/acct-5450/disposition"))).toContain("EXCEPTION");
    expect(String(cell(c.sections, "tb/acct-5900/disposition"))).toContain("EXCEPTION");
    expect(String(cell(c.sections, "tb/conclusion/disposition"))).toContain("Three exceptions");
    expect(String(cell(c.cleanSections, "tb/acct-5450/disposition"))).toContain("Not a variance");
  });
});

// ---------------------------------------------------------------------------
// Grading — three levels, scored separately
// ---------------------------------------------------------------------------

describe("grading — clean workpapers", () => {
  const clean = caseFor("equipment-yard-allocation", "clean");

  it("rewards signing off on correct work", () => {
    const g = gradeReviewSubmission(clean, { verdict: "sign-off" });
    expect(g.passed).toBe(true);
    expect(g.score).toBe(1);
    expect(g.max).toBe(1);
    expect(g.levels.filter((l) => l.applicable)).toHaveLength(1);
  });

  it("fails a false positive — refusing to sign correct work is also a miss", () => {
    const g = gradeReviewSubmission(clean, {
      verdict: "exception",
      selectedCell: "alloc/total/allocated",
      cause:
        "The total does not look right to me at all and I would want more support before signing.",
    });
    expect(g.passed).toBe(false);
    expect(g.score).toBe(0);
    expect(g.headline).toMatch(/clean workpaper/i);
  });
});

describe("grading — the three levels are scored separately", () => {
  const c = caseFor("land-dev-sources-uses", "soft-block-total");
  const rootCell = "uses/total-uses/amount";

  it("signing off on a defective paper scores zero on all three", () => {
    const g = gradeReviewSubmission(c, { verdict: "sign-off" });
    expect(g.score).toBe(0);
    expect(g.max).toBe(3);
    expect(g.levels.map((l) => l.ok)).toEqual([false, false, false]);
  });

  it("finding without locating is partial credit", () => {
    const g = gradeReviewSubmission(c, { verdict: "exception" });
    expect(g.score).toBe(1);
    expect(g.partial).toBe(true);
    expect(g.passed).toBe(false);
    expect(g.levels[0].ok).toBe(true);
    expect(g.levels[1].ok).toBe(false);
  });

  it("flagging a downstream symptom is detection credit, not location credit", () => {
    const g = gradeReviewSubmission(c, {
      verdict: "exception",
      selectedCell: "sources/loan-draw/amount",
    });
    expect(g.levels[0].ok).toBe(true);
    expect(g.levels[1].ok).toBe(false);
    expect(g.flaggedSymptom).toBe(true);
    expect(g.levels[1].detail).toMatch(/downstream/i);
  });

  it("flagging a cell that is actually correct earns no location credit and is not a symptom", () => {
    const g = gradeReviewSubmission(c, { verdict: "exception", selectedCell: "uses/land/amount" });
    expect(g.levels[1].ok).toBe(false);
    expect(g.flaggedSymptom).toBe(false);
    expect(g.levels[1].detail).toMatch(/correct as presented/i);
  });

  it("locating without explaining scores 2 of 3", () => {
    const g = gradeReviewSubmission(c, { verdict: "exception", selectedCell: rootCell });
    expect(g.score).toBe(2);
    expect(g.levels[2].ok).toBe(false);
    expect(g.passed).toBe(false);
  });

  it("found + located + explained scores 3 of 3", () => {
    const g = gradeReviewSubmission(c, {
      verdict: "exception",
      selectedCell: rootCell,
      cause: c.variant.causeSummary,
    });
    expect(g.score).toBe(3);
    expect(g.passed).toBe(true);
  });

  it("reuses the narrative grader, so a keyword dump does not earn the cause point", () => {
    const g = gradeReviewSubmission(c, {
      verdict: "exception",
      selectedCell: rootCell,
      cause:
        "range sub-block land hard cost total all uses negative 1,790,000 13,335,000 absurd range land",
    });
    expect(g.levels[2].ok).toBe(false);
    expect(g.narrative?.dimensions.find((d) => d.name === "prose")?.ok).toBe(false);
    expect(g.score).toBe(2);
  });

  it("accepts either of the two defensible cells when a defect has more than one", () => {
    const clearing = caseFor("intercompany-clearing", "residual-clearing");
    for (const key of ["clearing/entity-ridge/amount", "clearing/combined/amount"]) {
      const g = gradeReviewSubmission(clearing, { verdict: "exception", selectedCell: key });
      expect(g.levels[1].ok).toBe(true);
    }
  });
});

describe("grading — every model answer passes its own rubric", () => {
  const defectVariants = REVIEW_WORKPAPERS.flatMap((wp) =>
    wp.variants
      .filter((v) => v.type !== "none")
      .map((v) => [`${wp.id}/${v.id}`, wp.id, v.id] as const)
  );

  it.each(defectVariants)("%s", (_label, workpaperId, variantId) => {
    const c = caseFor(workpaperId, variantId);
    const g = gradeReviewSubmission(c, {
      verdict: "exception",
      selectedCell: c.acceptedCells[0],
      cause: c.variant.causeSummary,
    });
    expect(g.narrative?.message ?? "no narrative").toBeTruthy();
    expect(g.score).toBe(3);
    expect(g.passed).toBe(true);
  });
});

describe("buildReviewCase wiring", () => {
  it("exposes the accepted cells in canonical section/row/column form", () => {
    const wp = getReviewWorkpaper("job-margin-scope")!;
    // find a seed that lands on the defect variant
    let built = buildReviewCase(wp, 1);
    for (let seed = 1; seed <= 50 && built.isClean; seed++) built = buildReviewCase(wp, seed);
    expect(built.isClean).toBe(false);
    expect(built.acceptedCells).toContain(cellKey("margin", "gross-margin", "amount"));
  });
});
