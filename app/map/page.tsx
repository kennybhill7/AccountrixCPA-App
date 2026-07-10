import type { Metadata } from "next";
import Link from "next/link";
import { Map as MapIcon } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";

export const metadata: Metadata = {
  title: "All Pages — Accountrix",
  description: "Every route in one place for testing.",
};

interface Route { href: string; label: string; note?: string }
interface Group { title: string; routes: Route[] }

// Dynamic detail routes deep-link to known-good example params.
const GROUPS: Group[] = [
  {
    title: "Daily loop",
    routes: [
      { href: "/", label: "Today", note: "home / session engine" },
      { href: "/practice", label: "Practice", note: "drills + MCQs + weak spots" },
      { href: "/methods", label: "Method Cards", note: "+ Formula Recall drill" },
      { href: "/calculator", label: "Calculator Lab" },
      { href: "/apply", label: "Apply Lab" },
      { href: "/mastery", label: "Mastery" },
      { href: "/scratchpad", label: "Notebook", note: "Apple Pencil" },
    ],
  },
  {
    title: "Lessons & tracks",
    routes: [
      { href: "/learn", label: "Learn (CMA hub)" },
      { href: "/learn/m1", label: "Learn — Month 1" },
      { href: "/learn/m1/w1", label: "Learn — lesson (m1/w1)" },
      { href: "/learn/m1/w1/quiz", label: "Learn — quiz (m1/w1)" },
      { href: "/finance", label: "Finance hub" },
      { href: "/finance/finance-u1/w1", label: "Finance — lesson (u1/w1)" },
      { href: "/cpa", label: "CPA Lessons hub" },
      { href: "/crossover", label: "CPA Practice" },
      { href: "/flashcards", label: "Flashcards" },
      { href: "/tracks", label: "Study Tracks" },
    ],
  },
  {
    title: "Diagnose & review",
    routes: [
      { href: "/diagnostic", label: "Diagnostic" },
      { href: "/readiness", label: "Readiness" },
      { href: "/mistakes", label: "Mistakes / review queue" },
      { href: "/mission", label: "Mission Control" },
      { href: "/reference", label: "Reference / formulas" },
    ],
  },
  {
    title: "Apply & tools",
    routes: [
      { href: "/apply/meridian-building-group/wip-schedule", label: "Apply — WIP schedule case" },
      { href: "/apply/meridian-building-group/bank-rec", label: "Apply — Bank rec case" },
      { href: "/apply/meridian-building-group/month-end-close", label: "Apply — Month-end close" },
      { href: "/coa-builder", label: "Chart of Accounts builder" },
      { href: "/coa-builder/examples", label: "COA — examples" },
      { href: "/coa-builder/integration", label: "COA — integration" },
      { href: "/tools/cost-codes", label: "Cost-code → WIP simulator" },
      { href: "/sims", label: "Simulations (TBS/essay)" },
    ],
  },
  {
    title: "Notes, search & AI",
    routes: [
      { href: "/notes", label: "Notes" },
      { href: "/scratchpad", label: "Notebook (handwriting)" },
      { href: "/search", label: "Search" },
      { href: "/assist", label: "AI Assist sessions" },
      { href: "/onboarding", label: "Onboarding" },
      { href: "/onboarding/chat", label: "Onboarding — chat" },
    ],
  },
  {
    title: "Progress & gamification",
    routes: [
      { href: "/profile", label: "Profile" },
      { href: "/gamification", label: "Gamification / badges" },
      { href: "/plan", label: "Study plan" },
      { href: "/state", label: "State (debug)" },
      { href: "/templates", label: "Templates" },
    ],
  },
  {
    title: "Account & info",
    routes: [
      { href: "/settings", label: "Settings", note: "export/import your data here" },
      { href: "/help", label: "Help" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export default function AllPagesMap() {
  const total = GROUPS.reduce((n, g) => n + g.routes.length, 0);
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl text-white" style={{ background: "linear-gradient(135deg,#3b82f6,#7c3aed)" }}>
          <MapIcon className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">All Pages</h1>
          <p className="text-sm text-muted-foreground">Every route ({total}) in one place — nothing is locked. Click through and tell me what&apos;s good and what needs work.</p>
        </div>
      </div>

      {GROUPS.map((g) => (
        <GlassCard key={g.title} className="p-5 sm:p-6">
          <h2 className="font-display mb-3 text-sm font-bold uppercase tracking-wider text-text-light">{g.title}</h2>
          <div className="grid gap-1 sm:grid-cols-2">
            {g.routes.map((r) => (
              <Link key={r.href} href={r.href} className="lesson-row -mx-2 flex items-center gap-2 rounded-lg px-2 py-2">
                <span className="text-sm font-medium text-foreground">{r.label}</span>
                {r.note && <span className="truncate text-xs text-text-light">· {r.note}</span>}
                <code className="ml-auto shrink-0 text-[11px] text-text-light">{r.href}</code>
              </Link>
            ))}
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
