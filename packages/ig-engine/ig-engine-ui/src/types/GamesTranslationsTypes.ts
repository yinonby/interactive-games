import type { PlayerRoleT, PlayerStatusT } from '@ig/games-models';

export type GamesTranslationKeyT =
  | 'games:noGamesAbailable'
  | 'games:invitationCode'
  | 'games:joinGame'
  | 'games:startGame'
  | 'games:abailableGames'
  | 'games:userNoGamesAbailable'
  | 'games:yourGames'
  | 'games:gameName'
  | 'games:maxParticipants'
  | 'games:extraTimeLimit'
  | 'games:play'
  | 'games:createNewPlayersGroup'
  | 'games:suspend'
  | 'games:activate'
  | 'games:uninvite'
  | 'games:noPlayers'
  | 'games:players'
  | 'games:gameEnded'
  | 'games:gameNotStarted'
  | 'games:gameInProcess'
  | 'games:playerRoleAdmin'
  | 'games:playerRolePlayer'
  | 'games:playerStatusInvited'
  | 'games:playerStatusActive'
  | 'games:playerStatusSuspended'
;

export const playerRoleToStr: Record<PlayerRoleT, GamesTranslationKeyT> = {
  'admin': 'games:playerRoleAdmin',
  'player': 'games:playerRolePlayer'
}

export const playerStatusToStr: Record<PlayerStatusT, GamesTranslationKeyT> = {
  'invited': 'games:playerStatusInvited',
  'active': 'games:playerStatusActive',
  'suspended': 'games:playerStatusSuspended'
}
