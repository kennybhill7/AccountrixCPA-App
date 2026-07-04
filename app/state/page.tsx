"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const EXPORT_VERSION = 2;
/** Snapshot of pre-import values, written before an import overwrites anything. */
const BACKUP_KEY = "state-import-backup";

// Every exact-match localStorage key the app persists (zustand stores + feature
// keys). Keep in sync with lib/store.ts `name:` fields and component keys.
const STATIC_KEYS = [
  "user-progress",
  "quiz-results",
  "lesson-notes",
  "smart-notes",
  "cpa-progress",
  "finance-progress",
  "attempt-ledger",
  "srs-queue",
  "apply-attempt-ledger",
  "learningMode",
  "grade-target-inputs",
  "parametric-drill-seed",
  "ai-intake",
  "recent-searches",
  "aia-applications",
];

// Dynamic key families — enumerated from localStorage by prefix at export time.
const KEY_PREFIXES = ["quiz-progress-", "plan-done-", "plan-due-"];

function isKnownKey(key: string): boolean {
  return STATIC_KEYS.includes(key) || KEY_PREFIXES.some((p) => key.startsWith(p));
}

/** All known keys currently present in localStorage (static + prefix families). */
function enumerateStateKeys(): string[] {
  const keys = new Set<string>();
  STATIC_KEYS.forEach((k) => {
    if (localStorage.getItem(k) !== null) keys.add(k);
  });
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && KEY_PREFIXES.some((p) => k.startsWith(p))) keys.add(k);
  }
  return Array.from(keys).sort();
}

export default function StatePage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [dryRun, setDryRun] = useState(true);

  function exportState() {
    const data: Record<string, unknown> = {};
    enumerateStateKeys().forEach((k) => {
      const raw = localStorage.getItem(k);
      if (raw === null) return;
      try {
        data[k] = JSON.parse(raw);
      } catch {
        // Raw-string keys (e.g. "learningMode") are stored unencoded.
        data[k] = raw;
      }
    });
    const out = {
      version: EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      data,
    };
    const blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "accountrix-state.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setStatus(`Exported ${Object.keys(data).length} key(s) (format v${EXPORT_VERSION}).`);
  }

  function importState(evt: React.ChangeEvent<HTMLInputElement>) {
    const file = evt.target.files?.[0];
    // Reset so selecting the same file again re-triggers onChange.
    evt.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed: unknown = JSON.parse(String(reader.result));
        if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
          setStatus("Import failed: file is not a state backup object.");
          return;
        }
        // v2 exports wrap keys in `data`; legacy (v1) exports are a flat key map.
        const obj = parsed as Record<string, unknown>;
        const entries =
          obj.data !== null && typeof obj.data === "object" && !Array.isArray(obj.data)
            ? (obj.data as Record<string, unknown>)
            : obj;

        const allKeys = Object.keys(entries).filter(
          // Meta fields on a legacy flat map are not state keys.
          (k) => !(entries === obj && (k === "version" || k === "exportedAt"))
        );
        const knownKeys = allKeys.filter(isKnownKey);
        const skipped = allKeys.length - knownKeys.length;

        if (dryRun) {
          setStatus(
            `Dry run: ${knownKeys.length} known key(s) would import, ${skipped} unknown key(s) would be skipped. Turn off dry run to apply.`
          );
          return;
        }

        // Snapshot current values of the keys about to be overwritten so a bad
        // import is recoverable from the "state-import-backup" key.
        const backupValues: Record<string, string | null> = {};
        knownKeys.forEach((k) => {
          backupValues[k] = localStorage.getItem(k);
        });
        try {
          localStorage.setItem(
            BACKUP_KEY,
            JSON.stringify({ savedAt: new Date().toISOString(), values: backupValues })
          );
        } catch {
          // Backup is best-effort (quota); proceed with the import regardless.
        }

        let imported = 0;
        let failed = 0;
        knownKeys.forEach((k) => {
          try {
            const v = entries[k];
            localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v));
            imported++;
          } catch {
            failed++;
          }
        });

        setStatus(
          `Imported ${imported} key(s), skipped ${skipped} unknown` +
            (failed > 0 ? `, ${failed} failed` : "") +
            `. Previous values saved under "${BACKUP_KEY}". Reload to apply.`
        );
      } catch (e) {
        setStatus(`Import failed: ${e instanceof Error ? e.message : String(e)}`);
      }
    };
    reader.readAsText(file);
  }

  function restorePreviousBackup() {
    try {
      const raw = localStorage.getItem(BACKUP_KEY);
      if (!raw) {
        setStatus(`No previous import backup found under "${BACKUP_KEY}".`);
        return;
      }
      const parsed = JSON.parse(raw) as { values?: Record<string, string | null>; savedAt?: string };
      const values = parsed.values ?? {};
      let restored = 0;
      Object.entries(values).forEach(([key, value]) => {
        if (!isKnownKey(key)) return;
        if (value === null) localStorage.removeItem(key);
        else localStorage.setItem(key, value);
        restored++;
      });
      setStatus(
        `Restored ${restored} key(s) from previous import backup${
          parsed.savedAt ? ` saved ${new Date(parsed.savedAt).toLocaleString()}` : ""
        }. Reload to apply.`
      );
    } catch (e) {
      setStatus(`Restore failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Export / Import State</CardTitle>
          <CardDescription>
            Backup or restore your progress and notes locally. Covers progress (CMA, CPA,
            Finance), quiz results, attempt ledger, SRS queue, notes, and settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3 items-center">
            <Button onClick={exportState} className="btn-primary">
              Export JSON
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={importState}
            />
            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              Import JSON
            </Button>
            <Button variant="outline" onClick={restorePreviousBackup}>
              Restore Previous Import Backup
            </Button>
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={dryRun}
              onChange={(event) => setDryRun(event.target.checked)}
            />
            Dry-run import first
          </label>
          {status && <p className="text-sm text-muted-foreground">{status}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
