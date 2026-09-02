"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Brain, X, Send, Loader2, Sparkles, RotateCcw } from "lucide-react";
import { ASK_AI_OPEN_EVENT } from "@/lib/noteActions";

/**
 * AskAI — the global streaming Claude tutor overlay ("Newt", our exam-prep AI).
 *
 * Talks to the streaming POST /api/ai/tutor route (official Anthropic SDK,
 * claude-haiku-4-5). Renders a multi-turn chat with live token streaming, so
 * answers appear immediately. If the tutor route is unconfigured (503, no
 * ANTHROPIC_API_KEY) or unreachable, it falls back to the lesson-search route
 * (/api/ai/assist) and shows linked lesson suggestions instead — the app is
 * always useful, the AI just gets better once a key is set.
 *
 * Opened by the floating trigger, or pre-filled + auto-sent by other surfaces
 * (PracticeBlock / SessionRunner / QuizComponent "Explain my mistake", /notes)
 * via openAskAI() dispatching ASK_AI_OPEN_EVENT.
 */

type Suggestion = {
  type: "lesson" | "lab" | "template";
  title: string;
  description: string;
  mapping?: { monthId: string; weekId: string } | null;
  steps?: string[];
};

type ChatMsg = {
  role: "user" | "assistant";
  content: string;
  /** lesson-search fallback attaches suggestions instead of prose */
  suggestions?: Suggestion[];
  streaming?: boolean;
};

/* --------------------------- tiny markdown render --------------------------- */
// Safe inline renderer: **bold** + `code`, no dangerouslySetInnerHTML.
function renderInline(text: string, keyBase: string) {
  const parts: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) {
      parts.push(
        <strong key={`${keyBase}-b${i}`} className="font-semibold text-foreground">
          {tok.slice(2, -2)}
        </strong>
      );
    } else {
      parts.push(
        <code
          key={`${keyBase}-c${i}`}
          className="rounded px-1 py-0.5 font-mono text-[12.5px]"
          style={{ background: "hsl(var(--foreground) / 0.07)" }}
        >
          {tok.slice(1, -1)}
        </code>
      );
    }
    last = m.index + tok.length;
    i++;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function Markdownish({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: React.ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  const flush = () => {
    if (!list) return;
    const L = list;
    blocks.push(
      L.ordered ? (
        <ol key={`l${blocks.length}`} className="my-1.5 ml-4 list-decimal space-y-1">
          {L.items.map((it, j) => (
            <li key={j}>{renderInline(it, `ol${blocks.length}-${j}`)}</li>
          ))}
        </ol>
      ) : (
        <ul key={`l${blocks.length}`} className="my-1.5 ml-4 list-disc space-y-1">
          {L.items.map((it, j) => (
            <li key={j}>{renderInline(it, `ul${blocks.length}-${j}`)}</li>
          ))}
        </ul>
      )
    );
    list = null;
  };
  lines.forEach((raw, idx) => {
    const line = raw.trimEnd();
    const ol = line.match(/^\s*\d+[.)]\s+(.*)$/);
    const ul = line.match(/^\s*[-*•]\s+(.*)$/);
    if (ol) {
      if (!list || !list.ordered) {
        flush();
        list = { ordered: true, items: [] };
      }
      list.items.push(ol[1]);
    } else if (ul) {
      if (!list || list.ordered) {
        flush();
        list = { ordered: false, items: [] };
      }
      list.items.push(ul[1]);
    } else {
      flush();
      if (line.trim() === "") return;
      blocks.push(
        <p key={`p${idx}`} className="my-1 leading-relaxed">
          {renderInline(line, `p${idx}`)}
        </p>
      );
    }
  });
  flush();
  return <div className="text-[13.5px] text-slate-100">{blocks}</div>;
}

/* --------------------------------- overlay -------------------------------- */

