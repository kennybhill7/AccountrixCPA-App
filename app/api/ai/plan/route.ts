import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { safeId } from "@/lib/safeId";

const DIR = path.join(process.cwd(), "data", "ai", "plan");

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = safeId(searchParams.get("userId"));
  if (!userId) return NextResponse.json({ error: "Missing or invalid userId" }, { status: 400 });
  try {
    const p = path.join(DIR, `${userId}.json`);
    const txt = await fs.readFile(p, "utf-8");
    return NextResponse.json(JSON.parse(txt));
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = safeId(body?.userId);
    if (!userId) return NextResponse.json({ error: "valid userId required" }, { status: 400 });
    await fs.mkdir(DIR, { recursive: true });
    const p = path.join(DIR, `${userId}.json`);
    await fs.writeFile(p, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
