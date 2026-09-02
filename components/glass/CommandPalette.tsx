"use client";

/**
 * CommandPalette — a ⌘K / Ctrl-K launcher that jumps to any route and runs a
 * few quick actions. Fixes the "too many nav destinations" problem: one key,
 * type a few letters, Enter. Opened by ⌘K or by dispatching the "cmdk:open"
 * event (the top-strip search field does this).
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Search, CornerDownLeft, Moon, Sun, Download } from "lucide-react";
import { ALL_ROUTES } from "@/lib/navRoutes";
import { exportProgress } from "@/lib/dataTransfer";

export const CMDK_OPEN_EVENT = "cmdk:open";

interface Item {
  id: string;
  label: string;
  group: string;
  keywords?: string;
  href?: string;
  run?: () => void;
  icon?: "theme" | "export";
}

export function CommandPalette() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const doExport = useCallback(() => {
    try {
      const json = exportProgress(new Date().toISOString());
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `accountrix-progress-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      /* ignore */
    }
  }, []);

  const items = useMemo<Item[]>(() => {
    const routes: Item[] = ALL_ROUTES.map((r) => ({
      id: `r:${r.href}`,
      label: r.label,
      group: r.group,
      keywords: r.keywords,
      href: r.href,
    }));
    const actions: Item[] = [
      {
        id: "a:theme",
        label: theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
        group: "Actions",
        keywords: "dark light appearance",
        run: () => setTheme(theme === "dark" ? "light" : "dark"),
        icon: "theme",
      },
      {
        id: "a:export",
        label: "Export my progress",
        group: "Actions",
        keywords: "backup download sync save",
        run: doExport,
        icon: "export",
      },
    ];
    return [...actions, ...routes];
  }, [theme, setTheme, doExport]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) =>
      `${i.label} ${i.group} ${i.keywords ?? ""}`.toLowerCase().includes(q)
    );
  }, [items, query]);

  // Open via ⌘K / Ctrl-K or the custom event; close on Esc.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(CMDK_OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(CMDK_OPEN_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  const activate = (item: Item | undefined) => {
    if (!item) return;
    setOpen(false);
    if (item.run) item.run();
    else if (item.href) router.push(item.href);
  };

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      activate(filtered[active]);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div
        className="glass-strong relative w-full max-w-xl overflow-hidden"
        style={{ borderRadius: 18 }}
      >
        <div
          className="flex items-center gap-3 border-b px-4 py-3"
          style={{ borderColor: "hsl(var(--border) / 0.6)" }}
        >
          <Search className="h-4 w-4 text-text-light" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onListKey}
            placeholder="Jump to… (page, formula, action)"
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-text-light"
            aria-label="Command palette search"
          />
          <kbd
            className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-text-light"
            style={{ background: "hsl(var(--foreground) / 0.06)" }}
          >
            ESC
          </kbd>
        </div>
        <div className="max-h-[52vh] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-text-muted">No matches.</p>
          ) : (
            filtered.map((item, i) => (
              <button
                key={item.id}
                onClick={() => activate(item)}
                onMouseEnter={() => setActive(i)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm"
                style={i === active ? { background: "hsl(var(--primary) / 0.13)" } : undefined}
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
                  style={{
                    background: "hsl(var(--foreground) / 0.05)",
                    color: "hsl(var(--text-muted))",
                  }}
                >
                  {item.icon === "theme" ? (
                    theme === "dark" ? (
                      <Sun className="h-3.5 w-3.5" />
                    ) : (
                      <Moon className="h-3.5 w-3.5" />
                    )
                  ) : item.icon === "export" ? (
                    <Download className="h-3.5 w-3.5" />
                  ) : (
                    <CornerDownLeft className="h-3.5 w-3.5" />
                  )}
                </span>
                <span className="flex-1 truncate text-foreground">{item.label}</span>
                <span className="shrink-0 text-[11px] text-text-light">{item.group}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
