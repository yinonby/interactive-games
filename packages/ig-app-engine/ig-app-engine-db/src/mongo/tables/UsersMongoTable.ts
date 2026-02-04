
import type { UsersTableAdapter } from '@ig/app-engine-be-models';
import { BeLogger, MongoDbTable } from '@ig/be-utils';
import type { LoggerAdapter } from '@ig/utils';
import { Schema } from 'mongoose';
import type { UserIdT, UserT } from '../../../../ig-app-engine-models';
import { userSchemaDef } from '../schemas/UserSchemaDefs';

export class UsersMongoTable extends MongoDbTable<UserT> implements UsersTableAdapter {
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
    const userSchema = new Schema<UserT>(userSchemaDef, {
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

  public async createUser(user: UserT): Promise<void> {
    await this.getModel().insertOne(user);
  }
}
