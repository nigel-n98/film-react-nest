import { Injectable, LoggerService } from '@nestjs/common';

type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose';

interface JsonLogRecord {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  meta?: unknown[];
}

@Injectable()
export class JsonLogger implements LoggerService {
  private formatMessage(
    level: LogLevel,
    message: unknown,
    context?: string,
    meta?: unknown[],
  ): string {
    const record: JsonLogRecord = {
      level,
      message: this.stringify(message),
      timestamp: new Date().toISOString(),
    };

    if (context) {
      record.context = context;
    }

    if (meta && meta.length > 0) {
      record.meta = meta;
    }

    return JSON.stringify(record);
  }

  private stringify(value: unknown): string {
    if (typeof value === 'string') {
      return value;
    }

    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  log(message: unknown, context?: string): void {
    console.log(this.formatMessage('log', message, context));
  }

  error(message: unknown, trace?: string, context?: string): void {
    console.error(
      this.formatMessage('error', message, context, trace ? [trace] : undefined),
    );
  }

  warn(message: unknown, context?: string): void {
    console.warn(this.formatMessage('warn', message, context));
  }

  debug(message: unknown, context?: string): void {
    console.debug(this.formatMessage('debug', message, context));
  }

  verbose(message: unknown, context?: string): void {
    console.log(this.formatMessage('verbose', message, context));
  }
}