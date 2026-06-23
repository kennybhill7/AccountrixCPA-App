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
      "External reporting, planning/budgeting, performance management, cost management, internal controls, technology & analytics — taught through real MBG transactions.",
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
    label: "CPA Core — AUD · FAR · REG (full lessons)",
    description:
      "Discipline-agnostic core sections of the CPA Evolution blueprint. Lesson content planned; crossover practice available now.",
    kind: "lessons",
    status: "planned",
    href: "/crossover",
    sections: ["AUD", "FAR", "REG"],
  },
  {
    id: "cpa-discipline-bar",
    exam: "CPA",
    label: "CPA Discipline — BAR (recommended)",
    description:
      "Business Analysis & Reporting — the CPA discipline that reuses the most construction/WIP/ratio content you're already learning. Lessons planned.",
    kind: "lessons",
    status: "planned",
    href: "/crossover",
    sections: ["BAR"],
  },
];

export const getTrack = (id: string): Track | undefined => TRACKS.find((t) => t.id === id);
