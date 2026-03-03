

import type {
  GameConfigIdT, GameConfigNoIdT, GameConfigT,
  GameInstanceIdT,
  GameInstanceT,
  GameUserIdT,
  GameUserT,
  LevelStateT,
  PublicGameInstanceT,
  PublicPlayerInfoT
} from '@ig/games-engine-models';
import type { Request } from 'express';

// game configs

export interface GamesDbAdapter {
  getGameUserTableAdapter: (tableNamePrefix?: string) => GameUserTableAdapter;
  getGameConfigsTableAdapter: (tableNamePrefix?: string) => GameConfigsTableAdapter;
  getGameInstancesTableAdapter: (tableNamePrefix?: string) => GameInstancesTableAdapter;
}

export interface GameUserTableAdapter {
  getGameUser(gameUserId: GameUserIdT): Promise<GameUserT | null>;
  createGameUser(gameUser: GameUserT): Promise<void>;
  addGameConfigId(gameUserId: GameUserIdT, gameConfigId: GameConfigIdT): Promise<void>;
}

export interface GameConfigsTableAdapter {
  getGameConfigs: (gameConfigIds?: GameConfigIdT[]) => Promise<GameConfigT[]>;
  getGameConfig(gameConfigId: GameConfigIdT): Promise<GameConfigT | null>;
  createGameConfig: (gameConfigId: GameConfigIdT, gameConfigNoId: GameConfigNoIdT) => Promise<void>;
  updateGameConfig(gameConfigId: GameConfigIdT, partialGameConfigNoId: Partial<GameConfigNoIdT>): Promise<void>;
}

export interface GameInstancesTableAdapter {
  getGameInstanceIdsForGameConfig(gameConfigId: GameConfigIdT): Promise<GameInstanceIdT[]>;
  getGameInstance(gameInstanceId: GameInstanceIdT): Promise<GameInstanceT | null>;
  getPublicGameInstance(gameInstanceId: GameInstanceIdT): Promise<PublicGameInstanceT | null>;
  getGameInstanceByInvitationCode(invitationCode: string): Promise<GameInstanceT | null>;
  createGameInstance(gameInstance: GameInstanceT): Promise<void>;
  addPlayer(gameInstanceId: GameInstanceIdT, publicPlayerInfo: PublicPlayerInfoT): Promise<void>;
  startPlaying(gameInstanceId: GameInstanceIdT): Promise<void>;
  updateLevelState(gameInstanceId: GameInstanceIdT, levelIdx: number, levelState: LevelStateT): Promise<void>;
}

export interface GamesRequestAdapter {
  extractGameUserId(req: Request): GameUserIdT | null;
}

export interface GamesUserAdapter {
  retrieveGameUserInfo(gameUserId: GameUserIdT): Promise<{ playerNickname: string | null }>;
}
