
import type { AccountIdT } from '@ig/app-engine-models';
import type { GameStateT } from './GameStateTypes';
import type { GameInfoT } from './GameTypes';

export type GameInstanceIdT = string;

export type GameInstanceExposedInfoT = {
  gameInstanceId: GameInstanceIdT,
  invitationCode: string,
  gameInfo: GameInfoT,
  gameState: GameStateT,
  playerExposedInfos: [PlayerExposedInfoT, ...PlayerExposedInfoT[]], // at least one player
}

export type PlayerRoleT = 'admin' | 'player';
export type PlayerStatusT = 'invited' | 'active' | 'suspended';

export type PlayerExposedInfoT = {
  playerAccountId: AccountIdT,
  playerNickname: string,
  playerRole: PlayerRoleT,
  playerStatus: PlayerStatusT,
}

export type ChatMsgIdT = string;

export type GameInstanceChatMessageT = {
  gameInstanceId: GameInstanceIdT,
  chatMsgId: ChatMsgIdT,
  sentTs: number,
  playerAccountId: AccountIdT,
  msgText: string,
}
