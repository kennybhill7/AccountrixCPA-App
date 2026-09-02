import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { readJsonCached } from '@/lib/jsonCache';

/**
 * GET /api/cpa/items?section=FAR&n=10  (S1-C4)
 * Serves a random sample of CLEAN CPA-crossover items for a section, from the
 * JSON built by scripts/build-cpa-items.ts (which excludes template-broken items).
 */
const VALID = new Set(['FAR', 'AUD', 'REG', 'BAR', 'ISC', 'TCP']);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const section = (searchParams.get('section') || '').toUpperCase();
  const n = Math.min(Math.max(parseInt(searchParams.get('n') || '10', 10) || 10, 1), 50);
  if (!VALID.has(section)) {
    return NextResponse.json({ error: 'Invalid section. Use FAR, AUD, REG, BAR, ISC, or TCP.' }, { status: 400 });
  }
  try {
    const data = await readJsonCached<{ sections?: Record<string, unknown[]> }>(
      path.join(process.cwd(), 'data', 'cpa', 'items.json')
    );
    const pool: any[] = data?.sections?.[section] ?? [];
    if (pool.length === 0) {
      return NextResponse.json({ section, available: 0, items: [], note: 'No usable items for this section yet.' });
    }
    // Fisher–Yates sample
    const idx = pool.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    const items = idx.slice(0, n).map(i => pool[i]);
    return NextResponse.json({ section, available: pool.length, items });
  } catch (e) {
    console.error('cpa items error', e);
    return NextResponse.json({ error: 'Item bank not built. Run `npm run build:cpa-items`.' }, { status: 500 });
  }
}
