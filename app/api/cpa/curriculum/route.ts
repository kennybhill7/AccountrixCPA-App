import { NextResponse } from "next/server";
import { loadCpaCurriculum } from "@/lib/cpa-content";

/** GET /api/cpa/curriculum → the assembled CPA lesson curriculum ({ units: [...] }). */
export async function GET() {
  try {
    const curriculum = await loadCpaCurriculum();
    return NextResponse.json(curriculum);
  } catch {
    return NextResponse.json({ units: [] }, { status: 200 });
  }
}
