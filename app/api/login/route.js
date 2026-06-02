import { NextResponse } from 'next/server';
import { adminCookie } from '@/lib/auth';

export async function POST(request) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD env var is not set on the server' },
      { status: 500 }
    );
  }
  const { password } = await request.json().catch(() => ({}));
  if (!password || password !== expected) {
    // 400ms artificial delay to slow brute force; single-user, not a real concern but cheap.
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ error: 'wrong password' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(adminCookie());
  return res;
}
