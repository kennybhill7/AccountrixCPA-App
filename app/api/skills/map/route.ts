import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { loadCurriculum } from "@/lib/content-loader";
import { loadCpaCurriculum } from "@/lib/cpa-content";
import { loadFinanceCurriculum } from "@/lib/finance-content";
import { buildSkillMap, type SkillMap, type SkillMapSources } from "@/lib/skillMap";

// data/curriculum/cma-skills.json sidecar: { weeks: { "m1:w1": { skills: [...] } } }
type CmaSkillsSidecar = SkillMapSources["cmaSkillsSidecar"];

let mapCache: SkillMap | null = null;

async function loadCmaSkillsSidecar(): Promise<CmaSkillsSidecar> {
  try {
    const p = path.join(process.cwd(), "data", "curriculum", "cma-skills.json");
    return JSON.parse(await fs.readFile(p, "utf-8")) as CmaSkillsSidecar;
  } catch {
    // Sidecar is optional — the map still builds from inline week skills.
    return undefined;
  }
}

/**
 * Skill → lesson map (FABLE5_ANALYSIS §5 Week 3): merges the CMA, CPA, and
 * Finance curricula (plus the cma-skills sidecar) into
 * Record<skillId, Array<{track, title, href}>>. Cached at module scope —
 * curricula only change on deploy.
 */
export async function GET() {
  if (mapCache) return NextResponse.json(mapCache);

  const sources: SkillMapSources = {};

  try {
    sources.cmaCurriculum = await loadCurriculum();
  } catch {
    // CMA aggregate missing — serve what the other tracks provide.
  }
  sources.cmaSkillsSidecar = await loadCmaSkillsSidecar();
  sources.cpaUnits = (await loadCpaCurriculum()).units;
  sources.financeUnits = (await loadFinanceCurriculum()).units;

  mapCache = buildSkillMap(sources);
  return NextResponse.json(mapCache);
}
