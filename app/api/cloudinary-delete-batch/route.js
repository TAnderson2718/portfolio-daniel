import { NextResponse } from 'next/server';
import { destroyMany } from '@/lib/cloudinary-admin';
import { getSession } from '@/lib/auth';
import { logAction } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid JSON' }, { status: 400 });
  }
  const { publicIds } = body || {};
  if (!Array.isArray(publicIds) || publicIds.length === 0) {
    return NextResponse.json({ error: 'publicIds must be a non-empty array' }, { status: 400 });
  }
  if (publicIds.length > 500) {
    return NextResponse.json({ error: 'too many at once (max 500)' }, { status: 400 });
  }

  try {
    const result = await destroyMany(publicIds);
    const deleted = Object.entries(result.deleted || {}).filter(([, v]) => v === 'deleted').length;
    const s = await getSession(request);
    await logAction(s?.username, 'image_delete_batch', `${deleted} image(s)`);
    return NextResponse.json({ ok: true, deleted, partial: result.partial, raw: result.deleted });
  } catch (e) {
    return NextResponse.json({ error: e.message, raw: e.raw }, { status: e.status || 500 });
  }
}
