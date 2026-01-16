
import type {
  ChatMsgIdT,
  GameConfigIdT,
  GameInstanceChatMessageT,
  GameInstanceExposedInfoT, GameInstanceIdT, MinimalGameConfigT, MinimalGameInstanceExposedInfoT,
  UserIdT
} from "@ig/engine-models";

export type DataSrcVersionT = string;

export type UserConfigT = {
  userId: UserIdT,
  username: string,
  minimalGameInstanceExposedInfos: MinimalGameInstanceExposedInfoT[],
}

export type UserConfigeWbSocketMsgKindT = "user-config-update";
export type GameInstanceUpdateWebSocketMsgKindT = "game-instance-update";
export type AppWebSocketRcvMsgKindT = UserConfigeWbSocketMsgKindT | GameInstanceUpdateWebSocketMsgKindT;

export type GameInstanceWebSocketMessagePayloadT = { gameInstanceId: GameInstanceIdT };
export type AppWebSocketMessagePayloadT = GameInstanceWebSocketMessagePayloadT;

// api responses

export type GetAppConfigResponseT = {
  availableMinimalGameConfigs: MinimalGameConfigT[],
}

export type GetUserConfigResponseT = {
  userConfig: UserConfigT
}

export type PostPlayGameRequestBodyT = {
  gameConfigId: GameConfigIdT,
}

export type PostPlayGameResponseT = {
  gameInstanceId: GameInstanceIdT,
}

export type PostAcceptInviteRequestBodyT = {
  invitationCode: string,
}

export type PostAcceptInviteResponseT = {
  gameInstanceId: GameInstanceIdT,
}

export type GetGameInstanceRequestT = {
  gameInstanceId: GameInstanceIdT,
}

export type GetGameInstanceResponseT = {
  gameInstanceExposedInfo: GameInstanceExposedInfoT,
}

export type GetGameInstanceChatResponseT = {
  chatMessages: GameInstanceChatMessageT[],
}

export type PostGameInstanceChatMessageParamT = {
  gameInstanceId: GameInstanceIdT,
  playerUserId: UserIdT,
  chatMessage: string,
}

export type PostGameInstanceChatMessageResponseT = {
  chatMsgId: ChatMsgIdT,
}

