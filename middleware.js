import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';

const PROTECTED_PREFIXES = ['/admin'];
const PROTECTED_API = [
  '/api/save-content',
  '/api/content',
  '/api/delete-image',
  '/api/cloudinary-usage',
  '/api/cloudinary-orphans',
  '/api/cloudinary-delete-batch',
];
const PUBLIC_ADMIN_PATHS = ['/admin/login'];

export function middleware(request) {
  const path = request.nextUrl.pathname;

  const needsAuth =
    (PROTECTED_PREFIXES.some((p) => path.startsWith(p)) && !PUBLIC_ADMIN_PATHS.includes(path)) ||
    PROTECTED_API.includes(path);

  if (!needsAuth) return NextResponse.next();
  if (isAuthenticated(request)) return NextResponse.next();

  // API: 401. Pages: redirect to login.
  if (path.startsWith('/api/')) {
    return new NextResponse(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const url = request.nextUrl.clone();
  url.pathname = '/admin/login';
  url.searchParams.set('from', path);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/save-content',
    '/api/content',
    '/api/delete-image',
    '/api/cloudinary-usage',
    '/api/cloudinary-orphans',
    '/api/cloudinary-delete-batch',
  ],
};
