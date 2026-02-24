
import type { ChatMessageT, ChatMsgIdT, ConversationIdT } from '@ig/games-engine-models';

import type { GameConfigIdT, GameConfigT, GameInfoNoIdT } from '@ig/games-engine-models';

// game configs

export interface GamesDbAdapter {
  getGameConfigsTableAdapter: (
    tableNamePrefix?: string,
  ) => GameConfigsTableAdapter;
}

export interface GameConfigsTableAdapter {
  getGameConfigs: () => Promise<GameConfigT[]>;
  getGameConfig(gameConfigId: GameConfigIdT): Promise<GameConfigT | null>;
  createGameConfig: (gameConfigId: GameConfigIdT, gameInfoNoId: GameInfoNoIdT) => Promise<void>;
  updateGameConfig(gameConfigId: GameConfigIdT, partialGameInfoNoId: Partial<GameInfoNoIdT>): Promise<void>;
}

// game chat

export interface GamesChatDbAdapter {
  init(): Promise<void>;
  getGameInstanceChatMessagesTableAdapter(): GamesChatMessagesTableAdapter;
}

export interface GamesChatMessagesTableAdapter {
  createMessage(
    conversationKind: 'gameInstanceChat',
    conversationId: ConversationIdT,
    playerAccountId: string,
    msgText: string,
    sentTs: number,
  ): Promise<ChatMsgIdT>;

  getMostRecentMessagesForGameInstance(
    conversationId: ConversationIdT,
    limit: number,
  ): Promise<ChatMessageT[]>;

  getPriorMessagesForGameInstance(
    conversationId: ConversationIdT,
    beforePaginationId: number,
    limit: number,
  ): Promise<ChatMessageT[]>;

  getNewerMessagesForGameInstance(
    conversationId: ConversationIdT,
    afterPaginationId: number,
    limit: number,
  ): Promise<ChatMessageT[]>;
}