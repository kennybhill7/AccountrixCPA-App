"use client";

import { useRef, useState } from "react";
import { Download, Upload, Smartphone } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { exportProgress, importProgress } from "@/lib/dataTransfer";

export function DataTransfer() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const doExport = () => {
    try {
      const json = exportProgress(new Date().toISOString());
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const stamp = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `accountrix-progress-${stamp}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMsg("Exported. Move this file to your other device and import it there.");
    } catch {
      setMsg("Export failed — your browser may be blocking downloads.");
    }
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const n = importProgress(text);
      setMsg(`Imported ${n} items. Reloading…`);
      setTimeout(() => window.location.reload(), 900);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Import failed.");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: "hsl(var(--primary) / 0.12)", color: "hsl(var(--primary))" }}>
          <Smartphone className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-lg font-bold tracking-tight text-foreground">Move progress between devices</h2>
          <p className="mt-1 text-sm text-text-muted">
            Your data is stored on <strong>this device only</strong> — it doesn&apos;t sync between your iPad and laptop automatically.
            Export a file here, move it over (AirDrop, email, iCloud Drive), and import it on the other device.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button onClick={doExport} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover">
          <Download className="h-4 w-4" /> Export my progress
        </button>
        <button onClick={() => fileRef.current?.click()} className="glass glass-hover inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-foreground" style={{ borderRadius: 12 }}>
          <Upload className="h-4 w-4" /> Import a file
        </button>
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={onFile} />
      </div>
      {msg && <p className="mt-3 text-sm text-text-muted">{msg}</p>}
    </GlassCard>
  );
}
