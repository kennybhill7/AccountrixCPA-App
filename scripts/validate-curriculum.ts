#!/usr/bin/env tsx
/**
 * validate-curriculum.ts — the content gate for Codex-authored curriculum.
 *
 * Validates the content the app ACTUALLY renders against the canonical Zod
 * schemas in lib/schemas.ts:
 *   - data/curriculum.json        (merged curriculum → CurriculumSchema)
 *   - data/m{1..12}.json          (per-month authoring files → MonthSchema)
 *   - data/months/m{1..12}.json   (alt copies, if present → MonthSchema)
 *   - data/knowledge/*.json       (per-week overlays → loose overlay shape)
 *   - data/curriculum (recursed) .json  (exemplars / staged weeks → WeekSchema)
 *
 * Plus accounting-content lints (warnings, not hard failures):
 *   - every week has >= 1 flashcard and a non-trivial lessonHtml
 *   - every quiz has >= 1 question; each question's `answer` index is in range
 *     (schema enforces this too — surfaced here as a friendly message)
 *
 * Exit code: 0 = all schemas pass, 1 = at least one schema error.
 * Run: npm run validate:content
 */
import * as fs from "fs";
import * as path from "path";
import { z } from "zod";
import {
  MonthSchema,
  CurriculumSchema,
  WeekSchema,
  FlashcardSchema,
  QuizSchema,
} from "../lib/schemas";

const DATA = path.join(process.cwd(), "data");

// Overlay files (data/knowledge/*.json) may partially override a week.
const OverlaySchema = z.object({
  id: z.string().regex(/^m([1-9]|1[0-2])[:/-]w[1-4]$/, 'overlay id must be like "m4:w2"'),
  title: z.string().optional(),
  lessonHtml: z.string().optional(),
  flashcards: z.array(FlashcardSchema).optional(),
  quiz: QuizSchema.optional(),
});

let errorCount = 0;
let warnCount = 0;
let okCount = 0;
let legacyCount = 0;
const fail = (where: string, msg: string) => {
  errorCount++;
  console.log(`  ❌ ${where}: ${msg}`);
};
const warn = (where: string, msg: string) => {
  warnCount++;
  console.log(`  ⚠️  ${where}: ${msg}`);
};
const ok = (where: string) => {
  okCount++;
  console.log(`  ✅ ${where}`);
};
// Legacy v1 (construction CFO) content predates lib/schemas.ts and will be replaced
// week-by-week by the CMA authoring. Its schema misses are reported, not blocking.
const legacy = (where: string, msg: string) => {
  legacyCount++;
  console.log(`  ⓘ  [legacy v1] ${where}: ${msg}`);
};

