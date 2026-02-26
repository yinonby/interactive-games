

import type { GameConfigIdT, GameConfigNoIdT, GameConfigT } from '@ig/games-engine-models';

// game configs

export interface GamesDbAdapter {
  getGameConfigsTableAdapter: (
    tableNamePrefix?: string,
  ) => GameConfigsTableAdapter;
}

export interface GameConfigsTableAdapter {
  getGameConfigs: () => Promise<GameConfigT[]>;
  getGameConfig(gameConfigId: GameConfigIdT): Promise<GameConfigT | null>;
  createGameConfig: (gameConfigId: GameConfigIdT, gameConfigNoId: GameConfigNoIdT) => Promise<void>;
  updateGameConfig(gameConfigId: GameConfigIdT, partialGameConfigNoId: Partial<GameConfigNoIdT>): Promise<void>;
}
