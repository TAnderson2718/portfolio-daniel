import { NextResponse } from 'next/server';
import { countUsers, createUser } from '@/lib/users';
import { logAction } from '@/lib/audit';

export const dynamic = 'force-dynamic';

// One-time bootstrap: create the first super-admin.
// Gated by SETUP_KEY env AND only works while there are zero users, so it
// self-disables after the first account exists. Remove SETUP_KEY afterwards.
export async function POST(request) {
  const setupKey = process.env.SETUP_KEY;
  if (!setupKey) return NextResponse.json({ error: 'SETUP_KEY is not set on the server.' }, { status: 500 });
  const { key, username, password } = await request.json().catch(() => ({}));
  if (key !== setupKey) return NextResponse.json({ error: 'Invalid setup key.' }, { status: 401 });
  if ((await countUsers()) > 0) {
    return NextResponse.json({ error: 'Users already exist — seeding is disabled.' }, { status: 400 });
  }
  try {
    const user = await createUser({ username, password, role: 'super' });
    await logAction(user.username, 'seed_super', 'first super-admin created');
    return NextResponse.json({ ok: true, user });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
