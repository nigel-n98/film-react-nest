import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should log message in TSKV format', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});

    logger.log('test message', 'TestContext', 'extra1', 'extra2');

    expect(spy).toHaveBeenCalledTimes(1);

    const logged = spy.mock.calls[0][0] as string;

    expect(logged).toContain('level=log');
    expect(logged).toContain('message=test message');
    expect(logged).toContain('context=TestContext');
    expect(logged).toContain('meta0=extra1');
    expect(logged).toContain('meta1=extra2');
    expect(logged).toContain('timestamp=');
    expect(logged.endsWith('\n')).toBe(true);
  });

  it('should call console.error for error level', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    logger.error('error message', 'stacktrace', 'ErrorContext', 'extra');

    expect(spy).toHaveBeenCalledTimes(1);

    const logged = spy.mock.calls[0][0] as string;

    expect(logged).toContain('level=error');
    expect(logged).toContain('message=error message');
    expect(logged).toContain('trace=stacktrace');
    expect(logged).toContain('context=ErrorContext');
    expect(logged).toContain('meta0=extra');
    expect(logged).toContain('timestamp=');
    expect(logged.endsWith('\n')).toBe(true);
  });
});
