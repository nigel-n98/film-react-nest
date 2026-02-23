import { Injectable, LoggerService } from '@nestjs/common';

type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose';

@Injectable()
export class TskvLogger implements LoggerService {
  private formatMessage(
    level: LogLevel,
    message: unknown,
    context?: string,
    trace?: string,
  ): string {
    const record: Record<string, string> = {
      level,
      message: this.stringify(message),
      timestamp: new Date().toISOString(),
    };

    if (context) {
      record.context = context;
    }

    if (trace) {
      record.trace = trace;
    }

    return (
      Object.entries(record)
        .map(([key, value]) => `${key}=${value}`)
        .join('\t') + '\n'
    );
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
    console.error(this.formatMessage('error', message, context, trace));
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