

import '@testing-library/jest-native/extend-expect';
// figure out why cannot export these from @ig/rn-testing
import type { GamesUiUrlPathsAdapter } from '@ig/engine-app-ui';
import { initPlatformUiMocks } from '../../../ig-dev-lib/ig-rn-testing/src/mocks/PlatformUiMocks';
import { initReactNativeMocks } from '../../../ig-dev-lib/ig-rn-testing/src/mocks/ReactNativeMocks';
import { initRnuiMocks } from '../../../ig-dev-lib/ig-rn-testing/src/mocks/RnuiMocks';
import { initEngineAppUiMocks } from './mocks/EngineAppUiMocks';

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

initReactNativeMocks();
initRnuiMocks();
initEngineAppUiMocks();
initPlatformUiMocks();

declare module "@ig/platform-ui" {
  export const __puiMocks: {
    navigateMock: jest.Mock,
    navigateReplaceMock: jest.Mock,
    getItemMock: jest.Mock,
    setItemMock: jest.Mock,
  };
}

type UseAppConfigFnT = typeof import('@ig/engine-app-ui')['useAppConfig'];
type BuildGamesDashboardUrlPathMockFnT = GamesUiUrlPathsAdapter['buildGamesDashboardUrlPath'];
type BuildGamesAcceptInviteUrlPathFnT = GamesUiUrlPathsAdapter['buildGamesAcceptInviteUrlPath'];
type BuildGameInstanceDashboardUrlPathMockFnT = GamesUiUrlPathsAdapter['buildGameInstanceDashboardUrlPath'];

declare module "@ig/engine-app-ui" {
  export const __engineAppUiMocks: {
    loggerErrorMock: jest.Mock,
    onAppErrorMock: jest.Mock,
    onUnknownErrorMock: jest.Mock,
    useAppConfigMock: jest.MockedFunction<UseAppConfigFnT>,
    buildGamesDashboardUrlPathMock: jest.MockedFunction<BuildGamesDashboardUrlPathMockFnT>,
    buildGamesAcceptInviteUrlPathMock: jest.MockedFunction<BuildGamesAcceptInviteUrlPathFnT>,
    buildGameInstanceDashboardUrlPathMock: jest.MockedFunction<BuildGameInstanceDashboardUrlPathMockFnT>,
  };
}
