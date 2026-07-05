/**
 * Narrative grading — concept-checklist scoring with an anti-stuffing gate.
 *
 * Replaces flat keyword-presence grading (which "covenant DSCR headroom" ×3
 * defeats) for Apply Lab writeups, CPA TBS writeups, CMA essays, and
 * conversation sims. Two changes close the gaming hole:
 *
 *  1. Coverage counts DISTINCT concepts, each satisfiable by any of several
 *     alternates (synonyms/phrasings), so repeating one term earns nothing.
 *  2. A mandatory PROSE gate rejects keyword dumps: a real answer has a healthy
 *     unique-word ratio and function-word density; a term list has neither.
 *
 * Still fully deterministic and offline — no model call. It cannot judge
 * semantic correctness the way an examiner does; it raises the floor from
 * "listed the words" to "wrote a substantive, on-topic paragraph."
 */

export interface ConceptSpec {
  /** stable id for reporting */
  id: string;
  /** the concept is covered if ANY of these (case-insensitive) appears */
  anyOf: string[];
}

export interface NarrativeInput {
  /** rich concept checklist; preferred over keywords when present */
  concepts?: ConceptSpec[];
  /** legacy flat keyword list; each becomes a single-alternate concept */
  keywords?: string[];
  minWords?: number;
}

export interface NarrativeDimension {
  name: "coverage" | "depth" | "support" | "judgment" | "prose";
  ok: boolean;
  detail: string;
}

export interface NarrativeResult {
  passed: boolean;
  score: number;
  max: number;
  message: string;
  dimensions: NarrativeDimension[];
}

const FUNCTION_WORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being", "to", "of", "in", "on",
  "for", "and", "or", "but", "so", "because", "that", "this", "these", "those", "it", "its", "as",
  "with", "at", "by", "from", "than", "then", "which", "when", "if", "we", "i", "you", "they",
  "will", "would", "should", "could", "has", "have", "had", "not", "no", "their", "our", "into",
  "must", "may", "each", "any", "both", "there", "here", "about", "over", "under", "after", "before",
]);

function toConcepts(input: NarrativeInput): ConceptSpec[] {
  if (input.concepts && input.concepts.length > 0) return input.concepts;
  return (input.keywords ?? []).map((k) => ({ id: k, anyOf: [k] }));
}

function words(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

/** How many distinct concepts the answer covers (any alternate matches). */
export function conceptsCovered(answer: string, concepts: ConceptSpec[]): number {
  const lower = answer.toLowerCase();
  return concepts.filter((c) => c.anyOf.some((alt) => lower.includes(alt.toLowerCase()))).length;
}

/**
 * Prose gate: distinguishes a written paragraph from a keyword dump.
 * Short answers (< 6 words) skip the ratio/density checks — they fail on depth
 * anyway and cannot meaningfully stuff.
 */
export function isProse(answer: string): { ok: boolean; detail: string } {
  const w = words(answer.toLowerCase().replace(/[^a-z0-9\s]/g, " ")).filter(Boolean);
  const n = w.length;
  if (n < 6) return { ok: true, detail: "too short to assess" };

  const unique = new Set(w).size;
  const uniqueRatio = unique / n;
  const functionCount = w.filter((x) => FUNCTION_WORDS.has(x)).length;
  const functionFloor = Math.max(2, Math.floor(n * 0.12));

  const ok = uniqueRatio >= 0.45 && functionCount >= functionFloor;
  return {
    ok,
    detail: `unique ${Math.round(uniqueRatio * 100)}% (need 45%+), function words ${functionCount}/${functionFloor}`,
  };
}

export function gradeNarrativeText(answer: string, input: NarrativeInput): NarrativeResult {
  const concepts = toConcepts(input);
  const minWords = input.minWords ?? 0;
  const wordCount = words(answer).length;
  const covered = conceptsCovered(answer, concepts);
  const prose = isProse(answer);

  const dimensions: NarrativeDimension[] = [
    {
      name: "coverage",
      ok: concepts.length === 0 || covered / concepts.length >= 0.6,
      detail: `${covered}/${concepts.length} concepts`,
    },
    {
      name: "depth",
      ok: minWords === 0 || wordCount >= minWords,
      detail: `${wordCount}/${minWords || "any"} words`,
    },
    {
      name: "support",
      ok: /(\$|\d|%|account|acct|balance|ties|reconcile)/i.test(answer),
      detail: "numbers / accounts / tie-out evidence",
    },
    {
      name: "judgment",
      ok: /(because|therefore|so |thus|hence|risk|action|recommend|follow.?up|control|covenant|ready|conclude|should)/i.test(
        answer.toLowerCase()
      ),
      detail: "explains an implication or next action",
    },
    { name: "prose", ok: prose.ok, detail: prose.detail },
  ];

  const score = dimensions.filter((d) => d.ok).length;
  const coverageOk = dimensions[0].ok;
  // Mandatory gates: a real answer must be prose AND cover the concepts; then
  // needs 4 of 5 dimensions overall (i.e. two of depth/support/judgment).
  const passed = prose.ok && coverageOk && score >= 4;

  return {
    passed,
    score,
    max: dimensions.length,
    message: dimensions.map((d) => `${d.name} ${d.ok ? "ok" : "miss"} (${d.detail})`).join("; "),
    dimensions,
  };
}
