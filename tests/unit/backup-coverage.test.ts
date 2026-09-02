import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";

/**
 * Guard against a real data-loss path flagged in the deep audit: the /state
 * backup allowlist (STATIC_KEYS) is maintained by hand, so a newly-added
 * persisted zustand store that is forgotten there would silently be excluded
 * from export/import. This test fails if any persisted store `name:` is not in
 * the allowlist.
 */

const root = process.cwd();

function readSource(rel: string): string {
  return fs.readFileSync(path.join(root, rel), "utf-8");
}

/** All zustand persist store names across the store modules. */
function persistedStoreNames(): string[] {
  const sources = [readSource("lib/store.ts"), readSource("lib/readinessHistory.ts")];
  const names = new Set<string>();
  for (const src of sources) {
    // match `name: "xxx"` that appears inside a persist(...) config
    for (const m of src.matchAll(/name:\s*"([a-z0-9-]+)"/g)) names.add(m[1]);
  }
  return [...names];
}

function staticBackupKeys(): string[] {
  const src = readSource("app/state/page.tsx");
  const block = src.match(/const STATIC_KEYS\s*=\s*\[([\s\S]*?)\]/);
  if (!block) throw new Error("STATIC_KEYS not found in app/state/page.tsx");
  return [...block[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

describe("state backup coverage", () => {
  it("every persisted store name is in the /state backup allowlist", () => {
    const stores = persistedStoreNames();
    const allowlist = new Set(staticBackupKeys());
    expect(stores.length).toBeGreaterThan(0);
    const missing = stores.filter((name) => !allowlist.has(name));
    expect(missing, `stores missing from STATIC_KEYS: ${missing.join(", ")}`).toEqual([]);
  });
});
