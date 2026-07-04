/**
 * Skill → lesson map (FABLE5_ANALYSIS §5 Week 3).
 *
 * Merges the three curricula (CMA months, CPA units, Finance units) plus the
 * CMA skills sidecar into a single `Record<skillId, lesson refs>` so readiness
 * surfaces can resolve "Study this" links for any weak skill.
 *
 * Pure — takes pre-loaded curriculum shapes, no fs/store dependency, fully
 * unit-testable. The server route app/api/skills/map wraps this with loading
 * and a module-scope cache.
 */

export type SkillMapTrack = "cma" | "cpa" | "finance";

export interface SkillLessonRef {
  track: SkillMapTrack;
  title: string;
  /** lesson page for that week, e.g. "/learn/m4/w2" or "/cpa/far-u1/w1" */
  href: string;
}

export type SkillMap = Record<string, SkillLessonRef[]>;

interface WeekLike {
  id: string;
  title: string;
  skills?: string[];
}

interface UnitLike {
  id: string;
  weeks?: WeekLike[];
}

export interface SkillMapSources {
  /** data/curriculum.json shape — Record<monthId, { weeks }> */
  cmaCurriculum?: Record<string, { weeks?: WeekLike[] }>;
  /** data/curriculum/cma-skills.json sidecar — skills keyed "m1:w1" */
  cmaSkillsSidecar?: { weeks?: Record<string, { skills?: string[] }> };
  /** data/curriculum-cpa.json units */
  cpaUnits?: UnitLike[];
  /** data/curriculum-finance.json units */
  financeUnits?: UnitLike[];
}

function add(map: SkillMap, skill: string, ref: SkillLessonRef): void {
  const list = (map[skill] ??= []);
  if (!list.some((r) => r.href === ref.href)) list.push(ref);
}

/** Merge all curricula into skillId → [{track, title, href}]. */
export function buildSkillMap(sources: SkillMapSources): SkillMap {
  const map: SkillMap = {};

  // CMA — week-level skills come inline or from the cma-skills sidecar.
  for (const [monthId, month] of Object.entries(sources.cmaCurriculum ?? {})) {
    for (const week of month?.weeks ?? []) {
      const skills =
        week.skills && week.skills.length > 0
          ? week.skills
          : sources.cmaSkillsSidecar?.weeks?.[`${monthId}:${week.id}`]?.skills ?? [];
      for (const skill of skills) {
        add(map, skill, { track: "cma", title: week.title, href: `/learn/${monthId}/${week.id}` });
      }
    }
  }

  // CPA — skills are inline on tagged weeks (ISC/TCP); untagged weeks skipped.
  for (const unit of sources.cpaUnits ?? []) {
    for (const week of unit.weeks ?? []) {
      for (const skill of week.skills ?? []) {
        add(map, skill, { track: "cpa", title: week.title, href: `/cpa/${unit.id}/${week.id}` });
      }
    }
  }

  // Finance — all weeks carry inline skills.
  for (const unit of sources.financeUnits ?? []) {
    for (const week of unit.weeks ?? []) {
      for (const skill of week.skills ?? []) {
        add(map, skill, {
          track: "finance",
          title: week.title,
          href: `/finance/${unit.id}/${week.id}`,
        });
      }
    }
  }

  return map;
}
