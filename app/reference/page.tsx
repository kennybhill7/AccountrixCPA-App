"use client";

import { useMemo, useState } from "react";
import { BookMarked } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <div className="mb-2 flex items-center gap-3">
        <BookMarked className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-bold">Formula &amp; Rules Reference</h1>
      </div>
      <p className="mb-6 text-muted-foreground">
        A concise quick-sheet for Finance, CMA, and CPA — the formulas and rules behind the lessons
        and exam sims. Search by name, formula, or keyword.
      </p>

      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search formulas (e.g. NPV, goodwill, QBI, variance)…"
        className="mb-2 max-w-md"
      />
      <p className="mb-6 text-xs text-muted-foreground">
        {total} formula{total === 1 ? "" : "s"} shown
      </p>

      <div className="space-y-6">
        {filtered.map((group) => (
          <div key={group.id}>
            <h2 className="mb-3 text-lg font-semibold">{group.label}</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {group.entries.map((e) => (
                <Card key={e.name}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{e.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="rounded bg-muted px-2 py-1 font-mono text-sm">{e.formula}</p>
                    {e.note && <p className="mt-2 text-xs text-muted-foreground">{e.note}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No formulas match “{q}”.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
