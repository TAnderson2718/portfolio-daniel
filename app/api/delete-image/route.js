import { NextResponse } from 'next/server';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

// Extract public_id from a Cloudinary delivery URL.
//   https://res.cloudinary.com/<cloud>/image/upload/v1234/<public_id>.<ext>
//   → "<public_id>" (may contain folder/path)
// Tolerates an optional transform segment (we never store one, but be defensive).
function extractPublicId(url) {
  if (typeof url !== 'string') return null;
  // strip query/fragment if any
  const clean = url.split('?')[0].split('#')[0];
  // require a version segment so we don't accidentally try to delete by URL fragment
  const m = clean.match(/\/upload\/(?:[^/]+\/)?v\d+\/(.+)\.[^./]+$/);
  return m ? m[1] : null;
}

// Cloudinary signature: sha1 of "<sorted params>" + api_secret
function sign(params, secret) {
  const str = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');
  return createHash('sha1').update(str + secret).digest('hex');
}

export async function POST(request) {
  const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const API_KEY = process.env.CLOUDINARY_API_KEY;
  const API_SECRET = process.env.CLOUDINARY_API_SECRET;

  if (!CLOUD || !API_KEY || !API_SECRET) {
    return NextResponse.json(
      { error: 'Cloudinary env vars not configured (need CLOUD_NAME + API_KEY + API_SECRET)' },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid JSON' }, { status: 400 });
  }
  const { url, publicId } = body || {};
  const pid = publicId || extractPublicId(url);
  if (!pid) {
    return NextResponse.json({ error: 'cannot derive public_id from input' }, { status: 400 });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = sign({ public_id: pid, timestamp }, API_SECRET);

  const form = new URLSearchParams({
    public_id: pid,
    api_key: API_KEY,
    timestamp: String(timestamp),
    signature,
  });

  let cldRes, cldData;
  try {
    cldRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/destroy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    });
    cldData = await cldRes.json();
  } catch (e) {
    return NextResponse.json({ error: `Cloudinary request failed: ${e.message}` }, { status: 502 });
  }

  // Cloudinary returns { result: "ok" } on success or { result: "not found" } if the id doesn't exist.
  // We treat "not found" as success (idempotent — already gone).
  if (!cldRes.ok && cldData?.result !== 'not found') {
    return NextResponse.json(
      { error: cldData?.error?.message || `destroy failed (${cldRes.status})`, raw: cldData },
      { status: 502 }
    );
  }
  return NextResponse.json({ ok: true, publicId: pid, result: cldData.result || 'ok' });
}
