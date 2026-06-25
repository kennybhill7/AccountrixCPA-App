"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

type Urgency = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

interface PainPointDef {
  key: string;
  label: string;
}

const PAIN_POINTS: Record<string, PainPointDef[]> = {
  monthEnd: [
    { key: "bank_recs", label: "Bank reconciliations are a mess" },
    { key: "beginning_balances", label: "Beginning balance issues" },
    { key: "prior_year_not_closed", label: "Prior year not closed" },
    { key: "cannot_tie_cash", label: "Can't tie out cash accounts" },
    { key: "close_too_slow", label: "Month-end close takes too long (>5 days)" },
  ],
  journal: [
    { key: "je_mystery", label: "Mystery journal entries I can't trace" },
    { key: "re_opening_balance_je_unclear", label: "RE / opening balance JEs unclear" },
    { key: "reverse_entries", label: "Don't know how to reverse entries properly" },
    { key: "no_docs_complex_jes", label: "No documentation for complex JEs" },
  ],
  construction: [
    { key: "retainage_setup", label: "Don't know how to set up retainage" },
    { key: "wip_confusing", label: "WIP schedules are confusing" },
    { key: "job_costing_reports", label: "Job costing reports don't make sense" },
    { key: "progress_billing", label: "Progress billing issues" },
    { key: "change_order_accounting", label: "Change order accounting unclear" },
  ],
  multiEntity: [
    { key: "ic_not_balance", label: "Intercompany accounts don't balance" },
    { key: "no_ic_elimination_process", label: "No systematic IC elimination process" },
    { key: "track_due_to_from", label: "Can't track due to/due from across entities" },
    { key: "consolidation_ad_hoc", label: "Consolidation is ad-hoc and error-prone" },
  ],
  excel: [
    { key: "too_much_excel", label: "Too much manual work in Excel" },
    { key: "no_power_query", label: "Don't know Power Query or Power Pivot" },
    { key: "recs_time_consuming", label: "Reconciliations are time-consuming" },
    { key: "no_dashboards", label: "No automated dashboards" },
  ],
  process: [
    { key: "no_close_checklist", label: "No formal close checklist" },
    { key: "no_recon_matrix", label: "No reconciliation matrix" },
    { key: "missing_docs_standards", label: "Missing documentation standards" },
    { key: "ad_hoc_processes", label: "Ad-hoc processes, nothing repeatable" },
  ],
  cpa: [
    { key: "cpa_need_pass", label: "Need to pass CPA exam" },
    { key: "cpa_topics_struggle", label: "Struggling with specific topics" },
  ],
};

