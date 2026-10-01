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
      {/* A circular FAB's own drop shadow is a real elevation/interaction cue
          (it signals "floats above the page"), not decorative surface
          styling — kept deliberately, unlike every panel/card shadow this
          pass has removed. The fill itself still moved off the old
          hardcoded Aurora gradient onto ink, matching every other badge
          fixed this pass. */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Scratch paper"
        title="Scratch paper"
        data-elevation="fab"
        className="fixed bottom-24 right-5 z-[60] flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition hover:-translate-y-0.5"
        style={{ background: "hsl(var(--foreground))", color: "hsl(var(--background))" }}
      >
        <PenLine className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-x-0 bottom-0 z-[70] px-3 pb-3 sm:px-5 sm:pb-5">
          <div
            className="mx-auto max-w-4xl overflow-hidden"
            style={{
              border: "1px solid hsl(var(--border))",
              borderRadius: 2,
              background: "hsl(var(--card))",
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{ borderBottom: "1px solid hsl(var(--border))" }}
            >
              <div className="flex items-center gap-2">
                <PenLine className="h-4 w-4" style={{ color: "hsl(var(--foreground))" }} />
                <span className="font-display text-sm font-semibold text-foreground">
                  Scratch paper
                </span>
                <span className="text-xs text-text-light">
                  — work it by hand (Apple Pencil ready)
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="p-1.5 text-text-muted hover:bg-accent/30"
                style={{ borderRadius: 2 }}
              >
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
