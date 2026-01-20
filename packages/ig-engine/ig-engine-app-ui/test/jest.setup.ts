
import '@testing-library/jest-native/extend-expect';
// figure out why cannot export these from @ig/rn-testing
import { initPlatformUiMocks } from '../../../ig-dev-lib/ig-rn-testing/src/mocks/PlatformUiMocks';
import { initReactNativeMocks } from '../../../ig-dev-lib/ig-rn-testing/src/mocks/ReactNativeMocks';
import { initRnuiMocks } from '../../../ig-dev-lib/ig-rn-testing/src/mocks/RnuiMocks';
import { initClientUtilsMocks } from './mocks/LoggerMocks';

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

initReactNativeMocks();
initRnuiMocks();
initClientUtilsMocks();
initPlatformUiMocks();

declare module "@ig/platform-ui" {
  export const __puiMocks: {
    navigateMock: jest.Mock,
    navigateReplaceMock: jest.Mock,
    getItemMock: jest.Mock,
    setItemMock: jest.Mock,
  };
}

declare module "@ig/client-utils" {
  export const __loggerMocks: {
    debugMock: jest.Mock,
    logMock: jest.Mock,
    infoMock: jest.Mock,
    warnMock: jest.Mock,
    errorMock: jest.Mock,
  };
}
