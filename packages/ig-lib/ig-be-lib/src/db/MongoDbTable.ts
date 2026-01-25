
import type { LoggerAdapter } from '@ig/lib';
import { model, type Model, type Schema } from "mongoose";
import { BeLogger } from '../logger/BeLogger';

export abstract class MongoDbTable<T> {
  private model: Model<T>;

  protected abstract getTableName(): string;
  protected abstract getSchema(): Schema<T>;

  constructor(
    registerSchema: boolean,
    tableNamePrefix = '',
    private _logger: LoggerAdapter = new BeLogger(),
  ) {
    const fullTableName = tableNamePrefix + this.getTableName();

    if (registerSchema) {
      this._logger.info(`Registering schema, tableName [${fullTableName}]`);

      const schema = this.getSchema();
      this.model = model<T>(fullTableName, schema);
    } else {
      this.model = model<T>(fullTableName);
    }
  }

  public getModel(): Model<T> {
    return this.model;
  }

  public async createTable(): Promise<void> {
    await this.model.createCollection();
    await this.model.createIndexes();
  }
}
