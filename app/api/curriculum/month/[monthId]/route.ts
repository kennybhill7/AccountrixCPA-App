import { NextResponse } from "next/server";
import { loadMonth } from "@/lib/content-loader";

// Serves a single month to client components (S1-C11).
export async function GET(_req: Request, ctx: { params: Promise<{ monthId: string }> }) {
  const { monthId } = await ctx.params;
  try {
    const month = await loadMonth(monthId);
    return NextResponse.json(month);
  } catch (error) {
    console.error(`API Error loading month ${monthId}:`, error);
    return NextResponse.json({ error: "Month not found" }, { status: 404 });
  }
}
