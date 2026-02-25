import { Injectable, LoggerService } from '@nestjs/common';

type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose';

@Injectable()
export class TskvLogger implements LoggerService {
  private formatMessage(
    level: LogLevel,
    message: unknown,
    optionalParams: unknown[],
  ): string {
    const record: Record<string, string> = {
      level,
      message: this.stringify(message),
      timestamp: new Date().toISOString(),
    };

    const { context, trace, meta } = this.extractParams(level, optionalParams);

    if (context) {
      record.context = context;
    }

    if (trace) {
      record.trace = this.stringify(trace);
    }

    meta.forEach((value, index) => {
      record[`meta${index}`] = this.stringify(value);
    });

    return (
      Object.entries(record)
        .map(
          ([key, value]) =>
            `${this.sanitizeKey(key)}=${this.sanitizeValue(value)}`,
        )
        .join('\t') + '\n'
    );
  }

  private extractParams(
    level: LogLevel,
    optionalParams: unknown[],
  ): { context?: string; trace?: unknown; meta: unknown[] } {
    if (optionalParams.length === 0) {
      return { meta: [] };
    }

    if (level === 'error') {
      const [trace, context, ...rest] = optionalParams;

      return {
        trace,
        context: typeof context === 'string' ? context : undefined,
        meta: rest,
      };
    }

    const [context, ...rest] = optionalParams;

    return {
      context: typeof context === 'string' ? context : undefined,
      meta: rest,
    };
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

  private sanitizeValue(value: string): string {
    return value.replace(/\t/g, '\\t').replace(/\n/g, '\\n');
  }

  private sanitizeKey(key: string): string {
    return key.replace(/[=\t\n]/g, '');
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
