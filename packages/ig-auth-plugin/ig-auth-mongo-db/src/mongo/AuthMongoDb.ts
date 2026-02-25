
import type {
  AuthDbAdapter,
  SignupPluginTransactionAdapter,
  SignupServiceTransactionAdapter, UsersTableAdapter
} from '@ig/auth-be-models';
import { PackageDb } from '@ig/be-utils';
import { MongoSignupServiceTransaction } from './services/auth/MongoSignupServiceTransaction';
import { MongoUsersTable } from './tables/MongoUsersTable';

export class AuthMongoDb extends PackageDb implements AuthDbAdapter {
  // interface PackageDbAdapter
  public async createTables(registerSchema: boolean, tableNamePrefix?: string): Promise<void> {
    const mongoUsersTable: MongoUsersTable = new MongoUsersTable(registerSchema, tableNamePrefix);

    await mongoUsersTable.createTable();
  }

  // interface GamesDbAdapter
  public getUsersTableAdapter(
    tableNamePrefix?: string,
  ): UsersTableAdapter {
    return new MongoUsersTable(false, tableNamePrefix);
  }

  public getSignupServiceTransactionAdapter(
    tableNamePrefix?: string,
    signupPluginTransactionAdapter?: SignupPluginTransactionAdapter,
  ): SignupServiceTransactionAdapter {
    const mongoUsersTable: UsersTableAdapter = this.getUsersTableAdapter(tableNamePrefix);
    const signupTransactionServiceAdapter: SignupServiceTransactionAdapter =
      new MongoSignupServiceTransaction(mongoUsersTable, signupPluginTransactionAdapter);

    return signupTransactionServiceAdapter;
  }
}
