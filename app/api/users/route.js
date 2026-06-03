import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { listUsers, createUser, deleteUser, setPassword } from '@/lib/users';
import { logAction } from '@/lib/audit';

export const dynamic = 'force-dynamic';

// All user-management is super-only (also enforced in middleware — defense in depth).
async function requireSuper(request) {
  const s = await getSession(request);
  if (!s) return { res: NextResponse.json({ error: 'unauthorized' }, { status: 401 }) };
  if (s.role !== 'super') return { res: NextResponse.json({ error: 'forbidden' }, { status: 403 }) };
  return { session: s };
}

export async function GET(request) {
  const { res } = await requireSuper(request);
  if (res) return res;
  return NextResponse.json({ users: await listUsers() });
}

export async function POST(request) {
  const { session, res } = await requireSuper(request);
  if (res) return res;
  const { username, password, role } = await request.json().catch(() => ({}));
  try {
    const user = await createUser({ username, password, role });
    await logAction(session.username, 'user_create', `${user.username} (${user.role})`);
    return NextResponse.json({ ok: true, user });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  const { session, res } = await requireSuper(request);
  if (res) return res;
  const { username } = await request.json().catch(() => ({}));
  const target = String(username || '').trim().toLowerCase();
  if (!target) return NextResponse.json({ error: 'username required' }, { status: 400 });
  if (target === session.username) {
    return NextResponse.json({ error: "You can't delete your own account." }, { status: 400 });
  }
  await deleteUser(target);
  await logAction(session.username, 'user_delete', target);
  return NextResponse.json({ ok: true });
}

export async function PATCH(request) {
  const { session, res } = await requireSuper(request);
  if (res) return res;
  const { username, password } = await request.json().catch(() => ({}));
  try {
    await setPassword(username, password);
    await logAction(session.username, 'user_password_reset', String(username || '').trim().toLowerCase());
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
