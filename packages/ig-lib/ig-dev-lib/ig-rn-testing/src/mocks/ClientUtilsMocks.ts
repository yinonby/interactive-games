
export const initClientUtilsMocks = () => {
  jest.mock('@ig/client-utils', () => {
    const actual = jest.requireActual<typeof import('../../../../ig-client-lib/ig-client-utils')>('@ig/client-utils');

    const traceMock = jest.fn();
    const debugMock = jest.fn();
    const infoMock = jest.fn();
    const warnMock = jest.fn();
    const errorMock = jest.fn();

    class ConsoleLoggerMock {
      trace(): void { traceMock() };
      debug(): void { debugMock() };
      info(): void { infoMock() };
      warn(): void { warnMock() };
      error(): void { errorMock() };
    }

    // expose for tests
    const __loggerMocks = {
      debugMock,
      traceMock,
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
