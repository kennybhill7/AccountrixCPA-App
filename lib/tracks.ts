/**
 * Track registry for the visible Accountrix learning paths.
 */

export type TrackKind = "lessons" | "practice";
export type TrackStatus = "live" | "in-progress" | "planned";

export interface Track {
  id: string;
  exam: "Finance" | "CMA" | "CPA";
  label: string;
  description: string;
  kind: TrackKind;
  status: TrackStatus;
  href: string;
  /** For lessons tracks: the month ids that make up this track. */
  months?: string[];
  /** For practice tracks or section-based lesson tracks. */
  sections?: string[];
}

const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => `m${a + i}`);

const CPA_SECTIONS = ["FAR", "AUD", "REG", "BAR", "ISC", "TCP"];

export const TRACKS: Track[] = [
  {
    id: "finance-corporate",
    exam: "Finance",
    label: "Corporate Finance",
    description:
      "Financial statements, TVM, bonds, stock valuation, CAPM, WACC, capital budgeting, project cash flows, pro formas, working capital, and financial planning.",
    kind: "lessons",
    status: "live",
    href: "/finance",
    sections: ["Finance"],
  },
  {
    id: "cma-p1",
    exam: "CMA",
    label: "CMA Part 1 — Financial Planning, Performance & Analytics",
    description:
      "External reporting, planning/budgeting, performance management, cost management, internal controls, technology & analytics — taught through fictional controller/CFO cases.",
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
    status: "live",
    href: "/learn",
    months: range(7, 12),
  },
  {
    id: "cpa-practice",
    exam: "CPA",
    label: "CPA Practice — FAR · AUD · REG · BAR · ISC · TCP",
    description:
      "Exam-style CPA practice items across all six CPA Evolution sections. Attempts feed readiness and missed-item review.",
    kind: "practice",
    status: "live",
    href: "/crossover",
    sections: CPA_SECTIONS,
  },
  {
    id: "cpa-lessons",
    exam: "CPA",
    label: "CPA Lessons — Core + Disciplines",
    description:
      "Full CPA lessons across FAR, AUD, REG, BAR, ISC, and TCP, tied to the fictional case universe and the CMA/Finance skill graph.",
    kind: "lessons",
    status: "live",
    href: "/cpa",
    sections: CPA_SECTIONS,
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
