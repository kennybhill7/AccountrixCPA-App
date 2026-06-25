import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { professorAssist } from "@/lib/professor-adapter";
import { searchContent } from "@/lib/content-loader";

const DIR = path.join(process.cwd(), "data", "ai", "assist");

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  if (!sessionId) return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  try {
    const p = path.join(DIR, `${sessionId}.json`);
    const txt = await fs.readFile(p, "utf-8");
    return NextResponse.json(JSON.parse(txt));
  } catch (e) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId: string = body?.userId || "demo-user";
    const input: string = body?.input || "";
    if (!input) return NextResponse.json({ error: "input required" }, { status: 400 });

    let result = await professorAssist(userId, input);
    if (!result) {
      // Local fallback: search lessons and craft simple suggestions
      const res = await searchContent(input);
      const top = res.weeks.slice(0, 3);
      result = {
        sessionId: `session-${Date.now()}`,
        userId,
        createdAt: Date.now(),
        input,
        suggestions: top.map((w) => ({
          type: "lesson" as const,
          title: w.week.title,
          description: "Related lesson matched by local search",
          mapping: { monthId: w.monthId, weekId: w.weekId },
          steps: [],
        })),
      };
    }

    await fs.mkdir(DIR, { recursive: true });
    const p = path.join(DIR, `${result.sessionId}.json`);
    await fs.writeFile(p, JSON.stringify(result, null, 2), "utf-8");
    return NextResponse.json(result);
  } catch (e) {
    console.error("assist error", e);
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 });
  }
}
