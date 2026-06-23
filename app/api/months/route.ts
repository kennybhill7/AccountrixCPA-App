import { NextResponse } from "next/server";
import { loadCurriculumIndex, hasData } from "@/lib/content-loader";

// Serves the curriculum index + data-presence flag to client components
// (which must not import the fs-based loaders directly). S1-C11.
export async function GET() {
  try {
    const has = await hasData();
    if (!has) return NextResponse.json({ hasData: false, index: null });
    const index = await loadCurriculumIndex();
    return NextResponse.json({ hasData: true, index });
  } catch (error) {
    console.error("API Error loading months overview:", error);
    return NextResponse.json({ error: "Failed to load curriculum" }, { status: 500 });
  }
}
