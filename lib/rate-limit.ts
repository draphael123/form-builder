import { NextRequest, NextResponse } from 'next/server';

// In-memory store for rate limiting
// In production, use Redis for distributed rate limiting
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Rate limit configurations per endpoint
export const RATE_LIMITS = {
  // Form submission: 5 per minute per IP
  '/api/submit': { limit: 5, windowMs: 60 * 1000 },
  // File upload: 10 per minute per IP
  '/api/upload': { limit: 10, windowMs: 60 * 1000 },
  // Draft operations: 20 per minute per IP
  '/api/drafts': { limit: 20, windowMs: 60 * 1000 },
  // Admin submissions: 30 per minute per IP
  '/api/submissions': { limit: 30, windowMs: 60 * 1000 },
  // Analytics: 60 per minute per IP
  '/api/analytics': { limit: 60, windowMs: 60 * 1000 },
  // Auth attempts: 5 per 15 minutes per IP (stricter for security)
  '/api/auth': { limit: 5, windowMs: 15 * 60 * 1000 },
  // Default limit for any other endpoint
  default: { limit: 100, windowMs: 60 * 1000 },
} as const;

/**
 * Get client IP from request
 */
export function getClientIP(request: NextRequest): string {
  // Check various headers that may contain the real IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback to a generic identifier
  return 'unknown';
}

/**
 * Get rate limit key for a request
 */
function getRateLimitKey(request: NextRequest): string {
  const ip = getClientIP(request);
  const path = new URL(request.url).pathname;

  // Normalize path to endpoint base
  const endpointBase = '/' + path.split('/').slice(1, 3).join('/');

  return `${ip}:${endpointBase}`;
}

/**
 * Get rate limit config for a path
 */
function getRateLimitConfig(path: string): { limit: number; windowMs: number } {
  // Normalize path to endpoint base
  const endpointBase = '/' + path.split('/').slice(1, 3).join('/');

  return RATE_LIMITS[endpointBase as keyof typeof RATE_LIMITS] || RATE_LIMITS.default;
}

/**
 * Clean up expired entries
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Check rate limit for a request
 * Returns null if allowed, or a response if rate limited
 */
export function checkRateLimit(request: NextRequest): NextResponse | null {
  const key = getRateLimitKey(request);
  const path = new URL(request.url).pathname;
  const config = getRateLimitConfig(path);
  const now = Date.now();

  // Get or create entry
  let entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt < now) {
    // Create new entry
    entry = {
      count: 1,
      resetAt: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);

    // Periodic cleanup
    if (rateLimitStore.size > 10000) {
      cleanupExpiredEntries();
    }

    return null; // Allowed
  }

  // Increment count
  entry.count++;

  // Check if over limit
  if (entry.count > config.limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);

    return NextResponse.json(
      {
        success: false,
        error: 'Too many requests. Please try again later.',
        retryAfter,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(config.limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(entry.resetAt / 1000)),
        },
      }
    );
  }

  return null; // Allowed
}

/**
 * Get rate limit headers for a successful request
 */
export function getRateLimitHeaders(request: NextRequest): Record<string, string> {
  const key = getRateLimitKey(request);
  const path = new URL(request.url).pathname;
  const config = getRateLimitConfig(path);

  const entry = rateLimitStore.get(key);
  const remaining = entry ? Math.max(0, config.limit - entry.count) : config.limit;
  const reset = entry ? Math.ceil(entry.resetAt / 1000) : Math.ceil((Date.now() + config.windowMs) / 1000);

  return {
    'X-RateLimit-Limit': String(config.limit),
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': String(reset),
  };
}

/**
 * Rate limit middleware for API routes
 * Use in route handlers: const rateLimited = rateLimit(request); if (rateLimited) return rateLimited;
 */
export function rateLimit(request: NextRequest): NextResponse | null {
  return checkRateLimit(request);
}

/**
 * Create a rate-limited response with headers
 */
export function withRateLimitHeaders(request: NextRequest, response: NextResponse): NextResponse {
  const headers = getRateLimitHeaders(request);

  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }

  return response;
}
