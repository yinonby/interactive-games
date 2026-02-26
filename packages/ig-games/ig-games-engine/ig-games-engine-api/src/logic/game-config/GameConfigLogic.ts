
import type { GameConfigLogicAdapter, GameConfigsTableAdapter } from '@ig/games-engine-be-models';
import type {
  GameConfigIdT,
  GameConfigNoIdT, GameConfigT,
  UpdateGameConfigInputT, UpdateGameConfigResultT
} from '@ig/games-engine-models';

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

  public async createGameConfig(gameConfigId: GameConfigIdT, gameConfigNoId: GameConfigNoIdT): Promise<void> {
    return await this.gameConfigsTableAdapter.createGameConfig(gameConfigId, gameConfigNoId);
  }

  public async updateGameConfig(input: UpdateGameConfigInputT): Promise<UpdateGameConfigResultT> {
    const { gameConfigId, partialGameConfigNoId } = input;
    await this.gameConfigsTableAdapter.updateGameConfig(gameConfigId, partialGameConfigNoId);

    return { status: 'ok' };
  }
}
