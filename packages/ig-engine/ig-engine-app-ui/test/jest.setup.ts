
import '@testing-library/jest-native/extend-expect';
// figure out why cannot export these from @ig/rn-testing
import { initReactNativeMocks } from '../../../ig-dev-lib/ig-rn-testing/src/mocks/ReactNativeMocks';
import { initRnuiMocks } from '../../../ig-dev-lib/ig-rn-testing/src/mocks/RnuiMocks';
import { initLoggerMocks } from './mocks/LoggerMocks';

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

initReactNativeMocks();
initRnuiMocks();
initLoggerMocks();

declare module "@ig/client-utils" {
  export const __loggerMocks: {
    debugMock: jest.Mock,
    logMock: jest.Mock,
    infoMock: jest.Mock,
    warnMock: jest.Mock,
    errorMock: jest.Mock,
  };
}
