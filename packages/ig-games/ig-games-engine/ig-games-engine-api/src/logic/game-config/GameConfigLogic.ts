
import type { GameConfigLogicAdapter, GameConfigsTableAdapter } from '@ig/games-engine-be-models';
import type {
  GameConfigIdT, GameConfigT, GameInfoNoIdT, GameInfoT,
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

  public async getGameInfos(): Promise<GameInfoT[]> {
    const gameConfigs = await this.gameConfigsTableAdapter.getGameConfigs();
    return gameConfigs.map(e => ({
      gameConfigId: e.gameConfigId,
      ...e.gameInfoNoId,
    }));
  }

  public async getGameInfo(gameConfigId: GameConfigIdT): Promise<GameInfoT | null> {
    const gameConfig = await this.gameConfigsTableAdapter.getGameConfig(gameConfigId);

    if (gameConfig === null) {
      return null;
    }
    return {
      gameConfigId: gameConfig.gameConfigId,
      ...gameConfig.gameInfoNoId,
    }
  }

  public async createGameConfig(gameConfigId: GameConfigIdT, gameInfoNoId: GameInfoNoIdT): Promise<void> {
    return await this.gameConfigsTableAdapter.createGameConfig(gameConfigId, gameInfoNoId);
  }

  public async updateGameConfig(input: UpdateGameConfigInputT): Promise<UpdateGameConfigResultT> {
    const { gameConfigId, ...rest } = input;
    await this.gameConfigsTableAdapter.updateGameConfig(gameConfigId, rest);

    return { status: 'ok' };
  }
}
