/**
 * Per-week diagram config, keyed by `${monthId}:${weekId}` — same pattern as
 * WEEK_TOOLS in app/learn/[monthId]/[weekId]/page.tsx. Each entry sources its
 * numbers from a real, deterministic parametric generator (lib/parametricCma.ts),
 * never fabricated or scraped from prose. A fixed seed keeps the same numbers
 * on every load, so the diagram matches whatever the page renders around it.
 *
 * Populating this map is a manual, per-lesson editorial task, not automatable:
 * most CMA lesson prose is conceptual (no embedded dollar figures to parse),
 * and lesson JSON carries no skills/topic tags of its own — only the parametric
 * generators' own ProblemInstance.skills do. Check a candidate week's title
 * and lessonHtml by hand, confirm a generator genuinely matches the week's
 * topic, then add an entry. Skip weeks with no clean match — no diagram beats
 * a forced one.
 */
import { materialPriceVariance } from "./parametricCma";
import type { VarianceLineDiagramProps } from "@/components/diagrams/VarianceLineDiagram";

export type WeekDiagram = { kind: "variance-line"; props: VarianceLineDiagramProps };

function varianceLineFromMaterialPrice(seed: number): VarianceLineDiagramProps {
  const p = materialPriceVariance(seed);
  const { ap, sp } = p.params;
  return {
    label: "Direct-materials price variance",
    standardLabel: "Standard price",
    standardValue: sp,
    actualLabel: "Actual price",
    actualValue: ap,
    variance: p.answer,
    unit: "$",
    favorable: p.answer < 0,
  };
}

export const WEEK_DIAGRAMS: Record<string, WeekDiagram> = {
  "m3:w1": { kind: "variance-line", props: varianceLineFromMaterialPrice(3001) },
};
