import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');

// Ensure directory exists
function ensureDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function ensureAnalyticsFile() {
  ensureDirectory();
  if (!fs.existsSync(ANALYTICS_FILE)) {
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify({ sessions: [], events: [] }, null, 2));
  }
}

export interface FormSession {
  id: string;
  startedAt: string;
  completedAt?: string;
  lastActiveAt: string;
  pagesVisited: number[];
  currentPage: number;
  totalTimeSeconds: number;
  userAgent?: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  status: 'in_progress' | 'completed' | 'abandoned';
}

export interface AnalyticsEvent {
  id: string;
  sessionId: string;
  type: 'page_view' | 'field_interaction' | 'validation_error' | 'save_draft' | 'form_submit';
  page?: number;
  fieldId?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

interface AnalyticsData {
  sessions: FormSession[];
  events: AnalyticsEvent[];
}

// Get analytics data
function getAnalyticsData(): AnalyticsData {
  ensureAnalyticsFile();
  const content = fs.readFileSync(ANALYTICS_FILE, 'utf-8');
  return JSON.parse(content);
}

// Save analytics data
function saveAnalyticsData(data: AnalyticsData): void {
  ensureAnalyticsFile();
  fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2));
}

// Generate session ID
function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Generate event ID
function generateEventId(): string {
  return `event-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Detect device type from user agent
function detectDeviceType(userAgent?: string): 'mobile' | 'tablet' | 'desktop' {
  if (!userAgent) return 'desktop';

  const ua = userAgent.toLowerCase();
  if (/mobile|iphone|ipod|android.*mobile|windows phone|blackberry/i.test(ua)) {
    return 'mobile';
  }
  if (/ipad|android(?!.*mobile)|tablet/i.test(ua)) {
    return 'tablet';
  }
  return 'desktop';
}

// Start a new form session
export function startSession(userAgent?: string): FormSession {
  const data = getAnalyticsData();

  const session: FormSession = {
    id: generateSessionId(),
    startedAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    pagesVisited: [0],
    currentPage: 0,
    totalTimeSeconds: 0,
    userAgent,
    deviceType: detectDeviceType(userAgent),
    status: 'in_progress',
  };

  data.sessions.push(session);
  saveAnalyticsData(data);

  return session;
}

// Update session activity
export function updateSession(
  sessionId: string,
  updates: Partial<Pick<FormSession, 'currentPage' | 'totalTimeSeconds' | 'status'>>
): FormSession | null {
  const data = getAnalyticsData();
  const sessionIndex = data.sessions.findIndex(s => s.id === sessionId);

  if (sessionIndex === -1) return null;

  const session = data.sessions[sessionIndex];

  if (updates.currentPage !== undefined) {
    session.currentPage = updates.currentPage;
    if (!session.pagesVisited.includes(updates.currentPage)) {
      session.pagesVisited.push(updates.currentPage);
    }
  }

  if (updates.totalTimeSeconds !== undefined) {
    session.totalTimeSeconds = updates.totalTimeSeconds;
  }

  if (updates.status !== undefined) {
    session.status = updates.status;
    if (updates.status === 'completed') {
      session.completedAt = new Date().toISOString();
    }
  }

  session.lastActiveAt = new Date().toISOString();

  data.sessions[sessionIndex] = session;
  saveAnalyticsData(data);

  return session;
}

// Record an analytics event
export function recordEvent(
  sessionId: string,
  type: AnalyticsEvent['type'],
  details?: { page?: number; fieldId?: string; metadata?: Record<string, unknown> }
): AnalyticsEvent {
  const data = getAnalyticsData();

  const event: AnalyticsEvent = {
    id: generateEventId(),
    sessionId,
    type,
    timestamp: new Date().toISOString(),
    ...details,
  };

  data.events.push(event);
  saveAnalyticsData(data);

  return event;
}

// Mark abandoned sessions (no activity for 30 minutes)
export function markAbandonedSessions(): number {
  const data = getAnalyticsData();
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  let count = 0;

  data.sessions.forEach(session => {
    if (
      session.status === 'in_progress' &&
      new Date(session.lastActiveAt) < thirtyMinutesAgo
    ) {
      session.status = 'abandoned';
      count++;
    }
  });

  if (count > 0) {
    saveAnalyticsData(data);
  }

  return count;
}

// Get analytics summary
export interface AnalyticsSummary {
  totalSessions: number;
  completedSessions: number;
  abandonedSessions: number;
  inProgressSessions: number;
  completionRate: number;
  averageCompletionTimeSeconds: number;
  deviceBreakdown: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  dropOffByPage: Record<number, number>;
  dailyStats: Array<{
    date: string;
    started: number;
    completed: number;
  }>;
  fieldInteractions: Record<string, number>;
  validationErrors: Record<string, number>;
}

export function getAnalyticsSummary(daysBack: number = 30): AnalyticsSummary {
  // First mark abandoned sessions
  markAbandonedSessions();

  const data = getAnalyticsData();
  const cutoffDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

  // Filter sessions within date range
  const recentSessions = data.sessions.filter(
    s => new Date(s.startedAt) >= cutoffDate
  );

  const recentEvents = data.events.filter(
    e => new Date(e.timestamp) >= cutoffDate
  );

  const completedSessions = recentSessions.filter(s => s.status === 'completed');
  const abandonedSessions = recentSessions.filter(s => s.status === 'abandoned');
  const inProgressSessions = recentSessions.filter(s => s.status === 'in_progress');

  // Calculate average completion time
  const completionTimes = completedSessions
    .filter(s => s.totalTimeSeconds > 0)
    .map(s => s.totalTimeSeconds);
  const avgCompletionTime = completionTimes.length > 0
    ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
    : 0;

  // Device breakdown
  const deviceBreakdown = {
    mobile: recentSessions.filter(s => s.deviceType === 'mobile').length,
    tablet: recentSessions.filter(s => s.deviceType === 'tablet').length,
    desktop: recentSessions.filter(s => s.deviceType === 'desktop').length,
  };

  // Drop-off by page (where users abandoned)
  const dropOffByPage: Record<number, number> = {};
  abandonedSessions.forEach(session => {
    const page = session.currentPage;
    dropOffByPage[page] = (dropOffByPage[page] || 0) + 1;
  });

  // Daily stats
  const dailyStatsMap: Record<string, { started: number; completed: number }> = {};
  recentSessions.forEach(session => {
    const date = session.startedAt.split('T')[0];
    if (!dailyStatsMap[date]) {
      dailyStatsMap[date] = { started: 0, completed: 0 };
    }
    dailyStatsMap[date].started++;
  });
  completedSessions.forEach(session => {
    if (session.completedAt) {
      const date = session.completedAt.split('T')[0];
      if (!dailyStatsMap[date]) {
        dailyStatsMap[date] = { started: 0, completed: 0 };
      }
      dailyStatsMap[date].completed++;
    }
  });
  const dailyStats = Object.entries(dailyStatsMap)
    .map(([date, stats]) => ({ date, ...stats }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Field interactions
  const fieldInteractions: Record<string, number> = {};
  recentEvents
    .filter(e => e.type === 'field_interaction' && e.fieldId)
    .forEach(e => {
      const fieldId = e.fieldId!;
      fieldInteractions[fieldId] = (fieldInteractions[fieldId] || 0) + 1;
    });

  // Validation errors
  const validationErrors: Record<string, number> = {};
  recentEvents
    .filter(e => e.type === 'validation_error' && e.fieldId)
    .forEach(e => {
      const fieldId = e.fieldId!;
      validationErrors[fieldId] = (validationErrors[fieldId] || 0) + 1;
    });

  return {
    totalSessions: recentSessions.length,
    completedSessions: completedSessions.length,
    abandonedSessions: abandonedSessions.length,
    inProgressSessions: inProgressSessions.length,
    completionRate: recentSessions.length > 0
      ? (completedSessions.length / recentSessions.length) * 100
      : 0,
    averageCompletionTimeSeconds: avgCompletionTime,
    deviceBreakdown,
    dropOffByPage,
    dailyStats,
    fieldInteractions,
    validationErrors,
  };
}

// Get all sessions for detailed view
export function getAllSessions(): FormSession[] {
  const data = getAnalyticsData();
  return data.sessions.sort((a, b) =>
    new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );
}
