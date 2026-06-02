// Single-user admin auth.
// Login flow: POST password to /api/login → if matches ADMIN_PASSWORD env var,
// set HttpOnly cookie `admin_session`. Middleware checks cookie presence on
// /admin/* and /api/save-*. Cookie is HttpOnly + Secure (in prod) + SameSite=Lax,
// so JS can't read it and CSRF is mitigated.

const COOKIE_NAME = 'admin_session';
const COOKIE_VALUE = 'ok'; // opaque marker; presence == authenticated
const ONE_WEEK = 60 * 60 * 24 * 7;

export function adminCookie() {
  return {
    name: COOKIE_NAME,
    value: COOKIE_VALUE,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ONE_WEEK,
  };
}

export function clearAdminCookie() {
  return { name: COOKIE_NAME, value: '', maxAge: 0, path: '/' };
}

export function isAuthenticated(request) {
  const c = request.cookies.get(COOKIE_NAME);
  return c?.value === COOKIE_VALUE;
}

export const COOKIE = { NAME: COOKIE_NAME, VALUE: COOKIE_VALUE };
