

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
