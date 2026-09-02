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

export interface ExpectedConclusionSpec {
  /** stable id for reporting */
  id: string;
  /** the expected conclusion is supported if ANY of these appears */
  anyOf: string[];
  /** any of these phrases makes the conclusion fail, even if concepts are present */
  noneOf?: string[];
}

export interface NarrativeInput {
  /** rich concept checklist; preferred over keywords when present */
  concepts?: ConceptSpec[];
  /**
   * Optional expected conclusion check. This is intentionally separate from
   * concepts: an answer can mention the right concepts while reaching the
   * wrong conclusion ("DSCR is below the covenant" when it is above it).
   */
  conclusions?: ExpectedConclusionSpec[];
  /** legacy flat keyword list; each becomes a single-alternate concept */
  keywords?: string[];
  minWords?: number;
}

export interface NarrativeDimension {
  name: "coverage" | "depth" | "support" | "judgment" | "prose" | "conclusion";
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
  "the",
  "a",
  "an",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "to",
  "of",
  "in",
  "on",
  "for",
  "and",
  "or",
  "but",
  "so",
  "because",
  "that",
  "this",
  "these",
  "those",
  "it",
  "its",
  "as",
  "with",
  "at",
  "by",
  "from",
  "than",
  "then",
  "which",
  "when",
  "if",
  "we",
  "i",
  "you",
  "they",
  "will",
  "would",
  "should",
  "could",
  "has",
  "have",
  "had",
  "not",
  "no",
  "their",
  "our",
  "into",
  "must",
  "may",
  "each",
  "any",
  "both",
  "there",
  "here",
  "about",
  "over",
  "under",
  "after",
  "before",
]);

function toConcepts(input: NarrativeInput): ConceptSpec[] {
  if (input.concepts && input.concepts.length > 0) return input.concepts;
  return (input.keywords ?? []).map((k) => ({ id: k, anyOf: [k] }));
}

