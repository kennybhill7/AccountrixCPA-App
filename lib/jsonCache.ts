/**
 * mtime-keyed JSON read cache for the curriculum/item loaders.
 *
 * The curricula and item bank are large (curriculum.json ~700 KB,
 * cpa/items.json ~1.7 MB) and were re-read + re-parsed on every request. This
 * memoizes the parsed value per file, keyed by the file's modification time, so
 * repeated requests reuse the parse while content edits during authoring (which
 * bump mtime) still invalidate correctly.
 *
 * IMPORTANT: callers must treat the returned object as read-only — it is shared
 * across requests. Consumers that mutate must clone first (see
 * getMergedCurriculum, which deep-clones before applying overlays).
 */

import fs from "fs/promises";

interface Entry {
  mtimeMs: number;
  value: unknown;
}

const cache = new Map<string, Entry>();

export async function readJsonCached<T>(filePath: string): Promise<T> {
  const stat = await fs.stat(filePath);
  const cached = cache.get(filePath);
  if (cached && cached.mtimeMs === stat.mtimeMs) {
    return cached.value as T;
  }
  const raw = await fs.readFile(filePath, "utf-8");
  const value = JSON.parse(raw);
  cache.set(filePath, { mtimeMs: stat.mtimeMs, value });
  return value as T;
}

/** Test/maintenance helper — drop the whole cache. */
export function clearJsonCache(): void {
  cache.clear();
}

/** Exposed for tests: number of cached files. */
export function jsonCacheSize(): number {
  return cache.size;
}
