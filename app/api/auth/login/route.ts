import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { verifyAdminCredentials, createSession, createAuthResponse } from '@/lib/auth';
import { getClientIP } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Rate limiting for auth routes (stricter)
  const rateLimited = rateLimit(request);
  if (rateLimited) {
    return rateLimited;
  }

  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Verify credentials
    const isValid = await verifyAdminCredentials(username, password);

    if (!isValid) {
      // Log failed attempt
      console.warn(`Failed login attempt for user: ${username} from IP: ${getClientIP(request)}`);

      // Use generic message to prevent username enumeration
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session
    const ip = getClientIP(request);
    const token = createSession(username, 'admin', ip);

    // Log successful login
    console.log(`Successful login for user: ${username} from IP: ${ip}`);

    // Return response with session cookie
    return createAuthResponse(token, {
      success: true,
      message: 'Login successful',
      user: {
        username,
        role: 'admin',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
