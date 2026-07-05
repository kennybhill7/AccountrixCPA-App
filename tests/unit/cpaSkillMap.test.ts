import { describe, expect, it } from "vitest";
import { skillForCpaItem, skillsForCpaItem } from "@/lib/cpaSkillMap";

describe("skillForCpaItem — ISC", () => {
  it("maps SOC topics to soc-engagements", () => {
    expect(skillForCpaItem("ISC", "SOC Report Types")).toBe("soc-engagements");
    expect(skillForCpaItem("ISC", "Type 1 vs. Type 2")).toBe("soc-engagements");
    expect(skillForCpaItem("ISC", "Complementary User-Entity Controls")).toBe("soc-engagements");
  });

  it("maps cybersecurity and resilience topics to security-privacy", () => {
    expect(skillForCpaItem("ISC", "Social Engineering / BEC")).toBe("security-privacy");
    expect(skillForCpaItem("ISC", "Encryption & Key Management")).toBe("security-privacy");
    expect(skillForCpaItem("ISC", "BCP vs. DRP")).toBe("security-privacy");
    expect(skillForCpaItem("ISC", "RPO Analysis")).toBe("security-privacy");
  });

  it("maps data topics to data-analytics", () => {
    expect(skillForCpaItem("ISC", "ETL Controls")).toBe("data-analytics");
    expect(skillForCpaItem("ISC", "Relational Databases & Integrity")).toBe("data-analytics");
  });

  it("maps governance and control topics", () => {
    expect(skillForCpaItem("ISC", "Third-Party & Outsourcing Governance")).toBe("it-governance");
    expect(skillForCpaItem("ISC", "Authentication")).toBe("internal-controls");
    expect(skillForCpaItem("ISC", "Change Management")).toBe("internal-controls");
  });
});

describe("skillForCpaItem — TCP", () => {
  it("maps wealth-transfer topics to gift-estate-tax", () => {
    expect(skillForCpaItem("TCP", "Portability (DSUE)")).toBe("gift-estate-tax");
    expect(skillForCpaItem("TCP", "Gift Splitting")).toBe("gift-estate-tax");
  });

  it("maps entity topics to entity-taxation", () => {
    expect(skillForCpaItem("TCP", "S Corporation Basis Ordering")).toBe("entity-taxation");
    expect(skillForCpaItem("TCP", "Qualified Small Business Stock (§1202)")).toBe("entity-taxation");
  });

  it("maps property topics to property-transactions", () => {
    expect(skillForCpaItem("TCP", "Like-Kind Exchange — Recognized Gain")).toBe("property-transactions");
    expect(skillForCpaItem("TCP", "Section 1245 Depreciation Recapture")).toBe("property-transactions");
    expect(skillForCpaItem("TCP", "Wash Sales")).toBe("property-transactions");
  });

  it("maps procedure topics to tax-procedures-ethics", () => {
    expect(skillForCpaItem("TCP", "Failure-to-File and Failure-to-Pay Penalties")).toBe(
      "tax-procedures-ethics"
    );
    expect(skillForCpaItem("TCP", "Statute of Limitations on Assessment")).toBe(
      "tax-procedures-ethics"
    );
  });

  it("defaults individual planning topics to tax-planning", () => {
    expect(skillForCpaItem("TCP", "SALT Phasedown Computation")).toBe("tax-planning");
    expect(skillForCpaItem("TCP", "Roth Conversion")).toBe("tax-planning");
  });
});

describe("skillForCpaItem — core sections and fallbacks", () => {
  it("maps topic-bearing core items", () => {
    expect(skillForCpaItem("FAR", "Government (GASB)")).toBe("governmental-accounting");
    expect(skillForCpaItem("AUD", "Sampling")).toBe("audit-sampling");
    expect(skillForCpaItem("AUD", "Ethics")).toBe("professional-ethics");
    expect(skillForCpaItem("REG", "Business Law - Contracts")).toBe("business-law");
    expect(skillForCpaItem("BAR", "Financial Ratios")).toBe("ratio-analysis");
    expect(skillForCpaItem("BAR", "Foreign Currency (ASC 830)")).toBe("hedge-accounting");
    expect(skillForCpaItem("BAR", "Business Combinations (ASC 805)")).toBe("consolidations");
  });

  it("falls back to the section default when the item has no topic", () => {
    expect(skillForCpaItem("FAR", "")).toBe("conceptual-framework");
    expect(skillForCpaItem("AUD", undefined)).toBe("audit-evidence");
    expect(skillForCpaItem("REG", null)).toBe("individual-taxation");
    expect(skillForCpaItem("BAR", "")).toBe("financial-analysis");
    expect(skillForCpaItem("ISC", "")).toBe("it-governance");
    expect(skillForCpaItem("TCP", "")).toBe("tax-planning");
  });

  it("is case-insensitive on section and never returns an empty array", () => {
    expect(skillsForCpaItem("tcp", "Roth Conversion")).toEqual(["tax-planning"]);
    expect(skillsForCpaItem("unknown", "anything")).toEqual(["conceptual-framework"]);
  });
});
