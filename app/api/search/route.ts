import { NextRequest, NextResponse } from "next/server";
import { searchContent } from "@/lib/content-loader";

// Serves content search to client components (searchContent uses fs via the
// curriculum loader, so it must run server-side). S1-C11.
export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get("q")?.trim() || "";
  if (!q) return NextResponse.json({ months: [], weeks: [] });
  try {
    const results = await searchContent(q);
    return NextResponse.json(results);
  } catch (error) {
    console.error("API Error searching content:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
