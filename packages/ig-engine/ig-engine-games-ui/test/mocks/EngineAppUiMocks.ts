
import type {
  AppConfigContextT, AppLocalizationContextT, AppTranslationKeyT,
  GameImageTypeT, GamesUiUrlPathsAdapter
} from "@ig/engine-app-ui";
import type { GameInstanceIdT } from "@ig/engine-models";
import type { LoggerAdapter } from "@ig/lib";
import type { RnuiImageSourceT } from "@ig/rnui";

export const buildMockedTranslation = (tKey: AppTranslationKeyT) => "mocked-t-" + tKey;

export const initEngineAppUiMocks = () => {
  jest.mock('@ig/engine-app-ui', () => {
    const actual = jest.requireActual<typeof import('@ig/engine-app-ui')>(
      '@ig/engine-app-ui'
    );

    const onErrorMock = jest.fn();
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

    const imagesSourceMap = {
      ["treasure-hunt-1"]: { uri: "http://example.com/cover.png" },
    } as Record<GameImageTypeT, RnuiImageSourceT>;
    const gamesUiUrlPathsAdapter: GamesUiUrlPathsAdapter = {
      buildGamesDashboardUrlPath: (): string => "mockedPathGamesDashboard",
      buildGamesAcceptInviteUrlPath: (invitationCode: string): string => `mockedPathGamesAcceptInvite/${invitationCode}`,
      buildGameInstanceDashboardUrlPath: (gameInstanceId: GameInstanceIdT) => `mockedPathGamesInstance/${gameInstanceId}`,
    } as GamesUiUrlPathsAdapter;
    const useAppConfigMock = (): AppConfigContextT => ({
      imagesSourceMap: imagesSourceMap,
      gameUiConfig: {
        apiUrl: "mockedApiUrl",
        wssUrl: "mockedWssUrl",
        appUrl: "mockedAppUrl",
        isTesting: true,
        isDevel: false,
      },
      gamesUiUrlPathsAdapter: gamesUiUrlPathsAdapter,
    });

    return {
      ...actual,
      useAppErrorHandling: () => ({ onError: onErrorMock }),
      useAppLocalization: useAppLocalizationMock,
      useClientLogger: useClientLoggerMock,
      useAppConfig: useAppConfigMock,

      // expose for tests
      __engineAppUiMocks: {
        loggerErrorMock,
        onErrorMock,
      },
    };
  });
}
