import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  console.log(`[MIDDLEWARE] Path: "${pathname}", Host: "${request.headers.get('host')}", Token Exists: ${!!token}`);

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      // Redirect to login page
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect internal API routes (excluding auth)
  if (pathname.startsWith('/api/crud') || pathname.startsWith('/api/copilot')) {
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized. Authentication token required.' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/crud/:path*', '/api/copilot/:path*'],
};
