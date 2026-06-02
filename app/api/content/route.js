import { NextResponse } from 'next/server';
import { readContent } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const content = await readContent();
    return NextResponse.json(content);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
