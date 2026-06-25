import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DIR = path.join(process.cwd(), 'data', 'ai', 'plan');

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  try {
    const p = path.join(DIR, `${userId}.json`);
    const txt = await fs.readFile(p, 'utf-8');
    return NextResponse.json(JSON.parse(txt));
  } catch (e) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body?.userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });
    await fs.mkdir(DIR, { recursive: true });
    const p = path.join(DIR, `${body.userId}.json`);
    await fs.writeFile(p, JSON.stringify(body, null, 2), 'utf-8');
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}

