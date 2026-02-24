
import type { AccountIdT } from '@ig/app-engine-models';
import type { GameStateT } from './GameStateTypes';
import type { GameInfoT } from './GameTypes';

export type GameInstanceIdT = string;
export const getGameInstanceConversationId = (gameInstanceId: GameInstanceIdT): ConversationIdT => {
  return 'GI-' + gameInstanceId;
}

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

export type ConversationIdT = string;
export type ChatMsgIdT = string;

export type ChatMessageT = {
  conversationKind: 'gameInstanceChat',
  conversationId: ConversationIdT,
  chatMsgId: ChatMsgIdT,
  senderAccountId: AccountIdT,
  sentTs: number,
  msgText: string,
  paginationId: number,
}
