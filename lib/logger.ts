import { SENSITIVE_FIELDS } from './encryption';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: {
    message: string;
    stack?: string;
    name?: string;
  };
}

// Patterns to mask in logs
const MASK_PATTERNS = [
  /\d{3}-\d{2}-\d{4}/g, // SSN
  /\d{3}-\d{3}-\d{4}/g, // Phone
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, // Email (partial masking)
];

/**
 * Mask sensitive data in a string
 */
function maskSensitiveString(str: string): string {
  let result = str;

  // Mask SSN patterns
  result = result.replace(/\d{3}-\d{2}-\d{4}/g, '***-**-****');

  // Mask phone patterns (keep last 4)
  result = result.replace(/\d{3}-\d{3}-(\d{4})/g, '***-***-$1');

  return result;
}

/**
 * Recursively mask sensitive fields in an object
 */
function maskSensitiveData(data: unknown, depth = 0): unknown {
  // Prevent infinite recursion
  if (depth > 10) return '[MAX_DEPTH]';

  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'string') {
    return maskSensitiveString(data);
  }

  if (Array.isArray(data)) {
    return data.map(item => maskSensitiveData(item, depth + 1));
  }

  if (typeof data === 'object') {
    const masked: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
      // Check if this is a sensitive field
      const isSensitiveField = SENSITIVE_FIELDS.some(
        field => key.toLowerCase().includes(field.toLowerCase())
      );

      if (isSensitiveField && typeof value === 'string') {
        // Mask the entire value for sensitive fields
        masked[key] = value.length > 4
          ? `***${value.slice(-4)}`
          : '****';
      } else {
        masked[key] = maskSensitiveData(value, depth + 1);
      }
    }

    return masked;
  }

  return data;
}

/**
 * Format log entry as JSON
 */
function formatLogEntry(entry: LogEntry): string {
  return JSON.stringify(entry);
}

/**
 * Create a log entry
 */
function createLogEntry(
  level: LogLevel,
  message: string,
  context?: LogContext,
  error?: Error
): LogEntry {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
  };

  if (context) {
    entry.context = maskSensitiveData(context) as LogContext;
  }

  if (error) {
    entry.error = {
      message: error.message,
      name: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    };
  }

  return entry;
}

/**
 * Logger object with methods for each log level
 */
export const logger = {
  /**
   * Debug level logging (development only)
   */
  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV === 'development') {
      const entry = createLogEntry('debug', message, context);
      console.debug(formatLogEntry(entry));
    }
  },

  /**
   * Info level logging
   */
  info(message: string, context?: LogContext): void {
    const entry = createLogEntry('info', message, context);
    console.log(formatLogEntry(entry));
  },

  /**
   * Warning level logging
   */
  warn(message: string, context?: LogContext): void {
    const entry = createLogEntry('warn', message, context);
    console.warn(formatLogEntry(entry));
  },

  /**
   * Error level logging
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const err = error instanceof Error ? error : undefined;
    const entry = createLogEntry('error', message, context, err);
    console.error(formatLogEntry(entry));

    // If Sentry is configured, send error there
    if (typeof window !== 'undefined') {
      const win = window as unknown as Record<string, unknown>;
      if (win.Sentry) {
        (win.Sentry as { captureException: (e: Error) => void }).captureException(err || new Error(message));
      }
    }
  },

  /**
   * Log API request
   */
  request(
    method: string,
    path: string,
    statusCode: number,
    durationMs: number,
    context?: LogContext
  ): void {
    const level: LogLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';

    const entry = createLogEntry(level, `${method} ${path} ${statusCode}`, {
      method,
      path,
      statusCode,
      durationMs,
      ...context,
    });

    if (level === 'error') {
      console.error(formatLogEntry(entry));
    } else if (level === 'warn') {
      console.warn(formatLogEntry(entry));
    } else {
      console.log(formatLogEntry(entry));
    }
  },

  /**
   * Log form submission
   */
  submission(
    submissionId: string,
    success: boolean,
    context?: LogContext
  ): void {
    const message = success
      ? `Form submitted successfully: ${submissionId}`
      : `Form submission failed: ${submissionId}`;

    const entry = createLogEntry(
      success ? 'info' : 'error',
      message,
      { submissionId, ...context }
    );

    if (success) {
      console.log(formatLogEntry(entry));
    } else {
      console.error(formatLogEntry(entry));
    }
  },

  /**
   * Log authentication event
   */
  auth(
    event: 'login' | 'logout' | 'login_failed',
    username: string,
    ipAddress: string,
    context?: LogContext
  ): void {
    const level: LogLevel = event === 'login_failed' ? 'warn' : 'info';
    const message = `Auth event: ${event} for user ${username} from ${ipAddress}`;

    const entry = createLogEntry(level, message, {
      event,
      username,
      ipAddress,
      ...context,
    });

    if (level === 'warn') {
      console.warn(formatLogEntry(entry));
    } else {
      console.log(formatLogEntry(entry));
    }
  },
};

/**
 * Create a child logger with preset context
 */
export function createLogger(baseContext: LogContext) {
  return {
    debug(message: string, context?: LogContext): void {
      logger.debug(message, { ...baseContext, ...context });
    },
    info(message: string, context?: LogContext): void {
      logger.info(message, { ...baseContext, ...context });
    },
    warn(message: string, context?: LogContext): void {
      logger.warn(message, { ...baseContext, ...context });
    },
    error(message: string, error?: Error | unknown, context?: LogContext): void {
      logger.error(message, error, { ...baseContext, ...context });
    },
  };
}

export default logger;
