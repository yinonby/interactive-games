
import type {
  AppConfigContextT, AppLocalizationContextT, AppTranslationKeyT,
  GamesUiUrlPathsAdapter
} from "@ig/engine-app-ui";
import type { AppImageAssetT } from "@ig/engine-models";
import type { LoggerAdapter } from "@ig/lib";
import type { RnuiImageSourceT } from "@ig/rnui";

export const buildMockedTranslation = (tKey: AppTranslationKeyT) => "mocked-t-" + tKey;

export const initEngineAppUiMocks = () => {
  jest.mock('@ig/engine-app-ui', () => {
    const actual = jest.requireActual<typeof import('@ig/engine-app-ui')>(
      '@ig/engine-app-ui'
    );

    const onAppErrorMock = jest.fn();
    const onUnknownErrorMock = jest.fn();
    const loggerErrorMock = jest.fn();

    const useClientLoggerMock = (): LoggerAdapter => {
      return {
        debug: (): void => { },
        log: (): void => { },
        info: (): void => { },
        warn: (): void => { },
        error: loggerErrorMock,
      }
    }

    const useAppLocalizationMock = (): AppLocalizationContextT => ({
      t: jest.fn((tKey: AppTranslationKeyT) => "mocked-t-" + tKey),
    });

    // useAppConfig mocks
    const imagesSourceMap = {
      ["treasure-hunt-1"]: { uri: "http://example.com/cover.png" },
    } as Record<AppImageAssetT, RnuiImageSourceT>;
    const buildGamesDashboardUrlPathMock = jest.fn();
    const buildGamesAcceptInviteUrlPathMock = jest.fn();
    const buildGameDashboardUrlPathMock = jest.fn();
    const buildGameInstanceDashboardUrlPathMock = jest.fn();
    const gamesUiUrlPathsAdapter: GamesUiUrlPathsAdapter = {
      buildGamesDashboardUrlPath: buildGamesDashboardUrlPathMock,
      buildGamesAcceptInviteUrlPath: buildGamesAcceptInviteUrlPathMock,
      buildGameDashboardUrlPath: buildGameDashboardUrlPathMock,
      buildGameInstanceDashboardUrlPath: buildGameInstanceDashboardUrlPathMock,
    } as GamesUiUrlPathsAdapter;
    const useAppConfigMock = jest.fn((): AppConfigContextT => ({
      imagesSourceMap: imagesSourceMap,
      gameUiConfig: {
        apiUrl: "mockedApiUrl",
        wssUrl: "mockedWssUrl",
        appUrl: "mockedAppUrl",
        isTesting: true,
        isDevel: false,
      },
      gamesUiUrlPathsAdapter: gamesUiUrlPathsAdapter,
    } as AppConfigContextT));

    return {
      ...actual,
      useAppErrorHandling: () => ({ onAppError: onAppErrorMock, onUnknownError: onUnknownErrorMock }),
      useAppLocalization: useAppLocalizationMock,
      useClientLogger: useClientLoggerMock,
      useAppConfig: useAppConfigMock,

      // expose for tests
      __engineAppUiMocks: {
        loggerErrorMock,
        onAppErrorMock,
        onUnknownErrorMock,
        useAppConfigMock,
        buildGamesDashboardUrlPathMock,
        buildGamesAcceptInviteUrlPathMock,
        buildGameDashboardUrlPathMock,
        buildGameInstanceDashboardUrlPathMock,
      },
    };
  });
}
