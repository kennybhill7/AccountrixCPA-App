import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(_req: NextRequest, ctx: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await ctx.params;
  const DIR = path.join(process.cwd(), 'data', 'ai', 'assist');
  const file = path.join(DIR, `${sessionId}.json`);
  try {
    const txt = await fs.readFile(file, 'utf-8');
    return NextResponse.json(JSON.parse(txt));
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}

