import { NextRequest, NextResponse } from 'next/server';
import {
  startSession,
  updateSession,
  recordEvent,
  getAnalyticsSummary,
  getAllSessions,
  AnalyticsEvent,
} from '@/lib/analytics';

// POST - Start session, update session, or record event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'start_session': {
        const userAgent = request.headers.get('user-agent') || undefined;
        const session = startSession(userAgent);
        return NextResponse.json({ success: true, session });
      }

      case 'update_session': {
        const { sessionId, currentPage, totalTimeSeconds, status } = body;
        if (!sessionId) {
          return NextResponse.json(
            { success: false, message: 'Session ID is required' },
            { status: 400 }
          );
        }
        const session = updateSession(sessionId, {
          currentPage,
          totalTimeSeconds,
          status,
        });
        if (!session) {
          return NextResponse.json(
            { success: false, message: 'Session not found' },
            { status: 404 }
          );
        }
        return NextResponse.json({ success: true, session });
      }

      case 'record_event': {
        const { sessionId, type, page, fieldId, metadata } = body;
        if (!sessionId || !type) {
          return NextResponse.json(
            { success: false, message: 'Session ID and event type are required' },
            { status: 400 }
          );
        }
        const event = recordEvent(sessionId, type as AnalyticsEvent['type'], {
          page,
          fieldId,
          metadata,
        });
        return NextResponse.json({ success: true, event });
      }

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process analytics' },
      { status: 500 }
    );
  }
}

// GET - Get analytics summary or sessions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'summary';
    const daysBack = parseInt(searchParams.get('days') || '30', 10);

    if (type === 'sessions') {
      const sessions = getAllSessions();
      return NextResponse.json({ success: true, sessions });
    }

    const summary = getAnalyticsSummary(daysBack);
    return NextResponse.json({ success: true, summary });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get analytics' },
      { status: 500 }
    );
  }
}
