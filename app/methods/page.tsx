import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { METHODS } from "@/lib/methods";
import { AREA_ORDER } from "@/lib/mastery";
import { FormulaDrill } from "@/components/glass/FormulaDrill";
import { TitleBlock } from "@/components/sheet/TitleBlock";
import { StateGlyph } from "@/components/sheet/StateGlyph";

export const metadata: Metadata = {
  title: "Method Cards — Accountrix",
  description:
    "If you see this, do this — the operational play for every core finance and accounting problem type.",
};

function MethodCardView({ m }: { m: (typeof METHODS)[number] }) {
  return (
    <div className="p-5 sm:p-6" style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}>
      <h3 className="font-display text-lg font-bold tracking-tight text-foreground">{m.label}</h3>

      <p className="mt-2 text-sm text-text-muted">
        <span className="font-semibold text-foreground">If you see:</span> {m.trigger}
      </p>

      <div
        className="mt-3 px-4 py-3 font-mono text-sm text-foreground"
        style={{ background: "hsl(var(--secondary))", borderRadius: 2 }}
      >
        {m.formula}
      </div>

      <ol className="mt-3 space-y-1.5">
        {m.steps.map((s, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
            <span
              className="font-display mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-[11px] font-bold"
              style={{
                background: "hsl(var(--foreground) / 0.08)",
                color: "hsl(var(--foreground))",
                borderRadius: 2,
              }}
            >
              {i + 1}
            </span>
            <span>{s}</span>
          </li>
        ))}
      </ol>

      <p
        className="mt-3 flex items-start gap-2 px-4 py-2.5 text-sm text-foreground"
        style={{ background: "hsl(var(--warn) / 0.08)", borderRadius: 2 }}
      >
        <StateGlyph state="warn" />
        <span>
          <span className="font-semibold">Trap:</span> {m.trap}
        </span>
      </p>

      <p className="mt-2 text-sm text-text-muted">
        <span className="font-semibold text-foreground">e.g.</span> {m.example}
      </p>

      <Link
        href={`/practice?skill=${encodeURIComponent(m.skill)}`}
        className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-foreground"
        style={{ border: "1px solid hsl(var(--foreground) / 0.3)", borderRadius: 2 }}
      >
        Practice now <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export default function MethodsPage() {
  const byArea = AREA_ORDER.map((area) => ({
    area,
    cards: METHODS.filter((m) => m.area === area),
  })).filter((g) => g.cards.length > 0);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <TitleBlock
        eyebrow="If you see this, do this"
        title="Method Cards"
        subtitle="The play for each problem type — read it, then rep it."
      />

      <FormulaDrill />

      {byArea.map(({ area, cards }) => (
        <div key={area} className="space-y-3">
          <h2 className="font-display px-1 text-sm font-bold uppercase tracking-wider text-text-light">
            {area}
          </h2>
          {cards.map((m) => (
            <MethodCardView key={m.skill} m={m} />
          ))}
        </div>
      ))}
    </div>
  );
}
