type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const levelPriority: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';

function shouldLog(level: LogLevel): boolean {
  return levelPriority[level] >= levelPriority[currentLevel];
}

function formatMessage(level: LogLevel, component: string, message: string): string {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] [${component}] ${message}`;
}

export function createLogger(component: string) {
  return {
    debug: (message: string) => {
      if (shouldLog('debug')) {
        console.log(formatMessage('debug', component, message));
      }
    },
    info: (message: string) => {
      if (shouldLog('info')) {
        console.log(formatMessage('info', component, message));
      }
    },
    warn: (message: string) => {
      if (shouldLog('warn')) {
        console.warn(formatMessage('warn', component, message));
      }
    },
    error: (message: string, err?: Error) => {
      if (shouldLog('error')) {
        console.error(formatMessage('error', component, message));
        if (err) {
          console.error(err);
        }
      }
    },
  };
}
