import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check for ANY NextAuth session cookie (works in both dev and production)
  const cookieHeader = request.headers.get('cookie') || '';
  const hasSessionToken = 
    cookieHeader.includes('next-auth.session-token=') ||
    cookieHeader.includes('__Secure-next-auth.session-token=') ||
    cookieHeader.includes('authjs.session-token=') ||
    cookieHeader.includes('__Secure-authjs.session-token=');

  // Protected paths - redirect to signin if no token
  if (
    !hasSessionToken &&
    (pathname.startsWith('/dashboard') || pathname.startsWith('/calendar'))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/signin';
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

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
