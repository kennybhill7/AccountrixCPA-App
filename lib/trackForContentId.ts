/**
 * Single source of truth for "which track does this content id belong to."
 *
 * Unit/month id conventions across the three curricula builders:
 *   - CMA months:    m1 … m12            (scripts/build-curriculum.ts)
 *   - CPA units:     far-u1, aud-u2, reg-u3, bar-u1, isc-u2, tcp-u1
 *   - Finance units: finance-u1 … finance-u3 (scripts/build-finance-curriculum.ts)
 *
 * Two shipped bugs came from call sites guessing a "fin-" prefix; route every
 * new consumer through this helper instead of re-deriving the prefix.
 */

export type ContentTrack = "cma" | "cpa" | "finance";

export function trackForContentId(id: string | null | undefined): ContentTrack {
  if (!id) return "cma";
  if (id.startsWith("finance-")) return "finance";
  if (/^m\d+$/.test(id)) return "cma";
  return "cpa";
}

/** Lesson route for a month/unit + week id, e.g. ("far-u1","w2") → "/cpa/far-u1/w2". */
export function lessonHrefForContentId(monthId: string, weekId: string): string {
  const track = trackForContentId(monthId);
  if (track === "finance") return `/finance/${monthId}/${weekId}`;
  if (track === "cma") return `/learn/${monthId}/${weekId}`;
  return `/cpa/${monthId}/${weekId}`;
}
