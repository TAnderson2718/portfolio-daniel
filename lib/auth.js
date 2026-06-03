// Multi-user admin auth via a signed session cookie (JWT, HS256).
// The cookie holds { username, role } signed with SESSION_SECRET — stateless,
// so middleware (Edge) can verify it without a DB round-trip. jose works in
// both the Edge runtime (middleware) and Node runtime (API routes).
import { SignJWT, jwtVerify } from 'jose';

export const COOKIE_NAME = 'admin_session';
const ONE_WEEK = 60 * 60 * 24 * 7;

function secretKey() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error('SESSION_SECRET env var is not set.');
  return new TextEncoder().encode(s);
}

export async function createSessionCookie({ username, role }) {
  const token = await new SignJWT({ username, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey());
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ONE_WEEK,
  };
}

export function clearSessionCookie() {
  return { name: COOKIE_NAME, value: '', maxAge: 0, path: '/' };
}

// Reads + verifies the session cookie. Returns { username, role } or null.
// Works with both a NextRequest (request.cookies.get) and a plain token string.
export async function getSession(request) {
  const token = request?.cookies?.get?.(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (!payload?.username || !payload?.role) return null;
    return { username: payload.username, role: payload.role };
  } catch {
    return null;
  }
}
