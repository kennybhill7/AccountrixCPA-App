import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { loadWeek } from "@/lib/content-loader";

// data/curriculum/cma-skills.json sidecar: { weeks: { "m1:w1": { skills: [...] } } }
interface CmaSkillsSidecar {
  weeks?: Record<string, { skills?: string[] }>;
}

let sidecarCache: CmaSkillsSidecar | null | undefined;

async function loadCmaSkillsSidecar(): Promise<CmaSkillsSidecar | null> {
  if (sidecarCache !== undefined) return sidecarCache;
  try {
    const p = path.join(process.cwd(), "data", "curriculum", "cma-skills.json");
    sidecarCache = JSON.parse(await fs.readFile(p, "utf-8")) as CmaSkillsSidecar;
  } catch {
    // Sidecar is optional — weeks are still servable without skill tags.
    sidecarCache = null;
  }
  return sidecarCache;
}

// Serves a single week to client components (S1-C11). Attaches `skills` from
// the cma-skills sidecar when the curriculum week doesn't carry them inline,
// so quiz clients can tag AttemptEvents (FABLE5_ANALYSIS §4a).
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ monthId: string; weekId: string }> }
) {
  const { monthId, weekId } = await ctx.params;
  try {
    const week = await loadWeek(monthId, weekId);
    if (!week.skills) {
      const sidecar = await loadCmaSkillsSidecar();
      const skills = sidecar?.weeks?.[`${monthId}:${weekId}`]?.skills;
      if (skills?.length) {
        return NextResponse.json({ ...week, skills });
      }
    }
    return NextResponse.json(week);
  } catch (error) {
    console.error(`API Error loading week ${monthId}/${weekId}:`, error);
    return NextResponse.json({ error: "Week not found" }, { status: 404 });
  }
}
