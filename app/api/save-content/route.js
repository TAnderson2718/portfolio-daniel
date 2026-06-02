import { NextResponse } from 'next/server';
import { writeContent } from '@/lib/storage';

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
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
