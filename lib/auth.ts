import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Session storage - in production, use Redis or database
const sessions = new Map<string, {
  userId: string;
  role: 'admin' | 'user';
  createdAt: number;
  expiresAt: number;
  ipAddress: string;
}>();

// Constants
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const SESSION_COOKIE_NAME = 'fb_session';

/**
 * Generate a secure random token
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Hash a password using PBKDF2
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [salt, hash] = storedHash.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(verifyHash));
}

/**
 * Create a new session
 */
export function createSession(userId: string, role: 'admin' | 'user', ipAddress: string): string {
  const token = generateToken();
  const now = Date.now();

  sessions.set(token, {
    userId,
    role,
    createdAt: now,
    expiresAt: now + SESSION_DURATION,
    ipAddress,
  });

  // Clean up expired sessions periodically
  cleanupExpiredSessions();

  return token;
}

/**
 * Get session by token
 */
export function getSession(token: string): { userId: string; role: 'admin' | 'user' } | null {
  const session = sessions.get(token);

  if (!session) {
    return null;
  }

  // Check if expired
  if (session.expiresAt < Date.now()) {
    sessions.delete(token);
    return null;
  }

  return { userId: session.userId, role: session.role };
}

/**
 * Delete a session (logout)
 */
export function deleteSession(token: string): boolean {
  return sessions.delete(token);
}

/**
 * Clean up expired sessions
 */
function cleanupExpiredSessions(): void {
  const now = Date.now();
  for (const [token, session] of sessions) {
    if (session.expiresAt < now) {
      sessions.delete(token);
    }
  }
}

/**
 * Extract session token from request
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  // Check Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  // Check cookie
  const cookie = request.cookies.get(SESSION_COOKIE_NAME);
  return cookie?.value || null;
}

/**
 * Validate request has valid admin session
 */
export function validateAdminAuth(request: NextRequest): { valid: true; userId: string } | { valid: false; error: string } {
  const token = getTokenFromRequest(request);

  if (!token) {
    return { valid: false, error: 'No authentication token provided' };
  }

  const session = getSession(token);

  if (!session) {
    return { valid: false, error: 'Invalid or expired session' };
  }

  if (session.role !== 'admin') {
    return { valid: false, error: 'Admin access required' };
  }

  return { valid: true, userId: session.userId };
}

/**
 * Create authentication response with session cookie
 */
export function createAuthResponse(token: string, data: Record<string, unknown>): NextResponse {
  const response = NextResponse.json(data);

  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_DURATION / 1000, // in seconds
    path: '/',
  });

  return response;
}

/**
 * Create logout response (clear session cookie)
 */
export function createLogoutResponse(): NextResponse {
  const response = NextResponse.json({ success: true, message: 'Logged out' });

  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  return response;
}

/**
 * Get admin password hash from environment
 * In production, store hashed passwords in a database
 */
export function getAdminPasswordHash(): string | null {
  // For development, hash the ADMIN_PASSWORD env var
  // In production, this should come from a database
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return null;

  // Use a static salt for the env-based password (not ideal for production)
  const salt = process.env.ADMIN_PASSWORD_SALT || 'fountain-form-builder';
  const hash = crypto.pbkdf2Sync(adminPassword, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify admin credentials
 */
export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  // Check if username matches expected admin username
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  if (username !== adminUsername) {
    return false;
  }

  // Get stored password hash
  const storedHash = getAdminPasswordHash();
  if (!storedHash) {
    console.warn('ADMIN_PASSWORD not configured');
    return false;
  }

  return verifyPassword(password, storedHash);
}
