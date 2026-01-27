
import { ConsoleLogger } from './ConsoleLogger';

describe('ConsoleLogger', () => {
  const dateStr = "2024-01-01T10:00:00.000Z";

  beforeAll(() => {
    const fixedDate = new Date(dateStr);

    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  describe('implicitly non silent: print functionality', () => {
    it('calls console.debug with DBG prefix', () => {
      const logger: ConsoleLogger = new ConsoleLogger();
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

      logger.debug('a', 1);

      expect(debugSpy).toHaveBeenCalledWith(
        `${dateStr} DBG:`,
        'a',
        1
      );
    });

    it('calls console.info with INF prefix', () => {
      const logger: ConsoleLogger = new ConsoleLogger();
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

      logger.info('a', 1);

      expect(infoSpy).toHaveBeenCalledWith(
        `${dateStr} INF:`,
        'a',
        1
      );
    });

    it('calls console.log with LOG prefix', () => {
      const logger: ConsoleLogger = new ConsoleLogger();
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      logger.log('a', 1);

      expect(logSpy).toHaveBeenCalledWith(
        `${dateStr} LOG:`,
        'a',
        1
      );
    });

    it('calls console.warn with WRN prefix', () => {
      const logger: ConsoleLogger = new ConsoleLogger();
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      logger.warn('a', 1);

      expect(warnSpy).toHaveBeenCalledWith(
        `${dateStr} WRN:`,
        'a',
        1
      );
    });

    it('calls console.error with ERR prefix', () => {
      const logger: ConsoleLogger = new ConsoleLogger();
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      logger.error('a', 1);

      expect(errorSpy).toHaveBeenCalledWith(
        `${dateStr} ERR:`,
        'a',
        1
      );
    });
  });

  describe('explicitly non silent', () => {
    it('calls console.debug with DBG prefix', () => {
      const logger: ConsoleLogger = new ConsoleLogger(false);
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

      logger.debug('a', 1);

      expect(debugSpy).toHaveBeenCalledWith(
        `${dateStr} DBG:`,
        'a',
        1
      );
    });
  });

  describe('silent functionality', () => {
    it('stays silent: debug', () => {
      const logger: ConsoleLogger = new ConsoleLogger(true);
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

      logger.debug('a', 1);

      expect(debugSpy).not.toHaveBeenCalled();
    });

    it('stays silent: info', () => {
      const logger: ConsoleLogger = new ConsoleLogger(true);
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

      logger.info('a', 1);

      expect(infoSpy).not.toHaveBeenCalled();
    });

    it('stays silent: log', () => {
      const logger: ConsoleLogger = new ConsoleLogger(true);
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      logger.log('a', 1);

      expect(logSpy).not.toHaveBeenCalled();
    });

    it('stays silent: warn', () => {
      const logger: ConsoleLogger = new ConsoleLogger(true);
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      logger.warn('a', 1);

      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('stays silent: error', () => {
      const logger: ConsoleLogger = new ConsoleLogger(true);
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      logger.error('a', 1);

      expect(errorSpy).not.toHaveBeenCalled();
    });
  });
});
