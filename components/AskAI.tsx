"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Brain, X, Send, Loader2 } from "lucide-react";
import { ASK_AI_OPEN_EVENT } from "@/lib/noteActions";

/**
 * AskAI â€” a global, portal-based AI tutor overlay (S1-C2).
 *
 * Salvaged pattern from the AI-CPA app: renders into document.body with a fixed
 * position so opening it causes ZERO layout shift / screen-jump. Wired to the
 * app's existing POST /api/ai/assist route (which delegates to the optional
 * professor module and falls back to local lesson search). Suggestions link
 * straight into the relevant lesson.
 */

type Suggestion = {
  type: "lesson" | "lab" | "template";
  title: string;
  description: string;
  mapping?: { monthId: string; weekId: string } | null;
  steps?: string[];
};

export default function AskAI() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Portals can only render on the client.
  useEffect(() => setMounted(true), []);

  // Other surfaces (e.g. /notes "Ask AI about this") open the overlay
  // pre-filled by dispatching the ASK_AI_OPEN_EVENT CustomEvent.
  useEffect(() => {
    const onOpen = (e: Event) => {
      const question = (e as CustomEvent<{ question?: string }>).detail?.question;
      if (typeof question === "string") setInput(question);
      setOpen(true);
    };
    window.addEventListener(ASK_AI_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(ASK_AI_OPEN_EVENT, onOpen);
  }, []);

  // Scroll-lock + focus the input + ESC-to-close while open.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function ask() {
    const q = input.trim();
    if (!q || loading) return;
    setLoading(true);
    setError(null);
    setSuggestions(null);
    try {
      const res = await fetch("/api/ai/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: q }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = await res.json();
      setSuggestions(Array.isArray(data?.suggestions) ? data.suggestions : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating trigger â€” fixed, so it never shifts page content */}
      <button
        type="button"
        aria-label="Ask the AI tutor"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-[9998] flex h-12 w-12 items-center justify-center rounded-full bg-[#2e75b6] text-white shadow-lg transition hover:bg-[#3a86cc] focus:outline-none focus:ring-2 focus:ring-[#2e75b6] focus:ring-offset-2"
      >
        <Brain className="h-6 w-6" />
      </button>

      {mounted && open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="AI tutor"
            data-askai-overlay
            className="fixed inset-0 z-[10000] flex items-start justify-end"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
            />
            {/* Panel â€” fixed top-right, does not move page content */}
            <div className="relative m-4 flex h-[min(80vh,640px)] w-[min(92vw,440px)] flex-col overflow-hidden rounded-xl bg-[#0f1923] text-slate-100 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-[#2e75b6]" />
                  <span className="font-semibold">AI Tutor</span>
                </div>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                  className="rounded p-1 text-muted-foreground hover:bg-[#1b2c3d] hover:text-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Results */}
              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm">
                {!suggestions && !loading && !error && (
                  <p className="text-muted-foreground">
                    Ask anything about the curriculum â€” e.g. <em>â€œexplain over/under billingsâ€</em> or
                    <em> â€œhow does the CD job-cost reclass work?â€</em> Iâ€™ll point you to the right lessons.
                  </p>
                )}
                {loading && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Thinkingâ€¦
                  </div>
                )}
                {error && <p className="text-red-400">{error}</p>}
                {suggestions && suggestions.length === 0 && !loading && (
                  <p className="text-muted-foreground">No matching lessons yet â€” try rephrasing.</p>
                )}
                {suggestions?.map((s, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-slate-700 bg-[#13212f] p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-medium text-[#2e75b6]">{s.title}</h3>
                      <span className="shrink-0 rounded bg-[#1b2c3d] px-2 py-0.5 text-xs text-muted-foreground">
                        {s.type}
                      </span>
                    </div>
                    <p className="mt-1 text-slate-300">{s.description}</p>
                    {s.steps && s.steps.length > 0 && (
                      <ul className="mt-2 list-disc pl-5 text-xs text-muted-foreground">
                        {s.steps.map((st, j) => (
                          <li key={j}>{st}</li>
                        ))}
                      </ul>
                    )}
                    {s.mapping && (
                      <Link
                        href={`/learn/${s.mapping.monthId}/${s.mapping.weekId}`}
                        onClick={() => setOpen(false)}
                        className="mt-2 inline-block text-xs font-medium text-[#2e75b6] hover:underline"
                      >
                        Open lesson â†’
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Composer */}
              <div className="border-t border-slate-700 p-3">
                <div className="flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        ask();
                      }
                    }}
                    placeholder="Ask a questionâ€¦"
                    className="max-h-32 flex-1 resize-none rounded bg-[#1b2c3d] px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-[#2e75b6]"
                  />
                  <button
                    type="button"
                    aria-label="Send"
                    onClick={ask}
                    disabled={loading || !input.trim()}
                    className="flex h-9 w-9 items-center justify-center rounded bg-[#2e75b6] text-white hover:bg-[#3a86cc] disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
