import { NextResponse } from 'next/server';
import { getDataStats } from '@/lib/content-loader';

export async function GET() {
  try {
    const stats = await getDataStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('API Error loading stats:', error);
    return NextResponse.json(
      { error: 'Failed to load stats' },
      { status: 500 }
    );
  }
}