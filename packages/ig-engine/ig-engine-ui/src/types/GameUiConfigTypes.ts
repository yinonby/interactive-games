
export type GameUiConfigT = {
  apiUrl: string,
  wssUrl: string,
  appUrl: string,
  isTesting: boolean,
  isDevel: boolean,
}

export interface GameUiUrlPathsAdapter {
  buildGamesDashboardUrlPath: () => string,
  buildGamesAcceptInviteUrlPath: (invitationCode: string) => string,
  buildGameInstanceDashboardUrlPath: (gameInstanceId: string) => string,
}
