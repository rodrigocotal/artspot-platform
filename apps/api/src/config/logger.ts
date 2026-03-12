import { config } from './environment';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const minLevel: LogLevel = config.nodeEnv === 'production' ? 'info' : 'debug';

function log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  if (LOG_LEVELS[level] < LOG_LEVELS[minLevel]) return;

  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };

  if (config.nodeEnv === 'production') {
    // JSON for CloudWatch / log aggregation
    const output = JSON.stringify(entry);
    if (level === 'error') {
      process.stderr.write(output + '\n');
    } else {
      process.stdout.write(output + '\n');
    }
  } else {
    // Human-readable for development
    const prefix = `[${level.toUpperCase()}]`;
    if (meta && Object.keys(meta).length > 0) {
      console[level === 'debug' ? 'log' : level](prefix, message, meta);
    } else {
      console[level === 'debug' ? 'log' : level](prefix, message);
    }
  }
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => log('debug', message, meta),
  info: (message: string, meta?: Record<string, unknown>) => log('info', message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => log('warn', message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log('error', message, meta),
};
