
import type { AccountsTableAdapter, EngineDbAdapter } from '@ig/app-engine-be-models';
import { PackageDb } from '@ig/be-utils';
import { MongoAccountsTable } from './tables/MongoAccountsTable';

export class EngineMongoDb extends PackageDb implements EngineDbAdapter {
  // interface PackageDbAdapter
  public async createTables(registerSchema: boolean, tableNamePrefix?: string): Promise<void> {
    const mongoAccountsTable: MongoAccountsTable = new MongoAccountsTable(registerSchema, tableNamePrefix);

    await mongoAccountsTable.createTable();
  }

  public getAccountsTableAdapter(
    tableNamePrefix?: string,
  ): AccountsTableAdapter {
    return new MongoAccountsTable(false, tableNamePrefix);
  }
}
