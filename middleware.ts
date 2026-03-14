import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require admin authentication
const PROTECTED_ROUTES = [
  '/admin',
  '/api/submissions',
];

// Routes that should be rate limited more strictly
const AUTH_ROUTES = [
  '/api/auth/login',
];

// Public routes that don't need any protection
const PUBLIC_ROUTES = [
  '/',
  '/api/submit',
  '/api/drafts',
  '/api/upload',
  '/api/analytics',
  '/api/csrf',
  '/success',
  '/checklist',
  '/continue',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Add security headers to all responses
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // CSP header (adjust as needed for your application)
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: blob: https:; " +
    "connect-src 'self' https://api.resend.com https://*.google.com https://*.googleapis.com; " +
    "frame-ancestors 'none';"
  );

  // Check if route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Check for authentication
    const sessionCookie = request.cookies.get('fb_session');
    const authHeader = request.headers.get('authorization');

    // Allow if has session cookie or bearer token
    const hasAuth = sessionCookie?.value || authHeader?.startsWith('Bearer ');

    if (!hasAuth) {
      // For API routes, return 401
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 }
        );
      }

      // For page routes, redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
