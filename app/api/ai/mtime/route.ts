import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const ROOT = path.join(process.cwd(), "data", "ai");

async function latestMTime(dir: string): Promise<number> {
  let latest = 0;
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      try {
        const stat = await fs.stat(full);
        if (entry.isDirectory()) {
          const sub = await latestMTime(full);
          if (sub > latest) latest = sub;
        } else {
          const m = stat.mtimeMs || stat.mtime.getTime();
          if (m > latest) latest = m;
        }
      } catch {}
    }
  } catch {}
  return latest || Date.now();
}

export async function GET(_req: NextRequest) {
  const mtime = await latestMTime(ROOT);
  return NextResponse.json({ mtime });
}
