import { NextRequest, NextResponse } from "next/server";
import { getMergedCurriculum } from "@/lib/curriculum";

export async function GET(_req: NextRequest) {
  try {
    const data = await getMergedCurriculum();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "Failed to merge curriculum" }, { status: 500 });
  }
}
