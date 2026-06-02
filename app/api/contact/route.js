import { NextResponse } from 'next/server';

// Contact-form submission. If RESEND_API_KEY is set in env, sends email via Resend;
// otherwise logs the payload to the server console and still returns success
// (dev-friendly: form works locally before any keys are configured).
export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad request' }, { status: 400 });
  }

  const { name, email, message, _gotcha } = body || {};

  // Honeypot — invisible field; bots fill it, humans don't.
  if (_gotcha) return NextResponse.json({ ok: true });

  const cleanName = (name || '').trim();
  const cleanEmail = (email || '').trim();
  const cleanMessage = (message || '').trim();

  if (!cleanName || !cleanEmail || !cleanMessage) {
    return NextResponse.json({ ok: false, error: 'Please fill in every field.' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return NextResponse.json({ ok: false, error: "That email doesn't look right." }, { status: 400 });
  }
  if (cleanMessage.length < 12) {
    return NextResponse.json({ ok: false, error: 'A sentence or two would help me understand.' }, { status: 400 });
  }

  const RESEND_KEY = process.env.RESEND_API_KEY;
  const TO = process.env.CONTACT_TO || 'hello@yourdomain.com';
  const FROM = process.env.CONTACT_FROM || 'portfolio@resend.dev';

  if (!RESEND_KEY) {
    console.log('[contact form] RESEND_API_KEY not set — logging payload only.');
    console.log({ name: cleanName, email: cleanEmail, message: cleanMessage });
    return NextResponse.json({ ok: true, devMode: true });
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: TO,
      reply_to: cleanEmail,
      subject: `New inquiry from ${cleanName}`,
      text: `From: ${cleanName} <${cleanEmail}>\n\n${cleanMessage}`,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    console.error('Resend failed:', res.status, errText);
    return NextResponse.json({ ok: false, error: 'Send failed. Try again, or drop me an email.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
