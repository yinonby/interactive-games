

import '@testing-library/jest-native/extend-expect';
// figure out why cannot export these from @ig/rn-testing
import { initReactNativeMocks } from '../../../ig-dev-lib/ig-rn-testing/src/mocks/ReactNativeMocks';
import { initRnuiMocks } from '../../../ig-dev-lib/ig-rn-testing/src/mocks/RnuiMocks';
import { initEngineAppUiMocks } from './mocks/EngineAppUiMocks';
import { initPlatformUiMocks } from './mocks/PlatformUiMocks';

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

initRnuiMocks();
initReactNativeMocks();
initEngineAppUiMocks();
initPlatformUiMocks();

declare module "@ig/platform-ui" {
  export const __puiMocks: {
    navigateMock: jest.Mock,
    navigateReplaceMock: jest.Mock,
  };
}

declare module "@ig/engine-app-ui" {
  export const __engineAppUiMocks: {
    loggerErrorMock: jest.Mock,
    onErrorMock: jest.Mock,
  };
}

