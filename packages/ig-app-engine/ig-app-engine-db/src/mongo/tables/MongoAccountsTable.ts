
import type { AccountsTableAdapter } from '@ig/app-engine-be-models';
import { BeLogger, MongoDbTable } from '@ig/be-utils';
import type { LoggerAdapter } from '@ig/utils';
import { Schema } from 'mongoose';
import type { AccountIdT, AccountT } from '../../../../ig-app-engine-models';
import { getAccountSchemaDef } from '../schemas/UserSchemaDefs';

export class MongoAccountsTable extends MongoDbTable<AccountT> implements AccountsTableAdapter {
  constructor(
    registerSchema = false,
    tableNamePrefix = '',
    private logger: LoggerAdapter = new BeLogger(),
  ) {
    super(registerSchema, tableNamePrefix);
  }

  // abstract MongoDbTable

  public getTableName(): string {
    return 'Accounts';
  }

  protected getSchema(): Schema<AccountT> {
    const userSchema = new Schema<AccountT>(getAccountSchemaDef(), {
      timestamps: true,
    });
    userSchema.index({ ['accountId']: 1 }, { unique: true });

    return userSchema;
  }

  // interface UsersTableAdapter

  public async getAccounts(): Promise<AccountT[]> {
    return await this.getModel().find({});
  }

  public async getAccount(accountId: AccountIdT): Promise<AccountT | null> {
    const ret = await this.getModel().findOne({ accountId });

    return ret;
  }

  public async createAccount(user: AccountT): Promise<void> {
    await this.getModel().insertOne(user);
  }
}
