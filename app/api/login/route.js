import { NextResponse } from 'next/server';
import { verifyUser } from '@/lib/users';
import { createSessionCookie } from '@/lib/auth';
import { logAction } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { username, password } = await request.json().catch(() => ({}));
  const u = String(username || '').trim().toLowerCase();
  const session = u && password ? await verifyUser(u, password) : null;

  if (!session) {
    await new Promise((r) => setTimeout(r, 400)); // slow down brute force
    await logAction(u || 'unknown', 'login_failed', '');
    return NextResponse.json({ error: 'Wrong username or password.' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, user: session });
  res.cookies.set(await createSessionCookie(session));
  await logAction(session.username, 'login', '');
  return res;
}
