import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

const PROTECTED_API = [
  '/api/save-content',
  '/api/content',
  '/api/delete-image',
  '/api/cloudinary-usage',
  '/api/cloudinary-orphans',
  '/api/cloudinary-delete-batch',
  '/api/users',
  '/api/audit',
];
// super-admin only
const SUPER_ONLY = ['/api/users', '/api/audit'];
const PUBLIC_ADMIN_PATHS = ['/admin/login'];

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const isApi = path.startsWith('/api/');

  const needsAuth =
    (path.startsWith('/admin') && !PUBLIC_ADMIN_PATHS.includes(path)) ||
    PROTECTED_API.includes(path);
  if (!needsAuth) return NextResponse.next();

  const session = await getSession(request);

  if (!session) {
    if (isApi) {
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

  if (SUPER_ONLY.includes(path) && session.role !== 'super') {
    return new NextResponse(JSON.stringify({ error: 'forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return NextResponse.next();
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
    '/api/users',
    '/api/audit',
  ],
};
