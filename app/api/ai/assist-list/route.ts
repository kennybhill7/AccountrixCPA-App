import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DIR = path.join(process.cwd(), "data", "ai", "assist");

export async function GET(_req: NextRequest) {
  try {
    const entries = await fs.readdir(DIR, { withFileTypes: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessions: any[] = [];
    for (const e of entries) {
      if (!e.isFile() || !e.name.endsWith(".json")) continue;
      const file = path.join(DIR, e.name);
      try {
        const txt = await fs.readFile(file, "utf-8");
        const data = JSON.parse(txt);
        sessions.push({
          sessionId: data.sessionId || e.name.replace(/\.json$/, ""),
          userId: data.userId || null,
          createdAt: data.createdAt || null,
          input: data.input || "",
          suggestions: Array.isArray(data.suggestions) ? data.suggestions.length : 0,
        });
      } catch {}
    }
    sessions.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    return NextResponse.json({ sessions });
  } catch {
    return NextResponse.json({ sessions: [] });
  }
}
