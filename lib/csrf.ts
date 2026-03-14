import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// CSRF token storage - in production, use Redis or database
const csrfTokens = new Map<string, {
  token: string;
  createdAt: number;
  expiresAt: number;
}>();

// Configuration
const CSRF_TOKEN_LENGTH = 32;
const CSRF_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour
const CSRF_HEADER_NAME = 'x-csrf-token';
const CSRF_COOKIE_NAME = 'csrf_token';

/**
 * Generate a new CSRF token
 */
export function generateCsrfToken(): string {
  const token = crypto.randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
  const now = Date.now();

  csrfTokens.set(token, {
    token,
    createdAt: now,
    expiresAt: now + CSRF_TOKEN_EXPIRY,
  });

  // Cleanup old tokens periodically
  if (csrfTokens.size > 10000) {
    cleanupExpiredTokens();
  }

  return token;
}

/**
 * Validate a CSRF token
 */
export function validateCsrfToken(token: string): boolean {
  if (!token) return false;

  const storedToken = csrfTokens.get(token);

  if (!storedToken) return false;

  // Check expiration
  if (storedToken.expiresAt < Date.now()) {
    csrfTokens.delete(token);
    return false;
  }

  // Token is valid - remove it (single use)
  csrfTokens.delete(token);

  return true;
}

/**
 * Cleanup expired tokens
 */
function cleanupExpiredTokens(): void {
  const now = Date.now();
  for (const [token, data] of csrfTokens) {
    if (data.expiresAt < now) {
      csrfTokens.delete(token);
    }
  }
}

/**
 * Get CSRF token from request
 */
export function getCsrfTokenFromRequest(request: NextRequest): string | null {
  // Check header first
  const headerToken = request.headers.get(CSRF_HEADER_NAME);
  if (headerToken) return headerToken;

  // Check cookie
  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME);
  return cookieToken?.value || null;
}

/**
 * Validate CSRF for a request
 * Returns null if valid, or error response if invalid
 */
export function validateCsrf(request: NextRequest): NextResponse | null {
  // Skip CSRF check for GET, HEAD, OPTIONS requests
  const method = request.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return null;
  }

  const token = getCsrfTokenFromRequest(request);

  if (!token) {
    return NextResponse.json(
      { success: false, error: 'CSRF token missing' },
      { status: 403 }
    );
  }

  if (!validateCsrfToken(token)) {
    return NextResponse.json(
      { success: false, error: 'CSRF token invalid or expired' },
      { status: 403 }
    );
  }

  return null; // Valid
}

/**
 * Create a response with CSRF token cookie
 */
export function withCsrfToken(response: NextResponse): NextResponse {
  const token = generateCsrfToken();

  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: false, // Must be readable by JavaScript
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: CSRF_TOKEN_EXPIRY / 1000,
    path: '/',
  });

  // Also set in header for convenience
  response.headers.set(CSRF_HEADER_NAME, token);

  return response;
}

/**
 * API endpoint to get a new CSRF token
 * Use: GET /api/csrf
 */
export function handleCsrfTokenRequest(): NextResponse {
  const token = generateCsrfToken();

  const response = NextResponse.json({
    success: true,
    token,
  });

  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: CSRF_TOKEN_EXPIRY / 1000,
    path: '/',
  });

  return response;
}

/**
 * Double-submit cookie pattern validation
 * Compares cookie token with header/body token
 */
export function validateDoubleSubmitCookie(request: NextRequest): boolean {
  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
  const headerToken = request.headers.get(CSRF_HEADER_NAME);

  if (!cookieToken || !headerToken) {
    return false;
  }

  // Use timing-safe comparison
  try {
    return crypto.timingSafeEqual(
      Buffer.from(cookieToken),
      Buffer.from(headerToken)
    );
  } catch {
    return false;
  }
}
