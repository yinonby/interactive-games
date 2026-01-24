

export const initClientUtilsMocks = () => {
  jest.mock('@ig/client-utils', () => {
    const actual = jest.requireActual<typeof import('@ig/client-utils')>('@ig/client-utils');

    const debugMock = jest.fn();
    const logMock = jest.fn();
    const infoMock = jest.fn();
    const warnMock = jest.fn();
    const errorMock = jest.fn();

    class ConsoleLoggerMock {
      debug(): void { debugMock() };
      log(): void { logMock() };
      info(): void { infoMock() };
      warn(): void { warnMock() };
      error(): void { errorMock() };
    }

    // expose for tests
    const __loggerMocks = {
      debugMock,
      logMock,
      infoMock,
      warnMock,
      errorMock,
    }

    return {
      ...actual,
      ConsoleLogger: ConsoleLoggerMock,

      __loggerMocks: __loggerMocks,
    }
  });
}
