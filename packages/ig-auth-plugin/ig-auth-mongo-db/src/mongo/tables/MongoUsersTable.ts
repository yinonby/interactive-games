
import type { UsersTableAdapter } from '@ig/auth-be-models';
import type { UserIdT, UserT } from '@ig/auth-models';
import { BeLogger, MongoDbTable, type MongoDbTransactionContext } from '@ig/be-utils';
import type { LoggerAdapter } from '@ig/utils';
import { Schema } from 'mongoose';
import { getUserSchemaDef } from '../schemas/UserSchemaDefs';

export class MongoUsersTable extends MongoDbTable<UserT> implements UsersTableAdapter {
  constructor(
    registerSchema = false,
    tableNamePrefix = '',
    private logger: LoggerAdapter = new BeLogger(),
  ) {
    super(registerSchema, tableNamePrefix);
  }

  // abstract MongoDbTable

  public getTableName(): string {
    return 'Users';
  }

  protected getSchema(): Schema<UserT> {
    const userSchema = new Schema<UserT>(getUserSchemaDef(), {
      timestamps: true,
    });
    userSchema.index({ ['userId']: 1 }, { unique: true });

    return userSchema;
  }

  // interface UsersTableAdapter

  public async getUsers(): Promise<UserT[]> {
    return await this.getModel().find({});
  }

  public async getUser(userId: UserIdT): Promise<UserT | null> {
    const ret = await this.getModel().findOne({ userId });

    return ret;
  }

  public async createUser(
    user: UserT,
    ctx?: MongoDbTransactionContext,
  ): Promise<void> {
    await this.getModel().insertOne(user, { session: ctx?.session });
  }
}
