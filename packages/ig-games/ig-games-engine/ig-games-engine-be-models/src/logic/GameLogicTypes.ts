
import type {
  AddPlayerInputT,
  GameConfigIdT,
  GameConfigNoIdT, GameConfigT,
  GameInstanceIdT,
  PublicGameInstanceT,
  StartPlayingInputT,
  SubmitGuessInputT,
  UpdateGameConfigInputT, UpdateGameConfigResultT
} from '@ig/games-engine-models';

export interface GameConfigLogicAdapter {
  getGameConfigs(): Promise<GameConfigT[]>;
  getGameConfig(gameConfigId: GameConfigIdT): Promise<GameConfigT | null>;
  createGameConfig(gameConfigId: GameConfigIdT, gameConfigNoId: GameConfigNoIdT): Promise<void>;
  updateGameConfig(input: UpdateGameConfigInputT): Promise<UpdateGameConfigResultT>;
}

export interface GameInstanceLogicAdapter {
  getGameConfigInstanceIds(gameConfigId: GameConfigIdT): Promise<GameInstanceIdT[]>;
  getPublicGameInstance(gameInstanceId: GameInstanceIdT): Promise<PublicGameInstanceT | null>;
  addPlayer(input: AddPlayerInputT): Promise<void>;
  startPlaying(input: StartPlayingInputT): Promise<void>;
  submitGuess(input: SubmitGuessInputT): Promise<boolean>;
}
