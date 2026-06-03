import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { listAudit } from '@/lib/audit';

export const dynamic = 'force-dynamic';

// Audit log is super-only.
export async function GET(request) {
  const s = await getSession(request);
  if (!s) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (s.role !== 'super') return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '100', 10);
  return NextResponse.json({ entries: await listAudit(Number.isFinite(limit) ? limit : 100) });
}
