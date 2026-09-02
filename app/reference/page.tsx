"use client";

import { useMemo, useState } from "react";
import { BookMarked } from "lucide-react";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/glass/GlassCard";
import { filterFormulas, countEntries, type FormulaGroup } from "@/lib/reference";
import catalog from "@/data/reference/formulas.json";

/**
 * /reference — a searchable formula & rules quick-sheet. Static catalog in
 * data/reference/formulas.json, filtered client-side by the tested pure helper.
 */
const GROUPS = catalog.groups as FormulaGroup[];

export default function ReferencePage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => filterFormulas(GROUPS, q), [q]);
  const total = countEntries(filtered);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <BookMarked className="h-7 w-7 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-display tracking-tight">
            Formula &amp; Rules Reference
          </h1>
        </div>
        <p className="mt-2 text-muted-foreground">
          A concise quick-sheet for Finance, CMA, and CPA — the formulas and rules behind the lessons
          and exam sims. Search by name, formula, or keyword.
        </p>
      </div>

      <div className="space-y-2">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search formulas (e.g. NPV, goodwill, QBI, variance)…"
          className="glass border-0 max-w-md px-4 py-2"
        />
        <p className="text-xs text-muted-foreground">
          {total} formula{total === 1 ? "" : "s"} shown
        </p>
      </div>

      <div className="space-y-6">
        {filtered.map((group) => (
          <div key={group.id}>
            <h2 className="mb-3 text-lg font-semibold text-foreground font-display tracking-tight">
              {group.label}
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {group.entries.map((e) => (
                <GlassCard key={e.name} className="p-5">
                  <div className="text-sm font-medium text-foreground">{e.name}</div>
                  <p
                    className="mt-2 rounded px-2 py-1 font-mono text-sm text-foreground"
                    style={{ background: "hsl(var(--primary) / 0.1)" }}
                  >
                    {e.formula}
                  </p>
                  {e.note && <p className="mt-2 text-xs text-muted-foreground">{e.note}</p>}
                </GlassCard>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <GlassCard className="p-10 text-center text-muted-foreground">
            No formulas match “{q}”.
          </GlassCard>
        )}
      </div>
    </div>
  );
}
