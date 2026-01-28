
import type { GameUiConfigT, GamesUiUrlPathsAdapter } from "@ig/engine-ui";
import type { RnuiStylesT } from "@ig/rnui";
import Constants from 'expo-constants';

const getEnvVar = (envVarName: string): string => {
  const envVar: string | undefined = Constants.expoConfig?.extra?.env[envVarName];
  if (!envVar) {
    throw new Error("Missing env var: " + envVarName);
  }
  return envVar;
}

export const useGameUiConfig = (): GameUiConfigT => {
  const apiUrl: string | undefined = getEnvVar('apiUrl');
  const wssUrl: string | undefined = getEnvVar('wssUrl');
  const appUrl: string | undefined = getEnvVar('appUrl');

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
    buildGameDashboardUrlPath: (gameConfigId: string) => `app/games/${gameConfigId}/dashboard`,
    buildGameInstanceDashboardUrlPath: (gameInstanceId: string) => `app/games/instance/${gameInstanceId}/dashboard`,
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