function readJson(file: string): unknown {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

/** zod error → compact "path: message" lines */
function zerr(e: z.ZodError): string {
  return e.issues
    .map((i) => `${i.path.join(".") || "(root)"} — ${i.message}`)
    .slice(0, 8)
    .join("; ");
}

/** number of words in lessonHtml after stripping tags + entities */
function lessonWordCount(html: string): number {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text ? text.split(" ").filter(Boolean).length : 0;
}

const MIN_LESSON_WORDS = 1200; // CURRICULUM_SPEC.md mandatory floor (aim 1,200–2,000)

/**
 * content lints on a validated Week.
 * enforceDepth=true (newly-authored data/curriculum/** weeks) makes the
 * 1,200-word lesson floor a BLOCKING error instead of a soft warning — S1-C13.
 */
function lintWeek(label: string, w: z.infer<typeof WeekSchema>, enforceDepth = false) {
  if (!w.flashcards || w.flashcards.length < 1) warn(label, "no flashcards");
  const words = lessonWordCount(w.lessonHtml);
  if (enforceDepth) {
    if (words < MIN_LESSON_WORDS)
      fail(
        label,
        `lesson is ${words} words — below the mandatory ${MIN_LESSON_WORDS}-word floor (expand it)`
      );
  } else if (w.lessonHtml.replace(/<[^>]*>/g, "").trim().length < 400) {
    warn(label, "lessonHtml looks thin (<400 chars of text) — aim for 1,200–2,000 words");
  }
  if (!w.quiz || w.quiz.questions.length < 1) {
    warn(label, "quiz has no questions");
  } else {
    w.quiz.questions.forEach((q, i) => {
      if (q.answer >= q.choices.length)
        fail(label, `quiz Q${i + 1} answer index ${q.answer} out of range`);
      if (!q.explain) warn(label, `quiz Q${i + 1} has no explanation`);
    });
  }
}

function validateMonthFile(file: string, label: string, isLegacy = false) {
  const report = isLegacy ? legacy : fail;
  let data: unknown;
  try {
    data = readJson(file);
  } catch (e: unknown) {
    return report(label, `invalid JSON — ${e instanceof Error ? e.message : String(e)}`);
  }
  const r = MonthSchema.safeParse(data);
  if (!r.success) return report(label, zerr(r.error));
  ok(label);
  r.data.weeks.forEach((w) => lintWeek(`${label} ${w.id}`, w));
}

console.log("\n🔍 Validating curriculum against lib/schemas.ts\n");

// 1) merged curriculum (legacy v1 render target — reported, not blocking)
console.log("curriculum.json (merged → CurriculumSchema) [legacy v1]");
const curPath = path.join(DATA, "curriculum.json");
if (fs.existsSync(curPath)) {
  try {
    const r = CurriculumSchema.safeParse(readJson(curPath));
    if (!r.success) legacy("curriculum.json", zerr(r.error));
    else {
      ok("curriculum.json");
      Object.entries(r.data).forEach(([m, mo]) =>
        mo.weeks.forEach((w) => lintWeek(`${m} ${w.id}`, w))
      );
    }
  } catch (e: unknown) {
    legacy("curriculum.json", `invalid JSON — ${e instanceof Error ? e.message : String(e)}`);
  }
} else warn("curriculum.json", "not found (app loadCurriculum() reads this)");

// 2) per-month files at data root (legacy v1)
console.log("\nper-month files data/m{1..12}.json (→ MonthSchema) [legacy v1]");
for (let m = 1; m <= 12; m++) {
  const f = path.join(DATA, `m${m}.json`);
  if (fs.existsSync(f)) validateMonthFile(f, `m${m}.json`, true);
  else warn(`m${m}.json`, "missing");
}

// 3) alt copies under data/months (legacy v1)
const monthsDir = path.join(DATA, "months");
if (fs.existsSync(monthsDir)) {
  console.log("\nalt copies data/months/m{N}.json (→ MonthSchema) [legacy v1]");
  for (const f of fs.readdirSync(monthsDir).filter((n) => /^m\d{1,2}\.json$/.test(n)))
    validateMonthFile(path.join(monthsDir, f), `months/${f}`, true);
}

// 4) knowledge overlays
const kDir = path.join(DATA, "knowledge");
if (fs.existsSync(kDir)) {
  console.log("\nknowledge overlays data/knowledge/*.json (→ OverlaySchema)");
  const overlays = fs.readdirSync(kDir).filter((n) => n.endsWith(".json"));
  if (overlays.length === 0) console.log("  (none)");
  for (const n of overlays) {
    try {
      const r = OverlaySchema.safeParse(readJson(path.join(kDir, n)));
      if (!r.success) fail(`knowledge/${n}`, zerr(r.error));
      else ok(`knowledge/${n}`);
    } catch (e: unknown) {
      fail(`knowledge/${n}`, `invalid JSON — ${e instanceof Error ? e.message : String(e)}`);
    }
  }
}

// 5) staged weeks / exemplars under data/curriculum/**
const stageDir = path.join(DATA, "curriculum");
if (fs.existsSync(stageDir)) {
  const walk = (d: string): string[] =>
    fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
      const p = path.join(d, e.name);
      return e.isDirectory() ? walk(p) : e.name.endsWith(".json") ? [p] : [];
    });
  const staged = walk(stageDir).filter((p) =>
    /w[1-4].*\.json$|\.exemplar\.json$/.test(path.basename(p))
  );
  if (staged.length) {
    console.log("\nstaged weeks data/curriculum/**/*.json (→ WeekSchema)");
    for (const p of staged) {
      const label = path.relative(DATA, p);
      try {
        const r = WeekSchema.safeParse(readJson(p));
        if (!r.success) fail(label, zerr(r.error));
        else {
          ok(label);
          lintWeek(label, r.data, true);
        }
      } catch (e: unknown) {
        fail(label, `invalid JSON — ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  }
}

console.log(`\n────────────────────`);
console.log(
  `✅ ${okCount} passed   ⚠️  ${warnCount} warnings   ⓘ  ${legacyCount} legacy-v1 (non-blocking)   ❌ ${errorCount} blocking errors`
);
if (legacyCount > 0)
  console.log(`   (legacy-v1 = old construction content awaiting CMA replacement; not gated)`);
if (errorCount > 0) {
  console.log("\nFAILED — fix the blocking schema errors before requesting review.\n");
  process.exit(1);
}
console.log("\nPASS — all newly-authored content conforms to lib/schemas.ts.\n");
