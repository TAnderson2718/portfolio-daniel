import { NextResponse } from 'next/server';
import { clearSessionCookie, getSession } from '@/lib/auth';
import { logAction } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const s = await getSession(request);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(clearSessionCookie());
  if (s) await logAction(s.username, 'logout', '');
  return res;
}