function words(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

/**
 * True if `phrase` occurs in `lowerAnswer` as its own figure rather than inside
 * a larger number. Plain substring matching credited "$30" to an answer that
 * only ever wrote "$300,000", and "500" to one that wrote "$18,500" — so a
 * learner earned concept credit for figures they never computed. Only
 * digit-bearing alternates are boundary-checked; prose alternates are unchanged.
 */
export function containsFigure(lowerAnswer: string, phrase: string): boolean {
  if (!/\d/.test(phrase)) return lowerAnswer.includes(phrase);
  let pos = lowerAnswer.indexOf(phrase);
  while (pos !== -1) {
    const before = pos > 0 ? lowerAnswer[pos - 1] : "";
    const after = lowerAnswer[pos + phrase.length] ?? "";
    const afterNext = lowerAnswer[pos + phrase.length + 1] ?? "";
    const glued =
      /[0-9]/.test(before) ||
      // a decimal point or thousands comma immediately before the match means
      // we are standing inside a longer figure, e.g. "500" within "18,500"
      ((before === "." || before === ",") && /[0-9]/.test(lowerAnswer[pos - 2] ?? "")) ||
      /[0-9]/.test(after) ||
      ((after === "." || after === ",") && /[0-9]/.test(afterNext));
    if (!glued) return true;
    pos = lowerAnswer.indexOf(phrase, pos + phrase.length);
  }
  return false;
}

/** How many distinct concepts the answer covers (any alternate matches). */
export function conceptsCovered(answer: string, concepts: ConceptSpec[]): number {
  const lower = answer.toLowerCase();
  return concepts.filter((c) => c.anyOf.some((alt) => containsFigure(lower, alt.toLowerCase())))
    .length;
}

function conclusionCheck(
  answer: string,
  conclusions: ExpectedConclusionSpec[] = []
): { ok: boolean; detail: string } | null {
  if (conclusions.length === 0) return null;
  const lower = answer.toLowerCase();
  let supported = 0;
  const contradicted: string[] = [];

  for (const c of conclusions) {
    // Support must be asserted UNNEGATED too: "not accept the project" no longer
    // counts as supporting "accept the project" (symmetric with the blockers).
    const hasSupport = c.anyOf.some((alt) => hasUnnegatedPhrase(lower, alt.toLowerCase()));
    const blockers = (c.noneOf ?? []).filter((alt) => hasUnnegatedPhrase(lower, alt.toLowerCase()));
    if (hasSupport && blockers.length === 0) supported += 1;
    if (blockers.length > 0) contradicted.push(`${c.id}: ${blockers.join(", ")}`);
  }

  const ok = contradicted.length === 0 && supported === conclusions.length;
  return {
    ok,
    detail:
      contradicted.length > 0
        ? `contradiction (${contradicted.join("; ")})`
        : `${supported}/${conclusions.length} expected conclusions`,
  };
}

/**
 * True if `lowerPhrase` appears at least once WITHOUT an immediately preceding
 * negation. Handles single-word negators, contractions (isn't, doesn't, …), and
 * two-word negators (rather than, instead of). The window is the ~24 preceding
 * characters, so only a directly-adjacent negation counts — "not immune to"
 * negates "immune to", but "not entirely immune to" does not (accepted limit).
 */
const NEGATOR_BEFORE =
  /(?:^|\s)(?:not|no|never|neither|nor|without|cannot|can['’]?t|isn['’]?t|aren['’]?t|wasn['’]?t|weren['’]?t|don['’]?t|doesn['’]?t|didn['’]?t|rather than|instead of|far from|other than)(?:\s+(?:a|an|the))?\s*$/;
// An article between the negator and the phrase is invisible to the reader but
// used to defeat this check: "not a prior period adjustment" was scored as
// asserting "prior period adjustment".

/**
 * A negating determiner sits one noun away from the phrase it negates:
 * "neither method changes the total" negates "changes the total", but the
 * adjacent-negator pattern above cannot see past "method". Restricted to
 * determiners that are unambiguously negative — a bare "no" is excluded
 * because "no doubt the project should be accepted" is an affirmation.
 */
const NEGATING_DETERMINER_BEFORE = /(?:^|\s)(?:neither|nor|none of)\s+\S+\s*$/;

function hasUnnegatedPhrase(lowerAnswer: string, lowerPhrase: string): boolean {
  // A numeric conclusion must match as its own figure. Without this, the
  // conclusion "frees $6,000,000" was satisfied by the scenario's own
  // "$146,000,000" of sales — the gate passed on a number the learner was
  // handed rather than one they derived.
  if (/\d/.test(lowerPhrase) && !containsFigure(lowerAnswer, lowerPhrase)) return false;
  let pos = lowerAnswer.indexOf(lowerPhrase);
  while (pos !== -1) {
    let prior = lowerAnswer.slice(Math.max(0, pos - 24), pos);
    // A negator only counts if it is in the SAME clause — don't let a "not"
    // from a previous sentence/clause negate this phrase. Keep only the text
    // after the last clause boundary.
    const boundary = Math.max(
      prior.lastIndexOf("."),
      prior.lastIndexOf(";"),
      prior.lastIndexOf("!"),
      prior.lastIndexOf("?"),
      prior.lastIndexOf(",")
    );
    if (boundary !== -1) prior = prior.slice(boundary + 1);
    if (!NEGATOR_BEFORE.test(prior) && !NEGATING_DETERMINER_BEFORE.test(prior)) return true;
    pos = lowerAnswer.indexOf(lowerPhrase, pos + lowerPhrase.length);
  }
  return false;
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
  const conclusion = conclusionCheck(answer, input.conclusions);

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
  if (conclusion) {
    dimensions.push({ name: "conclusion", ok: conclusion.ok, detail: conclusion.detail });
  }

  const score = dimensions.filter((d) => d.ok).length;
  const coverageOk = dimensions[0].ok;
  const conclusionOk = conclusion?.ok ?? true;
  // Mandatory gates: a real answer must be prose, cover the concepts, and hit
  // any expected conclusion; then it needs all but one dimension overall.
  const passed = prose.ok && coverageOk && conclusionOk && score >= dimensions.length - 1;

  return {
    passed,
    score,
    max: dimensions.length,
    message: dimensions.map((d) => `${d.name} ${d.ok ? "ok" : "miss"} (${d.detail})`).join("; "),
    dimensions,
  };
}
