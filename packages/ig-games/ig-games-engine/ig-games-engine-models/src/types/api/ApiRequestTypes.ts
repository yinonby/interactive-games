
import type {
  GameInstanceExposedInfoT,
  GameInstanceIdT
} from '../game/GameInstanceTypes';
import type { GamesUserConfigT } from '../game/GamesConfigTypes';
import type {
  GameConfigIdT
} from '../game/GameTypes';

// get::games/user-config
export type GetGamesUserConfigResponseT = {
  gamesUserConfig: GamesUserConfigT,
}

// post::games/user-config/play-game
export type PostPlayGameRequestBodyT = {
  gameConfigId: GameConfigIdT,
}

export type PostPlayGameResponseT = {
  status: 'ok',
}

// post::games/user-config/accept-invite
export type PostAcceptInviteRequestBodyT = {
  invitationCode: string,
}

export type PostAcceptInviteResponseT = {
  gameConfigId: GameConfigIdT,
  gameInstanceId: GameInstanceIdT,
}

// post::games/user-config/create-game-instance
export type PostCreateGameInstanceRequestBodyT = {
  gameConfigId: GameConfigIdT,
}

export type PostCreateGameInstanceResponseT = {
  gameInstanceId: GameInstanceIdT,
}

// get::game/<id>/game-instances
export type GetGameInstancesRequestT = {
  gameConfigId: GameConfigIdT,
}

export type GetGameInstancesResponseT = {
  gameInstanceIds: GameInstanceIdT[],
}

// get::games/game-instance/<id>
export type GetGameInstanceRequestT = {
  gameInstanceId: GameInstanceIdT,
}

export type GetGameInstanceResponseT = {
  gameInstanceExposedInfo: GameInstanceExposedInfoT,
}

// post::games/game-instance/<id>/start
export type PostGameInstanceStartRequestT = {
  gameInstanceId: GameInstanceIdT,
}

export type PostGameInstanceStartResponseT = {
  status: 'ok',
}

// post::games/game-instance/<id>/submit-guess
export type PostGameInstanceSubmitGuessParamsT = {
  gameInstanceId: GameInstanceIdT,
  levelIdx: number,
  guess: string,
}

export type PostGameInstanceSubmitGuessResponseT = {
  isGuessCorrect: boolean,
}
