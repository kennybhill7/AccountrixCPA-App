"use client";

import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  Calculator,
  ClipboardCheck,
  FileSpreadsheet,
  HardHat,
  LineChart,
  ListChecks,
  Wallet,
} from "lucide-react";
import { GlassCard } from "./GlassCard";

/**
 * ControllerDesk — the "I'm doing the close this week" home for the day job.
 * Surfaces the construction-finance Apply cases and the workpaper tools first,
 * instead of exam sessions. Complements the exam-prep Today via the role toggle.
 */

const CASES = [
  {
    label: "Month-end close",
    href: "/apply/meridian-building-group/month-end-close",
    icon: ListChecks,
    note: "close checklist + JEs",
  },
  {
    label: "Bank reconciliation",
    href: "/apply/meridian-building-group/bank-rec",
    icon: Banknote,
    note: "book vs bank",
  },
  {
    label: "WIP schedule (POC)",
    href: "/apply/meridian-building-group/wip-schedule",
    icon: HardHat,
    note: "% complete, over/underbilling",
  },
  {
    label: "AP aging & disbursement",
    href: "/apply/meridian-building-group/ap-aging",
    icon: Wallet,
    note: "who to pay this week",
  },
  {
    label: "AR aging & collections",
    href: "/apply/meridian-building-group/ar-aging",
    icon: ClipboardCheck,
    note: "chase the receivables",
  },
  {
    label: "13-week cash forecast",
    href: "/apply/meridian-building-group/cash-forecast",
    icon: LineChart,
    note: "liquidity runway",
  },
];

const TOOLS = [
  { label: "Chart of Accounts builder", href: "/coa-builder", icon: FileSpreadsheet },
  { label: "Cost-code → WIP simulator", href: "/tools/cost-codes", icon: HardHat },
  { label: "Calculator Lab", href: "/calculator", icon: Calculator },
];

export function ControllerDesk() {
  return (
    <div className="space-y-6">
      <div
        className="relative overflow-hidden border border-border bg-card p-6 sm:p-7"
        style={{
          borderRadius: 2,
          backgroundImage: "linear-gradient(hsl(var(--border) / 0.18) 1px, transparent 1px)",
          backgroundSize: "100% 2.25rem",
        }}
      >
        <div className="relative">
          <div className="blueprint-label">Controller desk</div>
          <h1 className="font-display mt-2 text-3xl font-bold text-foreground sm:text-4xl">
            The work in front of you
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Construction-finance workflows on your case company — close, rec, WIP, aging, cash. Do
            the real thing; the exam reps compound on the side.
          </p>
        </div>
      </div>

      <div>
        <h2 className="font-display mb-3 text-sm font-bold uppercase tracking-wider text-text-light">
          Case workflows
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {CASES.map((c) => {
            const Icon = c.icon;
            return (
              <Link key={c.href} href={c.href}>
                <GlassCard hover className="flex items-center gap-3 p-4">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: "hsl(var(--unit-3) / 0.14)",
                      color: "hsl(var(--unit-3-ink))",
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-foreground">{c.label}</div>
                    <div className="truncate text-xs text-text-light">{c.note}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-text-light" />
                </GlassCard>
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="font-display mb-3 text-sm font-bold uppercase tracking-wider text-text-light">
          Tools
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {TOOLS.map((t) => {
            const Icon = t.icon;
            return (
              <Link key={t.href} href={t.href}>
                <GlassCard hover className="flex items-center gap-3 p-4">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{
                      background: "hsl(var(--primary) / 0.12)",
                      color: "hsl(var(--primary))",
                    }}
                  >
                    <Icon className="h-4.5 w-4.5" style={{ height: 18, width: 18 }} />
                  </span>
                  <span className="text-sm font-semibold text-foreground">{t.label}</span>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      </div>

      <GlassCard className="flex items-center justify-between gap-4 p-5">
        <div>
          <div className="font-display font-bold tracking-tight text-foreground">
            Keep the exam warm
          </div>
          <div className="text-sm text-text-muted">
            Ten minutes of drills keeps CPA/CMA moving while the day job leads.
          </div>
        </div>
        <Link
          href="/practice"
          className="shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold text-primary"
          style={{ background: "hsl(var(--primary) / 0.12)" }}
        >
          Quick practice
        </Link>
      </GlassCard>
    </div>
  );
}
