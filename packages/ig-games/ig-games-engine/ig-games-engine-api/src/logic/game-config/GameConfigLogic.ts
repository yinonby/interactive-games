
import type { GameConfigLogicAdapter, GameConfigsTableAdapter } from '@ig/games-engine-be-models';
import type { GameConfigIdT, GameConfigT, UpdateGameConfigInputT, UpdateGameConfigResultT } from '@ig/games-engine-models';

export class GameConfigLogic implements GameConfigLogicAdapter {
  constructor(
    private gameConfigsTableAdapter: GameConfigsTableAdapter,
  ) { }

  public async getGameConfigs(): Promise<GameConfigT[]> {
    return await this.gameConfigsTableAdapter.getGameConfigs();
  }

  public async getGameConfig(gameConfigId: GameConfigIdT): Promise<GameConfigT | null> {
    return await this.gameConfigsTableAdapter.getGameConfig(gameConfigId);
  }

  public async createGameConfig(gameConfig: GameConfigT): Promise<void> {
    return await this.gameConfigsTableAdapter.createGameConfig(gameConfig);
  }

  public async updateGameConfig(input: UpdateGameConfigInputT): Promise<UpdateGameConfigResultT> {
    await this.gameConfigsTableAdapter.updateGameConfig(input);

    return { status: 'ok' };
  }
}
