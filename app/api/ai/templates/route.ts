import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const FILE = path.join(process.cwd(), 'data', 'ai', 'templates', 'index.json');

export async function GET(_req: NextRequest) {
  try {
    const txt = await fs.readFile(FILE, 'utf-8');
    const data = JSON.parse(txt);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ version: 1, templates: [] });
  }
}

