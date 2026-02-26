

import type {
  GameConfigIdT, GameConfigNoIdT, GameConfigT,
  GameInstanceIdT,
  PublicGameInstanceT,
  PublicPlayerInfoT
} from '@ig/games-engine-models';

// game configs

export interface GamesDbAdapter {
  getGameConfigsTableAdapter: (
    tableNamePrefix?: string,
  ) => GameConfigsTableAdapter;

  getGameInstancesTableAdapter: (
    tableNamePrefix?: string,
  ) => GameInstancesTableAdapter;
}

export interface GameConfigsTableAdapter {
  getGameConfigs: () => Promise<GameConfigT[]>;
  getGameConfig(gameConfigId: GameConfigIdT): Promise<GameConfigT | null>;
  createGameConfig: (gameConfigId: GameConfigIdT, gameConfigNoId: GameConfigNoIdT) => Promise<void>;
  updateGameConfig(gameConfigId: GameConfigIdT, partialGameConfigNoId: Partial<GameConfigNoIdT>): Promise<void>;
}

export interface GameInstancesTableAdapter {
  getGameConfigInstanceIds(gameConfigId: GameConfigIdT): Promise<GameInstanceIdT[]>;
  getPublicGameInstance(gameInstanceId: GameInstanceIdT): Promise<PublicGameInstanceT | null>;
  addPlayer(gameInstanceId: GameInstanceIdT, publicPlayerInfo: PublicPlayerInfoT): Promise<void>;
  startPlaying(gameInstanceId: GameInstanceIdT): Promise<void>;
  submitGuess(gameInstanceId: GameInstanceIdT, levelId: number, guess: string): Promise<boolean>;
}
