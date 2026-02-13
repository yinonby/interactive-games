
import type { AccountsTableAdapter, EngineDbAdapter, UsersTableAdapter } from '@ig/app-engine-be-models';
import { PackageDb } from '@ig/be-utils';
import { MongoAccountsTable } from './tables/MongoAccountsTable';
import { UsersMongoTable } from './tables/UsersMongoTable';

export class EngineMongoDb extends PackageDb implements EngineDbAdapter {
  // interface PackageDbAdapter
  public async createTables(registerSchema: boolean, tableNamePrefix?: string): Promise<void> {
    const mongoUsersTable: UsersMongoTable = new UsersMongoTable(registerSchema, tableNamePrefix);
    const mongoAccountsTable: MongoAccountsTable = new MongoAccountsTable(registerSchema, tableNamePrefix);

    await mongoUsersTable.createTable();
    await mongoAccountsTable.createTable();
  }

  // interface GamesDbAdapter
  public getUsersTableAdapter(
    tableNamePrefix?: string,
  ): UsersTableAdapter {
    return new UsersMongoTable(false, tableNamePrefix);
  }

  public getAccountsTableAdapter(
    tableNamePrefix?: string,
  ): AccountsTableAdapter {
    return new MongoAccountsTable(false, tableNamePrefix);
  }
}
