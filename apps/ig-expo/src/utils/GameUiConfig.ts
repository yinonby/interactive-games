
import type { GameUiConfigT, GamesUiUrlPathsAdapter } from "@ig/engine-ui";
import type { RnuiStylesT } from "@ig/rnui";

export const useGameUiConfig = (): GameUiConfigT => {
  const apiUrl: string | undefined = process.env.EXPO_PUBLIC__GAME_UI__API_URL;
  const wssUrl: string | undefined = process.env.EXPO_PUBLIC__GAME_UI__WSS_URL;
  const appUrl: string | undefined = process.env.EXPO_PUBLIC__GAME_UI__APP_URL;

  if (apiUrl === undefined) {
    throw new Error("Game api url not initialized");
  } else if (wssUrl === undefined) {
    throw new Error("Game wss url not initialized");
  }else if (appUrl === undefined) {
    throw new Error("Game app url not initialized");
  }

  return {
    apiUrl: apiUrl,
    wssUrl: wssUrl,
    appUrl: appUrl,
    isTesting: process.env.NODE_ENV === 'test',
    isDevel: process.env.NODE_ENV === 'development',
  }
}

export const useGamesUiUrlPathsAdapter = (): GamesUiUrlPathsAdapter => {
  return {
    buildGamesDashboardUrlPath: () => "/app/games/dashboard",
    buildGamesAcceptInviteUrlPath: (invitationCode: string) => `app/games/accept-invite/${invitationCode}`,
    buildGameInstanceDashboardUrlPath: (gameInstanceId: string) => `app/games/${gameInstanceId}/dashboard`,
  }
}

export const useGameRnuiStyles = (): RnuiStylesT => {
  return {
      xsButtonLabelStyle: {
        margin: 8,
        fontSize: 12,
        lineHeight: 16,
      }
    }
}
