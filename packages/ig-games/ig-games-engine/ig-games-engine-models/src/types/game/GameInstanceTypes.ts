
import type { AccountIdT } from '@ig/app-engine-models';
import type { ChatConversationIdT } from '@ig/chat-models';
import type { GameStateT } from './GameStateTypes';
import type { PublicGameConfigT } from './GameTypes';

export type GameInstanceIdT = string;
export const getGameInstanceConversationId = (gameInstanceId: GameInstanceIdT): ChatConversationIdT => {
  return 'GI-' + gameInstanceId;
}

export type PublicGameInstanceT = {
  gameInstanceId: GameInstanceIdT,
  invitationCode: string,
  publicGameConfig: PublicGameConfigT,
  gameState: GameStateT,
  publicPlayerInfos: [PublicPlayerInfoT, ...PublicPlayerInfoT[]], // at least one player
}

export type PublicGameInstanceWithoutIdT = Omit<PublicGameInstanceT, 'gameInstanceId'>;

export type GameInstanceT = PublicGameInstanceT;
export type GameInstanceWithoutIdT = Omit<GameInstanceT, 'gameInstanceId'>;

export type PlayerRoleT = 'admin' | 'player';
export type PlayerStatusT = 'invited' | 'active' | 'suspended';

export type PublicPlayerInfoT = {
  playerAccountId: AccountIdT,
  playerNickname: string,
  playerRole: PlayerRoleT,
  playerStatus: PlayerStatusT,
}
