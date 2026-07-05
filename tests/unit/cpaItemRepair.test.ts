import { describe, expect, it } from "vitest";
import { isRepaired, repairItem, type RawItem } from "@/scripts/cpa-item-repair";

const leaseItem = (overrides: Partial<RawItem> = {}): RawItem => ({
  id: "FAR-MCQ-LEAS-0001",
  stem: "Lessee enters 5-year lease, annual payments $25000, IBR 6%, no initial costs. Calculate initial lease liability.",
  options: [
    { text: "${pv_calculated * 1.06}", key: false },
    { text: "${payment * term}", key: false },
    { text: "${payment * (term - 1)}", key: false },
    { text: "$105,309", key: true },
  ],
  ...overrides,
});

describe("repairItem — leases family (rendered-correct self-check)", () => {
  it("repairs and reproduces the authored PV to the dollar", () => {
    const r = repairItem(leaseItem());
    expect(isRepaired(r)).toBe(true);
    if (!isRepaired(r)) return;
    expect(r.choices).toContain("$105,309"); // correct: PV(25,000, 6%, 5)
    expect(r.choices).toContain("$125,000"); // payment × term
    expect(r.choices).toContain("$100,000"); // payment × (term − 1)
    expect(r.choices).toContain("$111,628"); // annuity-due error (PV × 1.06)
    expect(r.choices[r.answer]).toBe("$105,309");
  });

  it("rejects the item when the rendered correct answer contradicts the formula", () => {
    const tampered = leaseItem();
    tampered.options[3] = { text: "$999,999", key: true };
    const r = repairItem(tampered);
    expect(isRepaired(r)).toBe(false);
    if (!isRepaired(r)) expect(r.reason).toBe("anchor-mismatch");
  });

  it("formats stem dollar amounts with thousands separators", () => {
    const r = repairItem(leaseItem());
    if (!isRepaired(r)) throw new Error("expected repair");
    expect(r.stem).toContain("$25,000");
  });

  it("shuffles deterministically — same input, same output", () => {
    const a = repairItem(leaseItem());
    const b = repairItem(leaseItem());
    if (!isRepaired(a) || !isRepaired(b)) throw new Error("expected repair");
    expect(a.choices).toEqual(b.choices);
    expect(a.answer).toBe(b.answer);
  });
});

