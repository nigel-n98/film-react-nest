import { Injectable, LoggerService } from '@nestjs/common';

type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose';

interface JsonLogRecord {
  level: LogLevel;
  message: unknown;
  timestamp: string;
  context?: string;
  meta?: unknown[];
}

@Injectable()
export class JsonLogger implements LoggerService {
  private formatMessage(
    level: LogLevel,
    message: unknown,
    optionalParams: unknown[],
  ): string {
    const record: JsonLogRecord = {
      level,
      message,
      timestamp: new Date().toISOString(),
    };

    const { context, meta } = this.extractParams(level, optionalParams);

    if (context) {
      record.context = context;
    }

    if (meta.length > 0) {
      record.meta = meta;
    }

    return JSON.stringify(record);
  }

  private extractParams(
    level: LogLevel,
    optionalParams: unknown[],
  ): { context?: string; meta: unknown[] } {
    if (optionalParams.length === 0) {
      return { meta: [] };
    }

    if (level === 'error') {
      const [trace, context, ...rest] = optionalParams;

      return {
        context: typeof context === 'string' ? context : undefined,
        meta: trace ? [trace, ...rest] : rest,
      };
    }

    const [context, ...rest] = optionalParams;

    return {
      context: typeof context === 'string' ? context : undefined,
      meta: rest,
    };
  }

  log(message: unknown, ...optionalParams: unknown[]): void {
    console.log(this.formatMessage('log', message, optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    console.error(this.formatMessage('error', message, optionalParams));
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    console.warn(this.formatMessage('warn', message, optionalParams));
  }

  debug(message: unknown, ...optionalParams: unknown[]): void {
    console.debug(this.formatMessage('debug', message, optionalParams));
  }

  verbose(message: unknown, ...optionalParams: unknown[]): void {
    console.log(this.formatMessage('verbose', message, optionalParams));
  }
}
