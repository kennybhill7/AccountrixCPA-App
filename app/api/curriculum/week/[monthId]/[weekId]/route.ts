import { NextResponse } from "next/server";
import { loadWeek } from "@/lib/content-loader";

// Serves a single week to client components (S1-C11).
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ monthId: string; weekId: string }> }
) {
  const { monthId, weekId } = await ctx.params;
  try {
    const week = await loadWeek(monthId, weekId);
    return NextResponse.json(week);
  } catch (error) {
    console.error(`API Error loading week ${monthId}/${weekId}:`, error);
    return NextResponse.json({ error: "Week not found" }, { status: 404 });
  }
}
