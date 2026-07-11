/**
 * Cross-device sync (client). Pushes a snapshot of localStorage to /api/sync
 * (Vercel KV) keyed by a random sync id, and pulls newer snapshots on other
 * devices. Whole-snapshot last-write-wins — fine for one person across two
 * devices. Requires KV to be configured server-side; degrades to "unconfigured"
 * cleanly so the app never breaks.
 */

export type SyncResult = "ok" | "applied" | "uptodate" | "nochange" | "none" | "unconfigured" | "error";

const ID_KEY = "sync:id";
const LAST_SIG = "sync:lastSig";
const APPLIED_AT = "sync:appliedAt";
// Bookkeeping keys are never synced.
const SKIP = new Set([ID_KEY, LAST_SIG, APPLIED_AT]);

export function getSyncId(): string | null {
  try { return localStorage.getItem(ID_KEY); } catch { return null; }
}
export function setSyncId(id: string): void {
  try { localStorage.setItem(ID_KEY, id); } catch { /* ignore */ }
}
export function clearSync(): void {
  try {
    localStorage.removeItem(ID_KEY);
    localStorage.removeItem(LAST_SIG);
    localStorage.removeItem(APPLIED_AT);
  } catch { /* ignore */ }
}
export function newSyncId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function snapshot(): Record<string, string> {
  const data: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && !SKIP.has(k)) data[k] = localStorage.getItem(k) ?? "";
  }
  return data;
}
function sig(s: Record<string, string>): string {
  return `${Object.keys(s).length}:${JSON.stringify(s).length}`;
}

/** Push local state to the cloud. `force` ignores the "unchanged" short-circuit. */
export async function push(nowMs: number, force = false): Promise<SyncResult> {
  const id = getSyncId();
  if (!id) return "error";
  const data = snapshot();
  const s = sig(data);
  try {
    if (!force && localStorage.getItem(LAST_SIG) === s) return "nochange";
  } catch { /* ignore */ }
  try {
    const res = await fetch(`/api/sync?id=${id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ updatedAt: nowMs, data }),
    });
    if (res.status === 503) return "unconfigured";
    if (!res.ok) return "error";
    try {
      localStorage.setItem(LAST_SIG, s);
      localStorage.setItem(APPLIED_AT, String(nowMs));
    } catch { /* ignore */ }
    return "ok";
  } catch {
    return "error";
  }
}

/** Pull cloud state. Applies + returns "applied" only if the remote is newer. */
export async function pull(): Promise<SyncResult> {
  const id = getSyncId();
  if (!id) return "error";
  try {
    const res = await fetch(`/api/sync?id=${id}`, { cache: "no-store" });
    if (res.status === 503) return "unconfigured";
    if (res.status === 404) return "none";
    if (!res.ok) return "error";
    const remote = (await res.json()) as { updatedAt: number; data: Record<string, string> };
    const applied = Number(localStorage.getItem(APPLIED_AT) || 0);
    if (!remote || typeof remote.updatedAt !== "number" || remote.updatedAt <= applied) return "uptodate";
    for (const [k, v] of Object.entries(remote.data)) {
      if (typeof v === "string" && !SKIP.has(k)) localStorage.setItem(k, v);
    }
    localStorage.setItem(APPLIED_AT, String(remote.updatedAt));
    localStorage.setItem(LAST_SIG, sig(snapshot()));
    return "applied";
  } catch {
    return "error";
  }
}
