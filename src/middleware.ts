import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log(`[MIDDLEWARE] Path: "${pathname}", Host: "${request.headers.get('host')}"`);

  // List of decoupled apps requiring auth verification
  const apps = ['admin', 'master-data', 'crm', 'hrm', 'procurement', 'inventory', 'facilities', 'finance', 'workflows', 'settings', 'ops', 'erp'];

  // Protect decoupled app routes
  for (const app of apps) {
    if (pathname.startsWith(`/${app}`)) {
      if (pathname.includes('/login') || pathname.includes('/api/')) {
        continue;
      }
      const token = request.cookies.get(`${app}_auth_token`)?.value || request.cookies.get(`ops_auth_token`)?.value;
      if (!token) {
        const loginUrl = new URL(`/${app}/login`, request.url);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  // Legacy dashboard route fallback - redirect to HRM module
  if (pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/hrm', request.url));
  }

  // Protect internal API routes (excluding auth)
  if (pathname.startsWith('/api/crud') || pathname.startsWith('/api/copilot')) {
    const hasAnyToken = request.cookies.getAll().some(c => c.name.endsWith('auth_token'));
    if (!hasAnyToken) {
      return NextResponse.json(
        { error: 'Unauthorized. Authentication token required.' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/crud/:path*',
    '/api/copilot/:path*',
    '/admin/:path*',
    '/master-data/:path*',
    '/crm/:path*',
    '/hrm/:path*',
    '/procurement/:path*',
    '/inventory/:path*',
    '/facilities/:path*',
    '/finance/:path*',
    '/workflows/:path*',
    '/settings/:path*',
    '/ops/:path*',
    '/erp/:path*',
  ],
};
