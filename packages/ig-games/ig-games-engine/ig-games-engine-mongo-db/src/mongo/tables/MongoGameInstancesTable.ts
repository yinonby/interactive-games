
import { BeLogger, MongoDbTable } from '@ig/be-utils';
import type { GameInstancesTableAdapter } from '@ig/games-engine-be-models';
import type { GameConfigIdT, GameInstanceIdT, GameInstanceT, LevelStateT, PublicGameInstanceT, PublicPlayerInfoT } from '@ig/games-engine-models';
import { type LoggerAdapter } from '@ig/utils';
import { Schema } from 'mongoose';
import { gameInstanceSchemaDef } from '../schemas/GameInstanceSchemaDefs';

export class MongoGameInstancesTable extends MongoDbTable<GameInstanceT> implements GameInstancesTableAdapter {
  constructor(
    registerSchema = false,
    tableNamePrefix = '',
    private logger: LoggerAdapter = new BeLogger(),
  ) {
    super(registerSchema, tableNamePrefix);
  }

  // abstract MongoDbTable

  public getTableName(): string {
    return 'GameInstances';
  }

  protected getSchema(): Schema<GameInstanceT> {
    const gameInstanceSchema = new Schema<GameInstanceT>(gameInstanceSchemaDef, {
      timestamps: true,
    });
    gameInstanceSchema.index({ ['gameInstanceId']: 1 }, { unique: true });

    return gameInstanceSchema;
  }

  // interface GameInstancesTableAdapter

  public async getGameInstances(): Promise<GameInstanceT[]> {
    const ret = await this.getModel().find({});

    return ret.map(e => e.toObject());
  }

  public async getGameInstanceIdsForGameConfig(gameConfigId: GameConfigIdT): Promise<GameInstanceIdT[]> {
    const result = await this.getModel().find({
      ['publicGameConfig.gameConfigId']: gameConfigId,
    });
    const gameInstances = result.map(e => e.toObject());

    return gameInstances.map(e => e.gameInstanceId);
  }

  public async getGameInstance(gameInstanceId: GameInstanceIdT): Promise<GameInstanceT | null> {
    const ret = await this.getModel().findOne({ gameInstanceId });
    if (ret === null) {
      return null;
    }

    return ret.toObject();
  }

  public async getPublicGameInstance(gameInstanceId: GameInstanceIdT): Promise<PublicGameInstanceT | null> {
    const ret = await this.getModel().findOne({ gameInstanceId });
    if (ret === null) {
      return null;
    }

    return ret.toObject();
  }

  public async getGameInstanceByInvitationCode(invitationCode: string): Promise<GameInstanceT | null> {
    const ret = await this.getModel().findOne({ invitationCode });

    if (ret === null) {
      return null;
    }

    return ret.toObject();
  }

  public async createGameInstance(gameInstance: GameInstanceT): Promise<void> {
    await this.getModel().insertOne({
      ...gameInstance,
    });
  }

  public async addPlayer(gameInstanceId: GameInstanceIdT, publicPlayerInfo: PublicPlayerInfoT): Promise<void> {
    await this.getModel().updateOne({ gameInstanceId }, {
      $push: { publicPlayerInfos: publicPlayerInfo },
    });
  }

  public async startPlaying(gameInstanceId: GameInstanceIdT): Promise<void> {
    await this.updateExactlyOne({ gameInstanceId }, {
      ['gameState.gameStatus']: 'inProcess',
    });
  }

  public async updateLevelState(
    gameInstanceId: GameInstanceIdT,
    levelIdx: number,
    levelState: LevelStateT,
  ): Promise<void> {
    await this.updateExactlyOne({ gameInstanceId }, {
      ['gameState.levelStates.' + levelIdx]: levelState,
    });
  }
}
