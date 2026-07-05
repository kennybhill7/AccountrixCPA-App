import { describe, expect, it } from "vitest";
import { safeId } from "@/lib/safeId";

describe("safeId — path-traversal guard", () => {
  it("accepts normal ids", () => {
    expect(safeId("demo-user")).toBe("demo-user");
    expect(safeId("session-1720200000000")).toBe("session-1720200000000");
    expect(safeId("far_u1.v2")).toBe("far_u1.v2");
  });

  it("rejects traversal and separators", () => {
    expect(safeId("../../etc/passwd")).toBeNull();
    expect(safeId("..")).toBeNull();
    expect(safeId("a/b")).toBeNull();
    expect(safeId("a\\b")).toBeNull();
    expect(safeId("foo/../bar")).toBeNull();
  });

  it("rejects leading dot, empty, and overlong", () => {
    expect(safeId(".hidden")).toBeNull();
    expect(safeId("")).toBeNull();
    expect(safeId("   ")).toBeNull();
    expect(safeId("a".repeat(129))).toBeNull();
  });

  it("rejects non-strings", () => {
    expect(safeId(null)).toBeNull();
    expect(safeId(undefined)).toBeNull();
    expect(safeId(42)).toBeNull();
    expect(safeId({})).toBeNull();
  });
});
