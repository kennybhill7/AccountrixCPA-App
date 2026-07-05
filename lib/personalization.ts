import fs from "fs/promises";
import path from "path";
import { searchContent } from "@/lib/content-loader";

type Urgency = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface IntakeData {
  userId: string;
  timestamp: number;
  role: string;
  industry: string;
  entities: string;
  software: string;
  painPoints: Array<{ key: string; label: string; urgency: Urgency }>;
  goals: string[];
  timeline: string;
  hoursPerWeek: number;
  notes?: string;
}

export interface PlanData {
  userId: string;
  generatedAt: number;
  items: Array<{
    week: number;
    urgency: Urgency;
    title: string;
    hours: number;
    deliverables: string[];
    mapping?: { monthId: string; weekId: string } | null;
    rationale?: string;
  }>;
}

const DATA_AI = path.join(process.cwd(), "data", "ai");

export async function loadClaudeIntake(userId: string): Promise<IntakeData | null> {
  try {
    const p = path.join(DATA_AI, "intake", `${userId}.json`);
    const txt = await fs.readFile(p, "utf-8");
    return JSON.parse(txt);
  } catch {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("ai-intake") : null;
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}

export async function loadClaudePlan(userId: string): Promise<PlanData | null> {
  try {
    const p = path.join(DATA_AI, "plan", `${userId}.json`);
    const txt = await fs.readFile(p, "utf-8");
    return JSON.parse(txt);
  } catch {
    return null;
  }
}

const painPointKeywords: Record<string, string[]> = {
  bank_recs: ["bank reconciliation", "reconcile bank", "cash account"],
  beginning_balances: ["beginning balance", "opening balance", "retained earnings"],
  retainage_setup: ["retainage", "retainage receivable", "retainage payable"],
  ic_not_balance: ["intercompany", "due to due from", "elimination"],
  wip_confusing: ["WIP", "work in progress", "job costing"],
  no_power_query: ["Power Query", "Excel automation"],
};

export async function generateFallbackPlanFromIntake(intake: IntakeData): Promise<PlanData> {
  const items: PlanData["items"] = [];
  // Guard a malformed/partial intake file (missing or non-array painPoints) —
  // spreading undefined would throw and 500 the plan-resolve route instead of
  // returning an empty plan.
  const painPoints = Array.isArray(intake.painPoints) ? intake.painPoints : [];
  const sorted = [...painPoints].sort(
    (a, b) => urgencyRank(a.urgency) - urgencyRank(b.urgency)
  );

  let week = 1;
  for (const pp of sorted) {
    const title = titleFor(pp.key, pp.label);
    const keywords = painPointKeywords[pp.key] || [pp.label];
    let mapping: { monthId: string; weekId: string } | null = null;
    try {
      const q = keywords.join(" ");
      const res = await searchContent(q);
      const top = res.weeks[0];
      if (top) mapping = { monthId: top.monthId, weekId: top.weekId };
    } catch {}

    items.push({
      week: week++,
      urgency: pp.urgency as Urgency,
      title,
      hours: estimateHours(pp.urgency),
      deliverables: deliverablesFor(pp.key),
      mapping,
      rationale: mapping ? undefined : `Based on ${pp.key}:${pp.urgency}`,
    });
  }

  return { userId: intake.userId, generatedAt: Date.now(), items };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function urgencyRank(u: Urgency): number {
  return ({ CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 } as any)[u] ?? 9;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function estimateHours(u: Urgency): number {
  return ({ CRITICAL: 6, HIGH: 5, MEDIUM: 4, LOW: 3 } as any)[u] ?? 4;
}
function titleFor(key: string, fallback: string) {
  const map: Record<string, string> = {
    bank_recs: "Bank Reconciliation Mastery",
    beginning_balances: "Beginning Balance Troubleshooting",
    retainage_setup: "Retainage Setup in Ledgerline Intacct",
    ic_not_balance: "Intercompany Matrix and Eliminations",
    wip_confusing: "WIP Schedules & Job Costing",
    no_power_query: "Excel Power Query & Automation",
  };
  return map[key] || fallback;
}

function deliverablesFor(key: string): string[] {
  const d: Record<string, string[]> = {
    bank_recs: ["Complete current month bank rec", "Document process for lender"],
    beginning_balances: ["Fix opening balances", "Verify prior-year close dependencies"],
    retainage_setup: ["Enable retainage", "Post test invoice and release"],
    ic_not_balance: ["Build IC matrix", "Prepare elimination entries"],
    wip_confusing: ["Prepare monthly WIP report"],
    no_power_query: ["Build GL import query", "Automate reconciliation template"],
  };
  return d[key] || ["Complete module"];
}
