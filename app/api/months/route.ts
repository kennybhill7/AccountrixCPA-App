import { NextResponse } from "next/server";
import { loadCurriculum, hasData } from "@/lib/content-loader";

// Serves a month overview derived from data/curriculum.json (the single content
// source of truth) to client components, which must not import the fs-based
// loaders directly. Replaces the deleted curriculum-index.json. S1-C11 / P0-4.
export async function GET() {
  try {
    const has = await hasData();
    if (!has) return NextResponse.json({ hasData: false, index: null });

    const curriculum = await loadCurriculum();
    const months = Object.entries(curriculum)
      .map(([id, month], i) => ({
        id,
        order: Number(id.replace(/^m/, "")) || i + 1,
        title: month.title,
        weeks: month.weeks?.length ?? 0,
        lessons: month.weeks?.length ?? 0,
      }))
      .sort((a, b) => a.order - b.order);

    return NextResponse.json({ hasData: true, index: { months } });
  } catch (error) {
    console.error("API Error loading months overview:", error);
    return NextResponse.json({ error: "Failed to load curriculum" }, { status: 500 });
  }
}
