import fs from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { loadCurriculum } from "@/lib/content-loader";
import { loadFinanceCurriculum } from "@/lib/finance-content";
import {
  cmaDiagnosticPool,
  DEFAULT_DIAGNOSTIC_PER_SECTION,
  financeDiagnosticPool,
  sampleDiagnosticItems,
  type DiagnosticItem,
} from "@/lib/diagnosticItems";
import { skillsForCpaItem } from "@/lib/cpaSkillMap";

const DATA_DIR = path.join(process.cwd(), "data");
const CPA_SECTIONS = ["FAR", "AUD", "REG", "BAR", "ISC", "TCP"];

async function loadCmaSkillSidecar(): Promise<Record<string, string[]>> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, "curriculum", "cma-skills.json"), "utf-8");
    const data = JSON.parse(raw) as { weeks?: Record<string, { skills?: string[] }> };
    return Object.fromEntries(
      Object.entries(data.weeks ?? {}).map(([key, value]) => [
        key,
        Array.isArray(value.skills) ? value.skills : [],
      ])
    );
  } catch {
    return {};
  }
}

async function cpaDiagnosticPool(): Promise<DiagnosticItem[]> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, "cpa", "items.json"), "utf-8");
    const data = JSON.parse(raw) as {
      sections?: Record<
        string,
        Array<{
          id: string;
          section: string;
          topic?: string;
          blueprintArea?: string;
          stem: string;
          choices: string[];
          answer: number;
        }>
      >;
    };

    return CPA_SECTIONS.flatMap((section) =>
      (data.sections?.[section] ?? []).map((item) => {
        const topic = [item.topic, item.blueprintArea].filter(Boolean).join(" ");
        return {
          id: `cpa:${section}:${item.id}`,
          track: "cpa" as const,
          section,
          sectionLabel: section,
          topic: item.topic || item.blueprintArea,
          stem: item.stem,
          choices: item.choices,
          answer: item.answer,
          skills: skillsForCpaItem(section, topic),
          href: "/crossover",
        };
      })
    );
  } catch (e) {
    console.error("diagnostic CPA pool error", e);
    return [];
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const perSection = Math.min(
    Math.max(Number(searchParams.get("perSection") ?? DEFAULT_DIAGNOSTIC_PER_SECTION), 1),
    5
  );

  try {
    const [curriculum, cmaSkillsByWeek, financeCurriculum, cpaItems] = await Promise.all([
      loadCurriculum(),
      loadCmaSkillSidecar(),
      loadFinanceCurriculum(),
      cpaDiagnosticPool(),
    ]);

    const pool = [
      ...financeDiagnosticPool(financeCurriculum.units),
      ...cmaDiagnosticPool(curriculum, cmaSkillsByWeek),
      ...cpaItems,
    ].filter((item) => item.choices.length >= 2 && item.answer >= 0);

    const items = sampleDiagnosticItems(pool, perSection);
    return NextResponse.json({
      perSection,
      available: pool.length,
      items,
    });
  } catch (e) {
    console.error("diagnostic items error", e);
    return NextResponse.json({ error: "Could not build diagnostic items." }, { status: 500 });
  }
}