export default function OnboardingPage() {
  const [userId, setUserId] = useState("demo-user");
  const [role, setRole] = useState("CFO");
  const [industry, setIndustry] = useState("Construction");
  const [entities, setEntities] = useState("10+");
  const [software, setSoftware] = useState("Ledgerline Intacct");
  const [goals, setGoals] = useState<string[]>(["Both"]);
  const [timeline, setTimeline] = useState("12months");
  const [hoursPerWeek, setHoursPerWeek] = useState(5);
  const [notes, setNotes] = useState("");
  const [selected, setSelected] = useState<Record<string, Urgency>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load any existing intake
    const raw = localStorage.getItem("ai-intake");
    if (raw) {
      try {
        const data = JSON.parse(raw);
        setUserId(data.userId || "demo-user");
        setRole(data.role || "CFO");
        setIndustry(data.industry || "Construction");
        setEntities(data.entities || "10+");
        setSoftware(data.software || "Ledgerline Intacct");
        setGoals(data.goals || ["Both"]);
        setTimeline(data.timeline || "12months");
        setHoursPerWeek(data.hoursPerWeek || 5);
        setNotes(data.notes || "");
        const sp: Record<string, Urgency> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (data.painPoints || []).forEach((p: any) => {
          sp[p.key] = p.urgency;
        });
        setSelected(sp);
      } catch {}
    }
  }, []);

  function togglePainPoint(key: string) {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
      } else {
        next[key] = "MEDIUM";
      }
      return next;
    });
  }

  function setUrgency(key: string, urgency: Urgency) {
    setSelected((prev) => ({ ...prev, [key]: urgency }));
  }

  async function saveIntake() {
    setSaving(true);
    const painPoints = Object.entries(selected).map(([key, urgency]) => ({
      key,
      label: findLabel(key),
      urgency,
    }));
    const payload = {
      userId,
      timestamp: Date.now(),
      role,
      industry,
      entities,
      software,
      painPoints,
      goals,
      timeline,
      hoursPerWeek,
      notes,
    };
    localStorage.setItem("ai-intake", JSON.stringify(payload));
    try {
      await fetch("/api/ai/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {}
    setSaved(true);
    setSaving(false);
  }

  function findLabel(key: string) {
    for (const group of Object.values(PAIN_POINTS)) {
      const f = group.find((p) => p.key === key);
      if (f) return f.label;
    }
    return key;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-heading font-bold mb-2">Onboarding</h1>
      <p className="text-muted-foreground mb-8">
        Tell us your role and pain points. Claude will generate your plan.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Who you are and context</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>User ID</Label>
              <Input value={userId} onChange={(e) => setUserId(e.target.value)} />
            </div>
            <div>
              <Label>Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "CFO",
                    "Controller",
                    "Staff Accountant",
                    "Bookkeeper",
                    "Accounting Manager",
                    "Other",
                  ].map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Construction",
                    "Real Estate",
                    "Manufacturing",
                    "Technology",
                    "Non-Profit",
                    "Government",
                    "Healthcare",
                    "Other",
                  ].map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Entities Managed</Label>
              <Select value={entities} onValueChange={setEntities}>
                <SelectTrigger>
                  <SelectValue placeholder="Entities" />
                </SelectTrigger>
                <SelectContent>
                  {["1", "2-5", "6-10", "10+"].map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Software</Label>
              <Select value={software} onValueChange={setSoftware}>
                <SelectTrigger>
                  <SelectValue placeholder="Software" />
                </SelectTrigger>
                <SelectContent>
                  {["Ledgerline Intacct", "QuickBooks", "NetSuite", "Xero", "SAP", "Other"].map(
                    (r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Timeline</Label>
              <Select value={timeline} onValueChange={setTimeline}>
                <SelectTrigger>
                  <SelectValue placeholder="Timeline" />
                </SelectTrigger>
                <SelectContent>
                  {["1week", "1-3months", "6months", "12months"].map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Hours per week</Label>
              <Input
                type="number"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(parseInt(e.target.value || "0", 10))}
              />
            </div>
            <div>
              <Label>Goals</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {["Fix work problems", "Pass CPA", "Both", "Promotion", "New CFO role"].map((g) => {
                  const checked = goals.includes(g);
                  return (
                    <label key={g} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(v) =>
                          setGoals((prev) =>
                            v ? Array.from(new Set([...prev, g])) : prev.filter((x) => x !== g)
                          )
                        }
                      />
                      {g}
                    </label>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pain Points & Urgency</CardTitle>
            <CardDescription>Select what applies and set urgency</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(PAIN_POINTS).map(([groupKey, items]) => (
              <div key={groupKey}>
                <h3 className="font-semibold mb-2 capitalize">
                  {groupKey.replace(/([A-Z])/g, " $1")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {items.map((item) => {
                    const active = selected[item.key] as Urgency | undefined;
                    return (
                      <div
                        key={item.key}
                        className={`flex items-center justify-between p-3 rounded border ${active ? "border-primary bg-primary/5" : "border-border"}`}
                      >
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={!!active}
                            onCheckedChange={() => togglePainPoint(item.key)}
                          />
                          {item.label}
                        </label>
                        <Select
                          value={active || undefined}
                          onValueChange={(v: Urgency) => setUrgency(item.key, v)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Urgency" />
                          </SelectTrigger>
                          <SelectContent>
                            {(["CRITICAL", "HIGH", "MEDIUM", "LOW"] as Urgency[]).map((u) => (
                              <SelectItem key={u} value={u}>
                                {u}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <div>
              <Label>Notes</Label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything urgent or specific (e.g., $12k difference, lender deadline)"
              />
            </div>

            <div className="flex gap-3">
              <Button disabled={saving} onClick={saveIntake} className="btn-primary">
                {saving ? "Saving…" : "Save & Notify Claude"}
              </Button>
              {saved && (
                <span className="text-green-600 self-center">
                  Saved. Claude can now generate your plan.
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
