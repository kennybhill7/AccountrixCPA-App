import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const DIR = path.join(process.cwd(), 'data', 'ai', 'custom-lessons');
  const file = path.join(DIR, `${id}.json`);
  try {
    const txt = await fs.readFile(file, 'utf-8');
    return NextResponse.json(JSON.parse(txt));
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}

