
import { BeLogger, MongoDbTable } from '@ig/be-lib';
import type { UsersTableAdapter } from '@ig/engine-be-models';
import type { UserIdT, UserT } from '@ig/engine-models';
import type { LoggerAdapter } from '@ig/lib';
import { Schema } from 'mongoose';
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
