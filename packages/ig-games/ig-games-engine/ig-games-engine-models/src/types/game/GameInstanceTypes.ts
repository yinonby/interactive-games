
import type { AccountIdT } from '@ig/app-engine-models';
import type { ChatConversationIdT } from '@ig/chat-models';
import type { GameStateT } from './GameStateTypes';
import type { PublicGameConfigT } from './GameTypes';

export type GameInstanceIdT = string;
export const getGameInstanceConversationId = (gameInstanceId: GameInstanceIdT): ChatConversationIdT => {
  return 'GI-' + gameInstanceId;
}

export type GameInstanceExposedInfoT = {
  gameInstanceId: GameInstanceIdT,
  invitationCode: string,
  gameInfo: PublicGameConfigT,
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
