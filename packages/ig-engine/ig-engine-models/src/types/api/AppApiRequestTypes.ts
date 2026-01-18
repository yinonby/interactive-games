import type {
  ChatMsgIdT,
  GameConfigIdT,
  GameInstanceChatMessageT,
  GameInstanceExposedInfoT,
  GameInstanceIdT, MinimalGameConfigT
} from "../game/GameTypes";
import type { UserIdT } from "../game/UserTypes";
import type { UserConfigT } from "../user/UserTypes";

// get/app-config
export type GetAppConfigResponseT = {
  availableMinimalGameConfigs: MinimalGameConfigT[],
}

// get/user-config
export type GetUserConfigResponseT = {
  userConfig: UserConfigT
}

// post/play-game
export type PostPlayGameRequestBodyT = {
  gameConfigId: GameConfigIdT,
}

export type PostPlayGameResponseT = {
  gameInstanceId: GameInstanceIdT,
}

// post/accept-invite
export type PostAcceptInviteRequestBodyT = {
  invitationCode: string,
}

export type PostAcceptInviteResponseT = {
  gameInstanceId: GameInstanceIdT,
}

// get/game-instance
export type GetGameInstanceRequestT = {
  gameInstanceId: GameInstanceIdT,
}

export type GetGameInstanceResponseT = {
  gameInstanceExposedInfo: GameInstanceExposedInfoT,
}

// get/game-instance/<id>/chat
export type GetGameInstanceChatResponseT = {
  chatMessages: GameInstanceChatMessageT[],
}

export type PostGameInstanceChatMessageParamT = {
  gameInstanceId: GameInstanceIdT,
  playerUserId: UserIdT,
  chatMessage: string,
}

// post/game-instance<id>/msg
export type PostGameInstanceChatMessageResponseT = {
  chatMsgId: ChatMsgIdT,
}
