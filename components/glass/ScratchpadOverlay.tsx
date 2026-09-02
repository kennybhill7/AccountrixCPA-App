"use client";

/**
 * Global scratch-paper overlay — a floating pencil button (bottom-right, above
 * the AI tutor) that slides up a handwriting surface on ANY page, so you can
 * work a problem by hand next to it. Persists to one "quick scratch" page.
 */

import { useEffect, useState } from "react";
import { PenLine, X } from "lucide-react";
import { Scratchpad } from "./Scratchpad";

export function ScratchpadOverlay() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Scratch paper"
        title="Scratch paper"
        className="fixed bottom-24 right-5 z-[60] flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition hover:-translate-y-0.5"
        style={{ background: "linear-gradient(135deg,#3b82f6,#7c3aed)" }}
      >
        <PenLine className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-x-0 bottom-0 z-[70] px-3 pb-3 sm:px-5 sm:pb-5">
          <div className="glass-strong mx-auto max-w-4xl overflow-hidden" style={{ borderRadius: 22 }}>
            <div className="flex items-center justify-between px-4 py-2.5">
              <div className="flex items-center gap-2">
                <PenLine className="h-4 w-4 text-primary" />
                <span className="font-display text-sm font-semibold text-foreground">Scratch paper</span>
                <span className="text-xs text-text-light">— work it by hand (Apple Pencil ready)</span>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="rounded-lg p-1.5 text-text-muted hover:bg-white/40 dark:hover:bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-3 pb-3">
              <Scratchpad storageKey="scratch:quick" heightClass="h-[52vh]" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
