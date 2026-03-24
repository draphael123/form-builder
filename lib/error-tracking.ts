// Error tracking utility for production error monitoring
// In production, replace with Sentry or similar service

interface ErrorContext {
  userId?: string;
  page?: string;
  action?: string;
  formData?: Record<string, unknown>;
  [key: string]: unknown;
}

interface TrackedError {
  id: string;
  timestamp: string;
  message: string;
  stack?: string;
  context: ErrorContext;
  userAgent?: string;
  url?: string;
}

// In-memory store for development (replace with external service in production)
const errorLog: TrackedError[] = [];
const MAX_ERRORS = 100;

/**
 * Track an error with context
 */
export function trackError(error: Error | string, context: ErrorContext = {}): string {
  const errorId = `err_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  const trackedError: TrackedError = {
    id: errorId,
    timestamp: new Date().toISOString(),
    message: typeof error === 'string' ? error : error.message,
    stack: typeof error === 'object' ? error.stack : undefined,
    context,
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[Error Tracked]', trackedError);
  }

  // Store error (in production, send to error tracking service)
  errorLog.unshift(trackedError);
  if (errorLog.length > MAX_ERRORS) {
    errorLog.pop();
  }

  // In production, send to external service
  if (process.env.NODE_ENV === 'production' && process.env.ERROR_TRACKING_URL) {
    fetch(process.env.ERROR_TRACKING_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trackedError),
    }).catch(() => {
      // Silently fail - don't create infinite error loop
    });
  }

  return errorId;
}

/**
 * Track a warning (non-critical issue)
 */
export function trackWarning(message: string, context: ErrorContext = {}): void {
  if (process.env.NODE_ENV === 'development') {
    console.warn('[Warning]', message, context);
  }
}

/**
 * Create error boundary wrapper for async functions
 */
export function withErrorTracking<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  context: ErrorContext = {}
): T {
  return (async (...args: unknown[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      trackError(error as Error, { ...context, args });
      throw error;
    }
  }) as T;
}

/**
 * Get recent errors (for admin dashboard)
 */
export function getRecentErrors(): TrackedError[] {
  return [...errorLog];
}

/**
 * Clear error log
 */
export function clearErrorLog(): void {
  errorLog.length = 0;
}

// Global error handler for uncaught errors
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    trackError(event.error || event.message, {
      action: 'uncaught_error',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    trackError(event.reason?.message || 'Unhandled Promise Rejection', {
      action: 'unhandled_rejection',
      reason: String(event.reason),
    });
  });
}
