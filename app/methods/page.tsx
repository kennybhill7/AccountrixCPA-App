import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Lightbulb } from "lucide-react";
import { METHODS } from "@/lib/methods";
import { AREA_ORDER } from "@/lib/mastery";
import { GlassCard } from "@/components/glass/GlassCard";
import { FormulaDrill } from "@/components/glass/FormulaDrill";

export const metadata: Metadata = {
  title: "Method Cards — Accountrix",
  description: "If you see this, do this — the operational play for every core finance and accounting problem type.",
};

function MethodCardView({ m }: { m: (typeof METHODS)[number] }) {
  return (
    <GlassCard className="p-5 sm:p-6">
      <h3 className="font-display text-lg font-bold tracking-tight text-foreground">{m.label}</h3>

      <p className="mt-2 text-sm text-text-muted">
        <span className="font-semibold text-foreground">If you see:</span> {m.trigger}
      </p>

      <div className="mt-3 rounded-xl px-4 py-3 font-mono text-sm text-foreground" style={{ background: "hsl(var(--primary) / 0.08)" }}>
        {m.formula}
      </div>

      <ol className="mt-3 space-y-1.5">
        {m.steps.map((s, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
            <span className="font-display mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[11px] font-bold" style={{ background: "hsl(var(--primary) / 0.12)", color: "hsl(var(--primary))" }}>
              {i + 1}
            </span>
            <span>{s}</span>
          </li>
        ))}
      </ol>

      <p className="mt-3 rounded-xl px-4 py-2.5 text-sm text-foreground" style={{ background: "hsl(var(--status-streak) / 0.1)" }}>
        <span className="font-semibold">⚠ Trap:</span> {m.trap}
      </p>

      <p className="mt-2 text-sm text-text-muted">
        <span className="font-semibold text-foreground">e.g.</span> {m.example}
      </p>

      <Link href={`/practice?skill=${encodeURIComponent(m.skill)}`} className="mt-4 inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-primary" style={{ background: "hsl(var(--primary) / 0.1)" }}>
        Practice now <ArrowRight className="h-4 w-4" />
      </Link>
    </GlassCard>
  );
}

export default function MethodsPage() {
  const byArea = AREA_ORDER.map((area) => ({ area, cards: METHODS.filter((m) => m.area === area) })).filter((g) => g.cards.length > 0);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl text-white" style={{ background: "linear-gradient(135deg,#3b82f6,#7c3aed)" }}>
          <Lightbulb className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Method Cards</h1>
          <p className="text-sm text-muted-foreground">If you see this, do this. The play for each problem type — read it, then rep it.</p>
        </div>
      </div>

      <FormulaDrill />

      {byArea.map(({ area, cards }) => (
        <div key={area} className="space-y-3">
          <h2 className="font-display px-1 text-sm font-bold uppercase tracking-wider text-text-light">{area}</h2>
          {cards.map((m) => (
            <MethodCardView key={m.skill} m={m} />
          ))}
        </div>
      ))}
    </div>
  );
}
