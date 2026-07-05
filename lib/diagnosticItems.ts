import type { AttemptTrack, Curriculum, QuizQuestion, Week } from "./types";

export interface DiagnosticItem {
  id: string;
  track: Exclude<AttemptTrack, "apply">;
  section: string;
  sectionLabel: string;
  topic?: string;
  stem: string;
  choices: string[];
  answer: number;
  skills: string[];
  href: string;
}

export const DIAGNOSTIC_SECTION_ORDER = [
  "Finance",
  "CMA Part 1",
  "CMA Part 2",
  "FAR",
  "AUD",
  "REG",
  "BAR",
  "ISC",
  "TCP",
];

export const DEFAULT_DIAGNOSTIC_PER_SECTION = 2;

export function cmaDiagnosticSection(monthId: string): "CMA Part 1" | "CMA Part 2" {
  const n = Number(monthId.replace(/^m/i, ""));
  return n >= 7 ? "CMA Part 2" : "CMA Part 1";
}

export function quizItemsFromWeek(args: {
  track: Exclude<AttemptTrack, "apply">;
  section: string;
  sectionLabel?: string;
  unitOrMonthId: string;
  week: Week;
  skills: string[];
  href: string;
}): DiagnosticItem[] {
  const questions = args.week.quiz?.questions ?? [];
  return questions.map((q: QuizQuestion, index: number) => ({
    id: `${args.track}:${args.unitOrMonthId}:${args.week.id}:q${index}`,
    track: args.track,
    section: args.section,
    sectionLabel: args.sectionLabel ?? args.section,
    topic: args.week.title,
    stem: q.q,
    choices: q.choices,
    answer: q.answer,
    skills: args.skills,
    href: args.href,
  }));
}

export function cmaDiagnosticPool(
  curriculum: Curriculum,
  cmaSkillsByWeek: Record<string, string[]> = {}
): DiagnosticItem[] {
  const out: DiagnosticItem[] = [];
  for (const [monthId, month] of Object.entries(curriculum)) {
    const section = cmaDiagnosticSection(monthId);
    for (const week of month.weeks ?? []) {
      const skills =
        week.skills && week.skills.length > 0
          ? week.skills
          : cmaSkillsByWeek[`${monthId}:${week.id}`] ?? [];
      out.push(
        ...quizItemsFromWeek({
          track: "cma",
          section,
          unitOrMonthId: monthId,
          week,
          skills,
          href: `/learn/${monthId}/${week.id}`,
        })
      );
    }
  }
  return out;
}

export function financeDiagnosticPool(units: Array<{ id: string; weeks?: Week[] }>): DiagnosticItem[] {
  return units.flatMap((unit) =>
    (unit.weeks ?? []).flatMap((week) =>
      quizItemsFromWeek({
        track: "finance",
        section: "Finance",
        unitOrMonthId: unit.id,
        week,
        skills: week.skills ?? [],
        href: `/finance/${unit.id}/${week.id}`,
      })
    )
  );
}

export function sampleDiagnosticItems(
  items: DiagnosticItem[],
  perSection = DEFAULT_DIAGNOSTIC_PER_SECTION,
  rng: () => number = Math.random
): DiagnosticItem[] {
  const bySection = new Map<string, DiagnosticItem[]>();
  for (const item of items) {
    const bucket = bySection.get(item.section) ?? [];
    bucket.push(item);
    bySection.set(item.section, bucket);
  }

  const picked: DiagnosticItem[] = [];
  for (const section of DIAGNOSTIC_SECTION_ORDER) {
    const pool = bySection.get(section) ?? [];
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    picked.push(...shuffled.slice(0, perSection));
  }
  return picked;
}
