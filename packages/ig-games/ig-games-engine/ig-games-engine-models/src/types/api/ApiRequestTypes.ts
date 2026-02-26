
import type {
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
