import { afterEach, describe, expect, it } from "vitest";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { readJsonCached, clearJsonCache, jsonCacheSize } from "@/lib/jsonCache";

const tmp = path.join(os.tmpdir(), `jsoncache-${process.pid}.json`);

afterEach(async () => {
  clearJsonCache();
  await fs.rm(tmp, { force: true });
});

describe("readJsonCached", () => {
  it("returns the parsed JSON and caches it", async () => {
    await fs.writeFile(tmp, JSON.stringify({ a: 1 }), "utf-8");
    const first = await readJsonCached<{ a: number }>(tmp);
    expect(first.a).toBe(1);
    expect(jsonCacheSize()).toBe(1);
    // second read hits cache (same reference)
    const second = await readJsonCached<{ a: number }>(tmp);
    expect(second).toBe(first);
  });

  it("invalidates when the file mtime changes (content authoring)", async () => {
    await fs.writeFile(tmp, JSON.stringify({ v: "old" }), "utf-8");
    const a = await readJsonCached<{ v: string }>(tmp);
    expect(a.v).toBe("old");

    // Rewrite with a bumped mtime.
    await fs.writeFile(tmp, JSON.stringify({ v: "new" }), "utf-8");
    const future = new Date(Date.now() + 5000);
    await fs.utimes(tmp, future, future);

    const b = await readJsonCached<{ v: string }>(tmp);
    expect(b.v).toBe("new");
    expect(b).not.toBe(a);
  });

  it("clearJsonCache empties the cache", async () => {
    await fs.writeFile(tmp, JSON.stringify({}), "utf-8");
    await readJsonCached(tmp);
    expect(jsonCacheSize()).toBe(1);
    clearJsonCache();
    expect(jsonCacheSize()).toBe(0);
  });
});
