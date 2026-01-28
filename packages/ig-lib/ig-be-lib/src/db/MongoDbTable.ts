
import type { LoggerAdapter } from '@ig/lib';
import {
  model, type Model, type MongooseUpdateQueryOptions,
  type QueryFilter, type Schema, type UpdateQuery
} from "mongoose";
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

  protected getModel(): Model<T> {
    return this.model;
  }

  public async createTable(): Promise<void> {
    await this.model.createCollection();
    await this.model.createIndexes();
  }

  protected async updateExactlyOne(
    filters: QueryFilter<T>,
    input: UpdateQuery<T>,
    options?: MongooseUpdateQueryOptions<T>,
  ): Promise<void> {
    const result = await this.getModel().updateOne(filters, { $set: input }, options);

    if (result.matchedCount !== 1) {
      throw new Error('Expected exactly one document to update');
    }
  }
}
