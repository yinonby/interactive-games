
import { BeLogger, MongoDbTable } from '@ig/be-utils';
import type { GameConfigsTableAdapter } from '@ig/games-engine-be-models';
import type { GameConfigIdT, GameConfigT, GameInfoNoIdT } from '@ig/games-engine-models';
import type { LoggerAdapter } from '@ig/utils';
import { Schema } from 'mongoose';
import { gameConfigSchemaDef } from '../schemas/GameConfigSchemaDefs';

export class MongoGameConfigsTable extends MongoDbTable<GameConfigT> implements GameConfigsTableAdapter {
  constructor(
    registerSchema = false,
    tableNamePrefix = '',
    private logger: LoggerAdapter = new BeLogger(),
  ) {
    super(registerSchema, tableNamePrefix);
  }

  // abstract MongoDbTable

  public getTableName(): string {
    return 'GameConfigs';
  }

  protected getSchema(): Schema<GameConfigT> {
    const gameConfigSchema = new Schema<GameConfigT>(gameConfigSchemaDef, {
      timestamps: true,
    });
    gameConfigSchema.index({ ['gameConfigId']: 1 }, { unique: true });

    return gameConfigSchema;
  }

  // interface GameConfigsTableAdapter

  public async getGameConfigs(): Promise<GameConfigT[]> {
    return (await this.getModel().find({})).map(e => e.toObject());
  }

  public async getGameConfig(gameConfigId: GameConfigIdT): Promise<GameConfigT | null> {
    const ret = await this.getModel().findOne({ gameConfigId });

    if (ret === null) {
      return null;
    }

    return ret.toObject();
  }

  public async createGameConfig (gameConfigId: GameConfigIdT, gameInfoNoId: GameInfoNoIdT): Promise<void> {
    await this.getModel().insertOne({
      gameConfigId: gameConfigId,
      gameInfoNoId: gameInfoNoId,
    });
  }

  public async updateGameConfig(
    gameConfigId: GameConfigIdT,
    partialGameInfoNoId: Partial<GameInfoNoIdT>
  ): Promise<void> {

    await this.updateExactlyOne({ gameConfigId }, {
      gameInfoNoId: partialGameInfoNoId,
    });
  }
}
