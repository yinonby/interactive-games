
export type GamesApiServerErrorCodeT =
  | 'gamesApiError:unknownError'
  | 'gamesApiError:notAuthenticated'
  | 'gamesApiError:invalidInvitationCode'
  | 'gamesApiError:gameConfigNotFound'
  | 'gamesApiError:gameInstanceAlreadyJoined'
  | 'gamesApiError:gameInstanceNotFound'
  | 'gamesApiError:cannotRetrievePlayerNickname'
  | 'gamesApiError:invalidInput'
;