export default function AskAI() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<ChatMsg[]>([]);
  messagesRef.current = messages;

  useEffect(() => setMounted(true), []);

  // Auto-scroll to newest as tokens stream in.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  const setLastAssistant = useCallback((update: (m: ChatMsg) => ChatMsg) => {
    setMessages((prev) => {
      const next = [...prev];
      for (let i = next.length - 1; i >= 0; i--) {
        if (next[i].role === "assistant") {
          next[i] = update(next[i]);
          break;
        }
      }
      return next;
    });
  }, []);

  // Lesson-search fallback (the old behavior) when the tutor route is unavailable.
  const fallbackAssist = useCallback(
    async (question: string) => {
      try {
        const res = await fetch("/api/ai/assist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: question }),
        });
        const data = res.ok ? await res.json() : null;
        const suggestions: Suggestion[] = Array.isArray(data?.suggestions) ? data.suggestions : [];
        setLastAssistant((m) => ({
          ...m,
          streaming: false,
          content: suggestions.length
            ? "Here are the lessons that match — the live AI tutor turns on once an API key is set."
            : "I couldn't find a matching lesson. Try rephrasing, or set an ANTHROPIC_API_KEY to enable the full AI tutor.",
          suggestions,
        }));
      } catch {
        setLastAssistant((m) => ({
          ...m,
          streaming: false,
          content: "The tutor is offline right now. Please try again in a moment.",
        }));
      }
    },
    [setLastAssistant]
  );

  const send = useCallback(
    async (text: string) => {
      const q = text.trim();
      if (!q || busy) return;
      setBusy(true);
      setInput("");
      // Build the payload from history + this turn, then show it optimistically.
      const history = messagesRef.current
        .filter((m) => !m.suggestions) // don't send fallback stubs upstream
        .map((m) => ({ role: m.role, content: m.content }));
      const payload = [...history, { role: "user" as const, content: q }];
      setMessages((prev) => [
        ...prev,
        { role: "user", content: q },
        { role: "assistant", content: "", streaming: true },
      ]);

      try {
        const res = await fetch("/api/ai/tutor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: payload }),
        });

        if (!res.ok || !res.body) {
          await fallbackAssist(q);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setLastAssistant((m) => ({ ...m, content: acc, streaming: true }));
        }
        setLastAssistant((m) => ({ ...m, content: acc || m.content, streaming: false }));
      } catch {
        await fallbackAssist(q);
      } finally {
        setBusy(false);
      }
    },
    [busy, fallbackAssist, setLastAssistant]
  );

  // openAskAI() dispatches this; a question means "explain this now" → auto-send.
  useEffect(() => {
    const onOpen = (e: Event) => {
      const question = (e as CustomEvent<{ question?: string }>).detail?.question;
      setOpen(true);
      if (typeof question === "string" && question.trim()) {
        // let the panel mount before streaming
        setTimeout(() => send(question), 0);
      }
    };
    window.addEventListener(ASK_AI_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(ASK_AI_OPEN_EVENT, onOpen);
  }, [send]);

  // Scroll-lock + focus + ESC while open.
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

  return (
    <>
      <button
        type="button"
        aria-label="Ask the AI tutor"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-[9998] flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{ background: "linear-gradient(135deg, #3b82f6, #7c3aed)" }}
      >
        <Brain className="h-6 w-6" />
      </button>

      {mounted &&
        open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="AI tutor"
            data-askai-overlay
            className="fixed inset-0 z-[10000] flex items-start justify-end"
          >
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <div className="relative m-4 flex h-[min(84vh,680px)] w-[min(94vw,460px)] flex-col overflow-hidden rounded-2xl bg-[#0f172a] text-slate-100 shadow-2xl ring-1 ring-white/10">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-white"
                    style={{ background: "linear-gradient(135deg, #3b82f6, #7c3aed)" }}
                  >
                    <Brain className="h-4 w-4" />
                  </span>
                  <div className="leading-tight">
                    <div className="text-sm font-semibold">AI Tutor</div>
                    <div className="text-[11px] text-slate-400">
                      Explain anything · powered by Claude
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {messages.length > 0 && (
                    <button
                      type="button"
                      aria-label="New conversation"
                      title="New conversation"
                      onClick={() => setMessages([])}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-slate-100"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={() => setOpen(false)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-slate-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Transcript */}
              <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm">
                {messages.length === 0 && (
                  <div className="space-y-3 text-slate-300">
                    <p className="leading-relaxed">
                      Ask me anything on finance or accounting — I&apos;ll explain it, work an
                      example, and give you a rule to remember.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Explain over/under billings",
                        "How does WACC work?",
                        "Percentage-of-completion, step by step",
                      ].map((s) => (
                        <button
                          key={s}
                          onClick={() => send(s)}
                          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((m, i) =>
                  m.role === "user" ? (
                    <div key={i} className="flex justify-end">
                      <div
                        className="max-w-[85%] rounded-2xl px-3.5 py-2 text-[13.5px] text-white"
                        style={{ background: "linear-gradient(135deg, #3b82f6, #7c3aed)" }}
                      >
                        {m.content}
                      </div>
                    </div>
                  ) : (
                    <div key={i} className="flex justify-start">
                      <div className="max-w-[92%] rounded-2xl bg-white/[0.06] px-3.5 py-2.5">
                        {m.content ? (
                          <Markdownish text={m.content} />
                        ) : m.streaming ? (
                          <div className="flex items-center gap-2 text-slate-400">
                            <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
                          </div>
                        ) : null}
                        {m.streaming && m.content && (
                          <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-slate-400 align-middle" />
                        )}
                        {m.suggestions && m.suggestions.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {m.suggestions.map((s, j) => (
                              <div
                                key={j}
                                className="rounded-lg border border-white/10 bg-white/[0.04] p-2.5"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <h4 className="text-[13px] font-semibold text-blue-300">
                                    {s.title}
                                  </h4>
                                  <span className="shrink-0 rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-400">
                                    {s.type}
                                  </span>
                                </div>
                                <p className="mt-1 text-xs text-slate-300">{s.description}</p>
                                {s.mapping && (
                                  <Link
                                    href={`/learn/${s.mapping.monthId}/${s.mapping.weekId}`}
                                    onClick={() => setOpen(false)}
                                    className="mt-1.5 inline-block text-xs font-medium text-blue-300 hover:underline"
                                  >
                                    Open lesson →
                                  </Link>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Composer */}
              <div className="border-t border-white/10 p-3">
                <div className="flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send(input);
                      }
                    }}
                    placeholder="Ask a question…"
                    className="max-h-32 flex-1 resize-none rounded-xl bg-white/[0.06] px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    aria-label="Send"
                    onClick={() => send(input)}
                    disabled={busy || !input.trim()}
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-white transition hover:opacity-90 disabled:opacity-40"
                    style={{ background: "linear-gradient(135deg, #3b82f6, #7c3aed)" }}
                  >
                    {busy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="mt-1.5 flex items-center gap-1 px-1 text-[10px] text-slate-500">
                  <Sparkles className="h-3 w-3" /> Explanations can be imperfect — verify against
                  the lesson.
                </p>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
