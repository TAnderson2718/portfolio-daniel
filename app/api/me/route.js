import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Current logged-in user (for the admin UI to know who/what role).
export async function GET(request) {
  const s = await getSession(request);
  if (!s) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  return NextResponse.json({ user: s });
}
