import { NextResponse } from 'next/server';
import { loadCurriculum } from '@/lib/content-loader';

export async function GET() {
  try {
    const curriculum = await loadCurriculum();
    return NextResponse.json(curriculum);
  } catch (error) {
    console.error('API Error loading curriculum:', error);
    return NextResponse.json(
      { error: 'Failed to load curriculum' },
      { status: 500 }
    );
  }
}