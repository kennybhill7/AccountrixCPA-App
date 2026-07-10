/**
 * Cross-device progress transfer. All app state lives in this browser's
 * localStorage (per-device — it does NOT sync across your iPad and laptop on
 * its own). Export bundles every key into a JSON file you can move to another
 * device and import there.
 */

const APP_TAG = "accountrix-progress";

export function exportProgress(nowIso: string): string {
  const data: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k) data[k] = localStorage.getItem(k) ?? "";
  }
  return JSON.stringify({ app: APP_TAG, version: 1, exportedAt: nowIso, keys: Object.keys(data).length, data }, null, 2);
}

/** Writes imported keys into localStorage. Returns the number of keys restored. */
export function importProgress(json: string): number {
  const parsed = JSON.parse(json) as unknown;
  const bag =
    parsed && typeof parsed === "object" && "data" in (parsed as Record<string, unknown>)
      ? (parsed as { data: Record<string, unknown> }).data
      : (parsed as Record<string, unknown>);
  if (!bag || typeof bag !== "object") throw new Error("Not a valid Accountrix export file.");
  let n = 0;
  for (const [k, v] of Object.entries(bag)) {
    if (typeof v === "string") {
      localStorage.setItem(k, v);
      n++;
    }
  }
  return n;
}
