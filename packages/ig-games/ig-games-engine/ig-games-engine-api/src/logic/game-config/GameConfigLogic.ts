
import type { GameConfigLogicAdapter, GameConfigsTableAdapter } from '@ig/games-engine-be-models';
import type {
  GameConfigIdT,
  GameConfigNoIdT, GameConfigT,
  PublicGameConfigT,
  UpdateGameConfigInputT, UpdateGameConfigResultT
} from '@ig/games-engine-models';
import { GamesApiError } from '../../types/GamesPluginTypes';

export class GameConfigLogic implements GameConfigLogicAdapter {
  constructor(
    private gameConfigsTableAdapter: GameConfigsTableAdapter,
  ) { }

  public async getGameConfigs(): Promise<GameConfigT[]> {
    return await this.gameConfigsTableAdapter.getGameConfigs();
  }

  public async getPublicGameConfigs(gameConfigIds?: GameConfigIdT[]): Promise<PublicGameConfigT[]> {
    // TODO: implement toPublic()
    return await this.gameConfigsTableAdapter.getGameConfigs(gameConfigIds);
  }

  public async getGameConfig(gameConfigId: GameConfigIdT): Promise<GameConfigT> {
    const gameConfig =  await this.gameConfigsTableAdapter.getGameConfig(gameConfigId);

    if (gameConfig === null) {
      throw new GamesApiError('Game config not found', 'gamesApiError:gameConfigNotFound');
    }
    return gameConfig;
  }

  public async getPublicGameConfig(gameConfigId: GameConfigIdT): Promise<PublicGameConfigT> {
    const publicGameConfig =  await this.gameConfigsTableAdapter.getGameConfig(gameConfigId);

    if (publicGameConfig === null) {
      throw new GamesApiError('Game config not found', 'gamesApiError:gameConfigNotFound');
    }
    return publicGameConfig;
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
