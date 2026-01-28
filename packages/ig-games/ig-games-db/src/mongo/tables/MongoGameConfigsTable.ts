
import { BeLogger, MongoDbTable } from '@ig/be-lib';
import type { GameConfigsTableAdapter } from '@ig/games-be-models';
import type { GameConfigIdT, GameConfigT, UpdateGameConfigInputT } from '@ig/games-models';
import type { LoggerAdapter } from '@ig/lib';
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
    return await this.getModel().find({});
  }

  public async getGameConfig(gameConfigId: GameConfigIdT): Promise<GameConfigT | null> {
    const ret = await this.getModel().findOne({ gameConfigId });

    return ret;
  }

  public async createGameConfig (gameConfig: GameConfigT): Promise<void> {
    await this.getModel().insertOne(gameConfig);
  }

  public async updateGameConfig(input: UpdateGameConfigInputT): Promise<void> {
    const { gameConfigId, ...rest } = input;

    await this.updateExactlyOne({ gameConfigId }, rest);
  }
}
