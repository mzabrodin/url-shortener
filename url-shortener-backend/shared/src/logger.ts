import pino from 'pino';

export function createLogger(name: string) {
  return pino({
    name,
    level: process.env.LOG_LEVEL!,
  });
}

export type Logger = ReturnType<typeof createLogger>;
