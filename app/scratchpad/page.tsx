"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Scratchpad } from "@/components/glass/Scratchpad";
import { TitleBlock } from "@/components/sheet/TitleBlock";

interface PageMeta {
  id: string;
  name: string;
}
const PAGES_KEY = "scratch:notebook:pages";

function loadPages(): PageMeta[] {
  try {
    const raw = localStorage.getItem(PAGES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PageMeta[];
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch {
    /* ignore */
  }
  return [{ id: "p1", name: "Page 1" }];
}

export default function ScratchpadNotebookPage() {
  const [pages, setPages] = useState<PageMeta[]>([{ id: "p1", name: "Page 1" }]);
  const [activeId, setActiveId] = useState("p1");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const p = loadPages();
    setPages(p);
    setActiveId(p[0].id);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(PAGES_KEY, JSON.stringify(pages));
    } catch {
      /* ignore */
    }
  }, [pages, hydrated]);

  const addPage = () => {
    const id = `p${Date.now()}`;
    const next = [...pages, { id, name: `Page ${pages.length + 1}` }];
    setPages(next);
    setActiveId(id);
  };

  const deletePage = (id: string) => {
    if (pages.length <= 1) return;
    try {
      localStorage.removeItem(`scratch:notebook:${id}`);
    } catch {
      /* ignore */
    }
    const next = pages.filter((p) => p.id !== id);
    setPages(next);
    if (activeId === id) setActiveId(next[0].id);
  };

  const rename = (id: string, name: string) =>
    setPages((ps) => ps.map((p) => (p.id === id ? { ...p, name } : p)));

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <TitleBlock
        title="Notebook"
        subtitle="Handwritten pages — work problems and take notes with Apple Pencil. Saved on this device."
      />

      {/* Page tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {pages.map((p) => {
          const on = p.id === activeId;
          return (
            <button
              key={p.id}
              onClick={() => setActiveId(p.id)}
              className={
                on
                  ? "px-3 py-1.5 text-sm font-semibold"
                  : "glass glass-hover px-3 py-1.5 text-sm font-medium text-text-muted"
              }
              style={
                on
                  ? {
                      background: "hsl(var(--foreground))",
                      color: "hsl(var(--background))",
                      borderRadius: 2,
                    }
                  : undefined
              }
            >
              {p.name}
            </button>
          );
        })}
        <button
          onClick={addPage}
          className="glass glass-hover inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-text-muted"
        >
          <Plus className="h-4 w-4" /> Page
        </button>
      </div>

      {/* Active page */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <input
            value={pages.find((p) => p.id === activeId)?.name ?? ""}
            onChange={(e) => rename(activeId, e.target.value)}
            className="glass max-w-xs bg-transparent px-3 py-1.5 text-sm font-medium text-foreground outline-none"
            aria-label="Page name"
          />
          {pages.length > 1 && (
            <button
              onClick={() => deletePage(activeId)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete page
            </button>
          )}
        </div>
        {hydrated && (
          <Scratchpad
            key={activeId}
            storageKey={`scratch:notebook:${activeId}`}
            heightClass="h-[62vh]"
          />
        )}
      </div>

      <div className="p-4" style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}>
        <p className="text-xs text-text-muted">
          Tip: the floating pencil button (bottom-right) opens quick scratch paper on any screen —
          handy for working a drill without leaving the problem.
        </p>
      </div>
    </div>
  );
}
