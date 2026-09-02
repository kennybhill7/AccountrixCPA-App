"use client";

import { useEffect, useState } from "react";
import { Cloud, CloudOff, Copy, Link2, RefreshCw } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { getSyncId, setSyncId, clearSync, newSyncId, push, pull, type SyncResult } from "@/lib/sync";

export function DataSync() {
  const [id, setId] = useState<string | null>(null);
  const [linkInput, setLinkInput] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [unconfigured, setUnconfigured] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => setId(getSyncId()), []);

  const report = (r: SyncResult) => {
    if (r === "unconfigured") {
      setUnconfigured(true);
      setMsg(null);
      return false;
    }
    setUnconfigured(false);
    return true;
  };

  const enable = async () => {
    setBusy(true);
    const newId = newSyncId();
    setSyncId(newId);
    setId(newId);
    const r = await push(Date.now(), true);
    if (report(r)) setMsg(r === "ok" ? "Automatic sync is on. Enter this code on your other device to link it." : "Saved locally — cloud push will retry.");
    setBusy(false);
  };

  const linkDevice = async () => {
    const code = linkInput.trim().toLowerCase();
    if (!/^[a-f0-9]{16,64}$/.test(code)) {
      setMsg("That doesn't look like a valid sync code.");
      return;
    }
    setBusy(true);
    setSyncId(code);
    setId(code);
    const r = await pull();
    if (report(r)) {
      if (r === "applied") {
        setMsg("Linked — pulling your data and reloading…");
        setTimeout(() => window.location.reload(), 900);
      } else if (r === "none") {
        setMsg("Linked, but that code has no cloud data yet. Sync from the first device, then Sync now here.");
      } else {
        setMsg("Linked and up to date.");
      }
    }
    setBusy(false);
  };

  const syncNow = async () => {
    setBusy(true);
    const p = await pull();
    if (report(p)) {
      if (p === "applied") {
        setMsg("Newer data pulled — reloading…");
        setTimeout(() => window.location.reload(), 800);
        setBusy(false);
        return;
      }
      const u = await push(Date.now(), true);
      if (report(u)) setMsg(u === "ok" ? "Synced." : "Push failed — will retry automatically.");
    }
    setBusy(false);
  };

  const turnOff = () => {
    clearSync();
    setId(null);
    setMsg("Automatic sync turned off. This device keeps its data locally.");
  };

  const copyCode = () => {
    if (id) navigator.clipboard?.writeText(id).then(() => setMsg("Sync code copied."));
  };

  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: "hsl(var(--primary) / 0.12)", color: "hsl(var(--primary))" }}>
          {id ? <Cloud className="h-5 w-5" /> : <CloudOff className="h-5 w-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-lg font-bold tracking-tight text-foreground">Automatic sync across devices</h2>
          <p className="mt-1 text-sm text-text-muted">
            Turn this on to keep your iPad and laptop in sync automatically — no downloads. Your progress uploads in the
            background and pulls the newest version when you open the app on another device.
          </p>
        </div>
      </div>

      {unconfigured && (
        <div className="mt-4 rounded-xl px-4 py-3 text-sm text-foreground" style={{ background: "hsl(var(--status-streak) / 0.1)" }}>
          <p className="font-semibold">One-time setup needed (≈2 min).</p>
          <p className="mt-1 text-text-muted">
            In your Vercel project: <strong>Storage → Create Database → KV</strong>, connect it to this project (it auto-adds the
            env vars), then redeploy. After that, automatic sync works with no downloads. Until then, use manual export/import below.
          </p>
        </div>
      )}

      {!id ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button onClick={enable} disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:opacity-50">
            <Cloud className="h-4 w-4" /> Turn on automatic sync
          </button>
          <div className="flex items-center gap-2">
            <input
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              placeholder="or paste a sync code to link"
              className="glass h-10 w-56 px-3 text-sm text-foreground outline-none placeholder:text-text-light"
              style={{ borderRadius: 12 }}
            />
            <button onClick={linkDevice} disabled={busy} className="glass glass-hover inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-foreground disabled:opacity-50" style={{ borderRadius: 12 }}>
              <Link2 className="h-4 w-4" /> Link
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-light">Your sync code</span>
            <code className="rounded-lg px-2.5 py-1 font-mono text-xs text-foreground" style={{ background: "hsl(var(--foreground) / 0.06)" }}>{id}</code>
            <button onClick={copyCode} className="text-text-muted hover:text-foreground" aria-label="Copy sync code"><Copy className="h-4 w-4" /></button>
          </div>
          <p className="text-xs text-text-muted">Enter this exact code in Settings → Automatic sync on your other device to link them.</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={syncNow} disabled={busy} className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:opacity-50">
              <RefreshCw className="h-4 w-4" /> Sync now
            </button>
            <button onClick={turnOff} className="glass glass-hover inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-text-muted" style={{ borderRadius: 12 }}>
              Turn off
            </button>
          </div>
        </div>
      )}

      {msg && <p className="mt-3 text-sm text-text-muted">{msg}</p>}
    </GlassCard>
  );
}
