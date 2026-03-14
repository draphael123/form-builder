import { NextRequest } from 'next/server';
import { getTokenFromRequest, deleteSession, createLogoutResponse } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);

    if (token) {
      // Delete the session
      deleteSession(token);
    }

    return createLogoutResponse();
  } catch (error) {
    console.error('Logout error:', error);
    return createLogoutResponse();
  }
}
