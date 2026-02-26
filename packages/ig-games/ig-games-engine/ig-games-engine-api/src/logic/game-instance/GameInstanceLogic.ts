
import type { GameInstanceLogicAdapter, GameInstancesTableAdapter } from '@ig/games-engine-be-models';
import type {
  AddPlayerInputT,
  GameConfigIdT,
  GameInstanceIdT,
  PublicGameInstanceT,
  StartPlayingInputT,
  SubmitGuessInputT
} from '@ig/games-engine-models';

export class GameInstanceLogic implements GameInstanceLogicAdapter {
  constructor(
    private gameInstancesTableAdapter: GameInstancesTableAdapter,
  ) { }

  public async getGameConfigInstanceIds(gameConfigId: GameConfigIdT): Promise<GameInstanceIdT[]> {
    return await this.gameInstancesTableAdapter.getGameConfigInstanceIds(gameConfigId);
  }

  public async getPublicGameInstance(gameInstanceId: GameInstanceIdT): Promise<PublicGameInstanceT | null> {
    return await this.gameInstancesTableAdapter.getPublicGameInstance(gameInstanceId);
  }

  public async addPlayer(input: AddPlayerInputT): Promise<void> {
    return await this.gameInstancesTableAdapter.addPlayer(input.gameInstanceId, input.publicPlayerInfo);
  }

  public async startPlaying(input: StartPlayingInputT): Promise<void> {
    return await this.gameInstancesTableAdapter.startPlaying(input.gameInstanceId);
  }

  public async submitGuess(input: SubmitGuessInputT): Promise<boolean> {
    return await this.gameInstancesTableAdapter.submitGuess(input.gameInstanceId, input.levelIdx, input.guess);
  }
}
