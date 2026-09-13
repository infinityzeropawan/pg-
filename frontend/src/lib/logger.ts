// RESPONSIBILITY: Centralized logging utility to replace console.log (Rule 65)

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private log(level: LogLevel, message: string, ...args: unknown[]) {
    // In production, we might send these to Datadog or Sentry
    // In development, we can format them nicely
    if (process.env.NODE_ENV !== 'production') {
      const timestamp = new Date().toISOString();
      const prefix = `[${level.toUpperCase()}] [${timestamp}]`;
      
      switch (level) {
        case 'info':
          console.info(prefix, message, ...args);
          break;
        case 'warn':
          console.warn(prefix, message, ...args);
          break;
        case 'error':
          console.error(prefix, message, ...args);
          break;
        case 'debug':
          console.debug(prefix, message, ...args);
          break;
      }
    } else {
      // Production behavior (e.g., Sentry)
      if (level === 'error') {
        console.error(message, ...args);
      }
    }
  }

  info(message: string, ...args: unknown[]) {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: unknown[]) {
    this.log('warn', message, ...args);
  }

  error(message: string, ...args: unknown[]) {
    this.log('error', message, ...args);
  }

  debug(message: string, ...args: unknown[]) {
    this.log('debug', message, ...args);
  }
}

export const logger = new Logger();
