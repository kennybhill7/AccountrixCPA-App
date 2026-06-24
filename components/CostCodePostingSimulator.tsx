"use client";

import React, { useMemo, useState } from "react";
import {
  COST_CODES,
  WIP_GL_ACCOUNTS,
  CostCodePostingEngine,
  type JobPosting,
} from "@/lib/costCodeMapping";

/**
 * CostCodePostingSimulator — the live tool for CMA Month 4 Week 1.
 * Teaches the rule: cost codes (L/M/E/S/O) are job-tracking DIMENSIONS, never GL
 * accounts. They roll up to WIP control accounts 1401–1405. Post a cost, see the
 * journal entry (DR WIP / CR AP) and the job-cost rollup by WIP GL account.
 */

const CATEGORY_ORDER = ["Labor", "Materials", "Equipment", "Subcontractor", "Other"] as const;

const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function CostCodePostingSimulator() {
  const [jobId, setJobId] = useState("H-101");
  const [costCode, setCostCode] = useState("M001");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [postings, setPostings] = useState<JobPosting[]>([]);
  const [error, setError] = useState<string | null>(null);

  const grouped = useMemo(
    () =>
      CATEGORY_ORDER.map((cat) => ({
        category: cat,
        codes: COST_CODES.filter((c) => c.category === cat),
      })),
    []
  );

  const jobPostings = useMemo(() => postings.filter((p) => p.jobId === jobId), [postings, jobId]);

  const summary = useMemo(
    () => CostCodePostingEngine.getJobCostSummary(jobId, postings),
    [postings, jobId]
  );

  const jobTotal = useMemo(() => summary.reduce((s, w) => s + w.totalAmount, 0), [summary]);

  const lastEntry = useMemo(() => {
    const last = jobPostings[jobPostings.length - 1];
    if (!last) return null;
    const cc = COST_CODES.find((c) => c.code === last.costCode);
    return { posting: last, wipAccount: last.wipGLAccount, costCode: cc };
  }, [jobPostings]);

  function handlePost() {
    setError(null);
    const amt = Number(amount);
    if (!jobId.trim()) return setError("Enter a job ID.");
    if (!Number.isFinite(amt) || amt <= 0) return setError("Enter an amount greater than 0.");
    try {
      const je = CostCodePostingEngine.postJobCost({
        jobId: jobId.trim(),
        costCode,
        amount: amt,
        description: description.trim() || "Job cost",
        date: "2026-06-23",
        postedBy: "Jordan Reed",
      });
      const cc = COST_CODES.find((c) => c.code === costCode)!;
      const posting: JobPosting = {
        id: je.id,
        jobId: jobId.trim(),
        jobName: jobId.trim(),
        costCode,
        costCodeName: cc.name,
        description: description.trim() || "Job cost",
        amount: amt,
        date: "2026-06-23",
        wipGLAccount: cc.wipGLAccount,
        postedBy: "Jordan Reed",
        timestamp: je.timestamp,
      };
      setPostings((p) => [...p, posting]);
      setAmount("");
      setDescription("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Posting failed.");
    }
  }

  return (
    <div className="mx-auto max-w-5xl rounded-xl bg-[#0f1923] p-6 text-slate-100 shadow-lg">
      <h1 className="text-2xl font-bold text-[#2e75b6]">Cost Code → WIP GL Posting Simulator</h1>
      <p className="mt-1 text-sm text-slate-300">
        CMA Part 1-D · Month 4 Week 1. Post a job cost and watch it roll up to a WIP control
        account.
      </p>

      <div className="mt-4 rounded-lg border border-[#2e75b6]/40 bg-[#13212f] p-3 text-sm">
        <strong className="text-[#2e75b6]">The rule:</strong> cost codes (L, M, E, S, O) are
        job-tracking <em>dimensions</em> — they are <strong>never</strong> GL accounts. Every code
        rolls up to a WIP control account (1401–1405). The engine rejects any attempt to post a cost
        code as a GL account.
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Form */}
        <div className="space-y-3">
          <label className="block text-sm">
            <span className="text-slate-400">Job ID</span>
            <input
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              className="mt-1 w-full rounded bg-[#1b2c3d] px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-[#2e75b6]"
            />
          </label>
          <label className="block text-sm">
            <span className="text-slate-400">Cost code</span>
            <select
              value={costCode}
              onChange={(e) => setCostCode(e.target.value)}
              className="mt-1 w-full rounded bg-[#1b2c3d] px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-[#2e75b6]"
            >
              {grouped.map((g) => (
                <optgroup key={g.category} label={g.category}>
                  {g.codes.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} — {c.name} → WIP {c.wipGLAccount}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-slate-400">Amount</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 8400"
              className="mt-1 w-full rounded bg-[#1b2c3d] px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-[#2e75b6]"
            />
          </label>
          <label className="block text-sm">
            <span className="text-slate-400">Description (optional)</span>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Framing lumber"
              className="mt-1 w-full rounded bg-[#1b2c3d] px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-[#2e75b6]"
            />
          </label>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={handlePost}
              className="rounded bg-[#2e75b6] px-4 py-2 font-semibold text-white hover:bg-[#3a86cc]"
            >
              Post cost
            </button>
            <button
              onClick={() => {
                setPostings([]);
                setError(null);
              }}
              className="rounded border border-slate-600 px-4 py-2 text-slate-300 hover:bg-[#1b2c3d]"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Last journal entry */}
        <div>
          <h2 className="text-sm font-semibold text-slate-400">Resulting journal entry</h2>
          {lastEntry ? (
            <div className="mt-1 rounded-lg border border-slate-700 bg-[#13212f] p-3 text-sm">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-slate-400">
                    <th className="pb-1">Account</th>
                    <th className="pb-1 text-right">Debit</th>
                    <th className="pb-1 text-right">Credit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-[#2e75b6]">
                      {lastEntry.wipAccount}{" "}
                      {
                        WIP_GL_ACCOUNTS.find((w) => w.accountCode === lastEntry.wipAccount)
                          ?.accountName
                      }
                    </td>
                    <td className="text-right">{fmt(lastEntry.posting.amount)}</td>
                    <td className="text-right">—</td>
                  </tr>
                  <tr>
                    <td>2000 Accounts Payable</td>
                    <td className="text-right">—</td>
                    <td className="text-right">{fmt(lastEntry.posting.amount)}</td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-2 text-xs text-slate-400">
                Job <strong>{lastEntry.posting.jobId}</strong> · cost code{" "}
                <strong>{lastEntry.posting.costCode}</strong> ({lastEntry.costCode?.category}) —
                debit hits the <strong>WIP asset</strong>, not the cost code.
              </p>
            </div>
          ) : (
            <p className="mt-1 text-sm text-slate-500">Post a cost to see the entry.</p>
          )}
        </div>
      </div>

      {/* Job cost rollup */}
      <h2 className="mt-8 text-sm font-semibold text-slate-400">
        Job {jobId} — WIP rollup by control account
      </h2>
      {summary.length === 0 ? (
        <p className="mt-1 text-sm text-slate-500">No postings for this job yet.</p>
      ) : (
        <div className="mt-1 overflow-hidden rounded-lg border border-slate-700">
          <table className="w-full text-sm">
            <thead className="bg-[#13212f] text-left text-slate-400">
              <tr>
                <th className="px-3 py-2">WIP GL</th>
                <th className="px-3 py-2">Cost-code detail</th>
                <th className="px-3 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((w) => (
                <tr key={w.wipGLAccount} className="border-t border-slate-800">
                  <td className="px-3 py-2 align-top text-[#2e75b6]">
                    {w.wipGLAccount}
                    <div className="text-xs text-slate-400">{w.wipGLAccountName}</div>
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-300">
                    {w.costCodeBreakdown.map((b) => (
                      <div key={b.costCode}>
                        {b.costCode} {b.costCodeName} — {fmt(b.amount)}
                      </div>
                    ))}
                  </td>
                  <td className="px-3 py-2 text-right align-top">{fmt(w.totalAmount)}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-[#2e75b6]/50 font-semibold">
                <td className="px-3 py-2" colSpan={2}>
                  Total WIP for job {jobId}
                </td>
                <td className="px-3 py-2 text-right">{fmt(jobTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
