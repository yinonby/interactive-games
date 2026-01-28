
import type { UserIdT } from '@ig/engine-models';
import type { GameStateT } from './GameStateTypes';
import type { GameConfigT } from './GameTypes';

export type GameInstanceIdT = string;

export type GameInstanceExposedInfoT = {
  gameInstanceId: GameInstanceIdT,
  invitationCode: string,
  gameConfig: GameConfigT,
  gameState: GameStateT,
  playerExposedInfos: [PlayerExposedInfoT, ...PlayerExposedInfoT[]], // at least one player
}

export type PlayerRoleT = 'admin' | 'player';
export type PlayerStatusT = 'invited' | 'active' | 'suspended';

export type PlayerExposedInfoT = {
  playerUserId: UserIdT,
  playerNickname: string,
  playerRole: PlayerRoleT,
  playerStatus: PlayerStatusT,
}

export type ChatMsgIdT = string;

export type GameInstanceChatMessageT = {
  gameInstanceId: GameInstanceIdT,
  chatMsgId: ChatMsgIdT,
  sentTs: number,
  playerUserId: UserIdT,
  msgText: string,
}
