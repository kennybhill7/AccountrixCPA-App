/**
 * lib/tracks.ts — S1-C5 groundwork (additive, non-breaking).
 *
 * A registry of study "tracks". The current app renders a single 12-month
 * curriculum (CMA, mapped m1–m6 = Part 1, m7–m12 = Part 2). This registry layers a
 * track concept on top WITHOUT changing that rendering, so the UI can present
 * CMA (lessons) and CPA (crossover practice now; full lessons later) as distinct
 * paths, and the full multi-track data-model refactor can build on it incrementally.
 */

export type TrackKind = "lessons" | "practice";
export type TrackStatus = "live" | "in-progress" | "planned";

export interface Track {
  id: string;
  exam: "CMA" | "CPA";
  label: string;
  description: string;
  kind: TrackKind;
  status: TrackStatus;
  href: string;
  /** For lessons tracks: the month ids that make up this track (existing single-track ids). */
  months?: string[];
  /** For practice tracks: the CPA sections drawn from the item bank. */
  sections?: string[];
}

const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => `m${a + i}`);

export const TRACKS: Track[] = [
  {
    id: "cma-p1",
    exam: "CMA",
    label: "CMA Part 1 — Financial Planning, Performance & Analytics",
    description:
      "External reporting, planning/budgeting, performance management, cost management, internal controls, technology & analytics — taught through a fictional construction company's transactions.",
    kind: "lessons",
    status: "live",
    href: "/learn",
    months: range(1, 6),
  },
  {
    id: "cma-p2",
    exam: "CMA",
    label: "CMA Part 2 — Strategic Financial Management",
    description:
      "Financial-statement analysis, corporate finance, decision analysis, risk management, investment decisions, and professional ethics.",
    kind: "lessons",
    status: "in-progress",
    href: "/learn",
    months: range(7, 12),
  },
  {
    id: "cpa-crossover",
    exam: "CPA",
    label: "CPA Crossover Practice",
    description:
      "Real CPA exam-style questions (FAR/AUD/REG/BAR) that reinforce the CMA topics you're studying, with rationale and ASC/standard references.",
    kind: "practice",
    status: "live",
    href: "/crossover",
    sections: ["FAR", "AUD", "REG", "BAR"],
  },
  {
    id: "cpa-core",
    exam: "CPA",
    label: "CPA Core — FAR · AUD · REG (full lessons)",
    description:
      "Discipline-agnostic core sections of the CPA Evolution blueprint. FAR, AUD, and REG lessons are live and tied to the fictional construction case universe.",
    kind: "lessons",
    status: "live",
    href: "/cpa",
    sections: ["FAR", "AUD", "REG"],
  },
  {
    id: "cpa-discipline-bar",
    exam: "CPA",
    label: "CPA Disciplines — BAR · ISC · TCP",
    description:
      "CPA discipline lessons for Business Analysis & Reporting, Information Systems & Controls, and Tax Compliance & Planning.",
    kind: "lessons",
    status: "live",
    href: "/cpa",
    sections: ["BAR", "ISC", "TCP"],
  },
  {
    id: "apply-lab",
    exam: "CMA",
    label: "Apply Lab — Fictional Controller/CFO Workflows",
    description:
      "Fictional case-company workpapers for WIP, bank rec, pro forma, AR/AP aging, debt schedules, month-end close, and cash forecasting.",
    kind: "practice",
    status: "live",
    href: "/apply",
    sections: ["Controller", "CFO"],
  },
];

export const getTrack = (id: string): Track | undefined => TRACKS.find((t) => t.id === id);
