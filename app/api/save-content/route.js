import { NextResponse } from 'next/server';
import { writeContent } from '@/lib/storage';
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
  const { content, message } = body || {};
  if (!content || typeof content !== 'object') {
    return NextResponse.json({ error: 'content is required and must be an object' }, { status: 400 });
  }
  try {
    const result = await writeContent(content, { message });
    const s = await getSession(request);
    await logAction(s?.username, 'content_save', message || result.mode || 'saved content');
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
