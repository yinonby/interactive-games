
export type GameUiConfigT = {
  apiUrl: string,
  wssUrl: string,
  appUrl: string,
  isTesting: boolean,
  isDevel: boolean,
}

export interface GamesUiUrlPathsAdapter {
  buildGamesDashboardUrlPath: () => string,
  buildGamesAcceptInviteUrlPath: (invitationCode: string) => string,
  buildGameInstanceDashboardUrlPath: (gameInstanceId: string) => string,
}
