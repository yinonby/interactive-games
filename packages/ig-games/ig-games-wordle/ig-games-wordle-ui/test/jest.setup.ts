
import '@testing-library/jest-native/extend-expect';
// figure out why cannot export these from @ig/rn-testing
import type { GamesUiUrlPathsAdapter } from '@ig/app-engine-ui';
import { initAuthUiMocks } from '@ig/rn-testing/src/mocks/AuthUiMocks';
import { initPlatformUiMocks } from '@ig/rn-testing/src/mocks/PlatformUiMocks';
import { initReactNativeMocks } from '@ig/rn-testing/src/mocks/ReactNativeMocks';
import { initRnuiMocks } from '@ig/rn-testing/src/mocks/RnuiMocks';
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
initAuthUiMocks();

declare module "@ig/platform-ui" {
  export const __puiMocks: {
    navigateMock: jest.Mock,
    navigateReplaceMock: jest.Mock,
    getItemMock: jest.Mock,
    setItemMock: jest.Mock,
  };
}

type UseAppConfigFnT = typeof import('@ig/app-engine-ui')['useAppConfig'];
type BuildGamesDashboardUrlPathMockFnT = GamesUiUrlPathsAdapter['buildGamesDashboardUrlPath'];
type BuildGamesAcceptInviteUrlPathFnT = GamesUiUrlPathsAdapter['buildGamesAcceptInviteUrlPath'];
type BuildGameDashboardUrlPathFnT = GamesUiUrlPathsAdapter['buildGameDashboardUrlPath'];
type BuildGameInstanceDashboardUrlPathMockFnT = GamesUiUrlPathsAdapter['buildGameInstanceDashboardUrlPath'];

declare module "@ig/app-engine-ui" {
  export const __engineAppUiMocks: {
    loggerErrorMock: jest.Mock,
    onAppErrorMock: jest.Mock,
    onUnknownErrorMock: jest.Mock,
    useAppConfigMock: jest.MockedFunction<UseAppConfigFnT>,
    buildGamesDashboardUrlPathMock: jest.MockedFunction<BuildGamesDashboardUrlPathMockFnT>,
    buildGamesAcceptInviteUrlPathMock: jest.MockedFunction<BuildGamesAcceptInviteUrlPathFnT>,
    buildGameDashboardUrlPathMock: jest.MockedFunction<BuildGameDashboardUrlPathFnT>,
    buildGameInstanceDashboardUrlPathMock: jest.MockedFunction<BuildGameInstanceDashboardUrlPathMockFnT>,
  };
}

declare module "@ig/rnui" {
  export const __rnuiMocks: {
    onShowSnackbarMock: jest.Mock,
  };
}
