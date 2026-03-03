
import { BeLogger, MongoDbTable } from '@ig/be-utils';
import type { GameUserTableAdapter } from '@ig/games-engine-be-models';
import type { GameConfigIdT, GameUserIdT, GameUserT } from '@ig/games-engine-models';
import { type LoggerAdapter } from '@ig/utils';
import { Schema } from 'mongoose';
import { gameUserSchemaDef } from '../schemas/GameUserSchemaDefs';

export class MongoGameUserTable extends MongoDbTable<GameUserT> implements GameUserTableAdapter {
  constructor(
    registerSchema = false,
    tableNamePrefix = '',
    private logger: LoggerAdapter = new BeLogger(),
  ) {
    super(registerSchema, tableNamePrefix);
  }

  // abstract MongoDbTable

  public getTableName(): string {
    return 'GameUsers';
  }

  protected getSchema(): Schema<GameUserT> {
    const gameUserSchema = new Schema<GameUserT>(gameUserSchemaDef, {
      timestamps: true,
    });
    gameUserSchema.index({ ['gameUserId']: 1 }, { unique: true });

    return gameUserSchema;
  }

  // interface GameUsersTableAdapter

  public async getGameUsers(): Promise<GameUserT[]> {
    const ret = await this.getModel().find({});

    return ret.map(e => e.toObject());
  }

  public async getGameUser(gameUserId: GameUserIdT): Promise<GameUserT | null> {
    const ret = await this.getModel().findOne({ gameUserId });
    if (ret === null) {
      return null;
    }

    return ret.toObject();
  }

  public async createGameUser(gameUser: GameUserT): Promise<void> {
    await this.getModel().insertOne({
      ...gameUser,
    });
  }

  public async addGameConfigId(gameUserId: GameUserIdT, gameConfigId: GameConfigIdT): Promise<void> {
    await this.getModel().updateOne({ gameUserId }, {
      $push: { joinedGameConfigIds: gameConfigId },
    });
  }
}
