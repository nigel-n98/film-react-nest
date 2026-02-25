import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should log message in JSON format', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    logger.log('test message', 'TestContext');

    expect(consoleSpy).toHaveBeenCalledTimes(1);

    const loggedValue = consoleSpy.mock.calls[0][0];
    const parsed = JSON.parse(loggedValue);

    expect(parsed.level).toBe('log');
    expect(parsed.message).toBe('test message');
    expect(parsed.context).toBe('TestContext');
    expect(parsed.timestamp).toBeDefined();
  });

  it('should call console.error for error level', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    logger.error('error message', 'stacktrace', 'ErrorContext');

    expect(consoleSpy).toHaveBeenCalledTimes(1);

    const loggedValue = consoleSpy.mock.calls[0][0];
    const parsed = JSON.parse(loggedValue);

    expect(parsed.level).toBe('error');
    expect(parsed.message).toBe('error message');
    expect(parsed.context).toBe('ErrorContext');
    expect(parsed.meta).toContain('stacktrace');
  });
});
