
import type {
  AddGameConfigIdInputT,
  AddGameConfigIdResultT,
  CreateGameInstanceInputT,
  GameConfigIdT,
  GameConfigNoIdT, GameConfigT,
  GameInstanceIdT,
  GameUserIdT,
  GameUserT,
  JoinGameByInviteInputT,
  PublicGameConfigT,
  PublicGameInstanceT,
  PublicGameUserT,
  StartPlayingInputT,
  SubmitGuessInputT,
  UpdateGameConfigInputT, UpdateGameConfigResultT
} from '@ig/games-engine-models';

export interface GameUserLogicAdapter {
  getGameUser(gameUserId: GameUserIdT): Promise<GameUserT | null>;
  getPublicGameUser(gameUserId: GameUserIdT): Promise<PublicGameUserT>;
  createGameUser(gameUserId: GameUserIdT): Promise<void>;
  addGameConfigId(gameUserId: GameUserIdT, input: AddGameConfigIdInputT): Promise<AddGameConfigIdResultT>;
}

export interface GameConfigLogicAdapter {
  getGameConfigs(): Promise<GameConfigT[]>;
  getPublicGameConfigs(gameConfigIds?: GameConfigIdT[]): Promise<GameConfigT[]>;
  getGameConfig(gameConfigId: GameConfigIdT): Promise<GameConfigT>;
  getPublicGameConfig(gameConfigId: GameConfigIdT): Promise<PublicGameConfigT>;
  createGameConfig(gameConfigId: GameConfigIdT, gameConfigNoId: GameConfigNoIdT): Promise<void>;
  updateGameConfig(input: UpdateGameConfigInputT): Promise<UpdateGameConfigResultT>;
}

export interface GameInstanceLogicAdapter {
  getGameInstanceIdsForGameConfig(gameUserId: GameUserIdT, args: { gameConfigId: GameConfigIdT }): Promise<GameInstanceIdT[]>;
  getPublicGameInstance(gameUserId: GameUserIdT, args: { gameInstanceId: GameInstanceIdT }): Promise<PublicGameInstanceT>;
  createGameInstance(gameUserId: GameUserIdT, args: CreateGameInstanceInputT): Promise<GameInstanceIdT>;
  joinGameByInvite(gameUserId: GameUserIdT, args: JoinGameByInviteInputT): Promise<GameInstanceIdT>;
  startPlaying(gameUserId: GameUserIdT, args: StartPlayingInputT): Promise<void>;
  submitGuess(gameUserId: GameUserIdT, args: SubmitGuessInputT): Promise<boolean>;
}
