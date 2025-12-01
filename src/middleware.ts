import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Public paths that don't need auth
  const isPublicPath =
    pathname === '/' ||
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/share/') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/demo') ||
    pathname.startsWith('/privacy') ||
    pathname.startsWith('/terms') ||
    pathname.startsWith('/imprint');

  // Protected paths - redirect to signin if not logged in
  const isProtectedPath =
    pathname.startsWith('/dashboard') || pathname.startsWith('/calendar');

  if (isProtectedPath && !isLoggedIn) {
    const url = req.nextUrl.clone();
    url.pathname = '/auth/signin';
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

// Only run middleware on specific paths to reduce bundle size
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, robots.txt, etc. (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
  ],
};
