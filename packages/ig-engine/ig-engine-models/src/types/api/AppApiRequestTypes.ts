import type { GamesConfigT, GamesUserConfigT } from '../game/GamesConfigTypes';
import type {
  ChatMsgIdT,
  GameConfigIdT,
  GameInstanceChatMessageT,
  GameInstanceExposedInfoT,
  GameInstanceIdT
} from "../game/GameTypes";
import type { UserIdT } from "../game/UserTypes";

// get::app-config
export type GetAppConfigResponseT = {
  version: string,
}

// get::games/games-config
export type GetGamesConfigResponseT = {
  gamesConfig: GamesConfigT,
}

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

// get::games/game-instance/<id>/chat
export type GetGameInstanceChatResponseT = {
  chatMessages: GameInstanceChatMessageT[],
}

export type PostGameInstanceChatMessageParamsT = {
  gameInstanceId: GameInstanceIdT,
  playerUserId: UserIdT,
  chatMessage: string,
}

// post::games/game-instance<id>/msg
export type PostGameInstanceChatMessageResponseT = {
  chatMsgId: ChatMsgIdT,
}
