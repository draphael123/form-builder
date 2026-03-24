import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Constant-time string comparison to prevent timing attacks (Edge Runtime compatible)
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// Routes that require admin authentication
const PROTECTED_ROUTES = [
  '/admin',
  '/api/submissions',
];

// Routes that require CSRF protection (state-changing operations)
const CSRF_PROTECTED_ROUTES = [
  '/api/submissions',
];

const CSRF_HEADER_NAME = 'x-csrf-token';
const CSRF_COOKIE_NAME = 'csrf_token';

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

    // CSRF protection for state-changing operations (POST, PUT, DELETE, PATCH)
    const isCsrfProtectedRoute = CSRF_PROTECTED_ROUTES.some(route =>
      pathname.startsWith(route)
    );
    const isStateMutatingMethod = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method);

    if (isCsrfProtectedRoute && isStateMutatingMethod) {
      const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
      const headerToken = request.headers.get(CSRF_HEADER_NAME);

      // Validate double-submit cookie pattern
      if (!cookieToken || !headerToken) {
        return NextResponse.json(
          { success: false, error: 'CSRF token missing' },
          { status: 403 }
        );
      }

      // Use timing-safe comparison to prevent timing attacks
      if (!timingSafeEqual(cookieToken, headerToken)) {
        return NextResponse.json(
          { success: false, error: 'CSRF token invalid' },
          { status: 403 }
        );
      }
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