describe("repairItem — remaining families", () => {
  it("allocates ASC 606 transaction price by relative SSP", () => {
    const r = repairItem({
      id: "FAR-MCQ-REVE-0163",
      stem: "Contract price $500000, standalone selling prices: Product $300000, Service $150000, Warranty $10000. Allocate transaction price to Product.",
      options: [
        { text: "${allocated_prod}", key: true },
        { text: "${allocated_prod * 1.1}", key: false },
        { text: "${total * 0.5}", key: false },
        { text: "$300000", key: false },
      ],
    });
    if (!isRepaired(r)) throw new Error("expected repair");
    expect(r.choices[r.answer]).toBe("$326,087"); // 500,000 × 300/460
  });

  it("computes NCI share of subsidiary NI", () => {
    const r = repairItem({
      id: "FAR-MCQ-CONS-0325",
      stem: "Parent owns 70% of Sub. Sub reports NI $250000, dividends $50000. Calculate non-controlling interest in NI.",
      options: [
        { text: "0", key: false },
        { text: "${div * (100 - pct) / 100}", key: false },
        { text: "$250000", key: false },
        { text: "${nci_ni}", key: true },
      ],
    });
    if (!isRepaired(r)) throw new Error("expected repair");
    expect(r.choices[r.answer]).toBe("$75,000"); // 250,000 × 30%
  });

  it("computes ASC 805 goodwill as price minus FV of net assets", () => {
    const r = repairItem({
      id: "BAR-MCQ-BUSI-0001",
      stem: "Acquirer purchases 100% of Target for $25000000. Target's book value $3000000, FV of identifiable net assets $20000000. Calculate goodwill.",
      options: [
        { text: "${price - bv}", key: false },
        { text: "${goodwill}", key: true },
        { text: "0", key: false },
        { text: "$25000000", key: false },
      ],
    });
    if (!isRepaired(r)) throw new Error("expected repair");
    expect(r.choices[r.answer]).toBe("$5,000,000");
    expect(r.choices).toContain("$22,000,000"); // price − BV error
  });

  it("computes AGI with the half-SE-tax deduction and appends the assumption note", () => {
    const r = repairItem({
      id: "REG-MCQ-INDI-0001",
      stem: "Taxpayer: Wages $100000, SE income $50000, IRA contribution $5000, student loan interest $2500. Calculate AGI.",
      options: [
        { text: "$100000", key: false },
        { text: "${wages + se_income}", key: false },
        { text: "${agi_calc}", key: true },
        { text: "${agi_calc + ira + sli}", key: false },
      ],
    });
    if (!isRepaired(r)) throw new Error("expected repair");
    // 100,000 + 50,000 − (50,000 × .9235 × .153 / 2 = 3,532) − 5,000 − 2,500
    expect(r.choices[r.answer]).toBe("$138,968");
    expect(r.stem).toContain("Assume no phaseout");
  });

  it("computes corp TI before DRD/charity as GI + dividends − expenses", () => {
    const r = repairItem({
      id: "REG-MCQ-ENTI-0167",
      stem: "C-Corp: Gross income $1000000, deductible expenses $600000, dividends received $500000 from 80%-owned corp, charitable contribution $30000. Calculate TI before DRD and charity.",
      options: [
        { text: "${gi - exp}", key: false },
        { text: "$1000000", key: false },
        { text: "${gi - exp - div}", key: false },
        { text: "${ti_before}", key: true },
      ],
    });
    if (!isRepaired(r)) throw new Error("expected repair");
    expect(r.choices[r.answer]).toBe("$900,000");
    expect(r.choices).toContain("-$100,000"); // gi − exp − div, negative formatting
  });
});

describe("repairItem — rejection paths", () => {
  it("rejects unknown template families", () => {
    const r = repairItem({
      id: "X-1",
      stem: "Some stem $1000.",
      options: [
        { text: "${mystery_var}", key: true },
        { text: "$1", key: false },
        { text: "$2", key: false },
        { text: "$3", key: false },
      ],
    });
    expect(isRepaired(r)).toBe(false);
    if (!isRepaired(r)) expect(r.reason).toBe("unknown-family");
  });

  it("rejects stems that do not match the family pattern exactly", () => {
    const r = repairItem(
      leaseItem({ stem: "Lessee enters a lease with unusual wording. Calculate liability." })
    );
    expect(isRepaired(r)).toBe(false);
    if (!isRepaired(r)) expect(r.reason).toBe("stem-mismatch");
  });

  it("rejects items whose computed values collide after rounding", () => {
    // 1-year lease: payment × term = 50,000 collides with... PV(50,000,6%,1)=47,170;
    // payment × (term−1) = $0 vs nothing else — construct a genuine collision:
    // term=1 → payment*(term-1)=0; no other zero, so use CONS with div=ni:
    const r = repairItem({
      id: "FAR-MCQ-CONS-X",
      stem: "Parent owns 70% of Sub. Sub reports NI $50000, dividends $50000. Calculate non-controlling interest in NI.",
      options: [
        { text: "0", key: false },
        { text: "${div * (100 - pct) / 100}", key: false }, // 15,000 — collides with nci_ni
        { text: "$50000", key: false },
        { text: "${nci_ni}", key: true }, // 15,000
      ],
    });
    expect(isRepaired(r)).toBe(false);
    if (!isRepaired(r)) expect(r.reason).toBe("duplicate-values");
  });

  it("rejects items without exactly one correct key", () => {
    const bad = leaseItem();
    bad.options[0] = { text: "${pv_calculated * 1.06}", key: true };
    const r = repairItem(bad);
    expect(isRepaired(r)).toBe(false);
    if (!isRepaired(r)) expect(r.reason).toBe("bad-options");
  });
});
