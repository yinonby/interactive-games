
import { PackageDb } from '@ig/be-lib';
import type { EngineDbAdapter, UsersTableAdapter } from '@ig/engine-be-models';
import { UsersMongoTable } from './tables/UsersMongoTable';

export class EngineMongoDb extends PackageDb implements EngineDbAdapter {
  // interface PackageDbAdapter
  public async createTables(registerSchema: boolean, tableNamePrefix?: string): Promise<void> {
    const mongoUsersTable: UsersMongoTable = new UsersMongoTable(registerSchema, tableNamePrefix);

    await mongoUsersTable.createTable();
  }

  // interface GamesDbAdapter
  public getUsersTableAdapter(
    tableNamePrefix?: string,
  ): UsersTableAdapter {
    return new UsersMongoTable(false, tableNamePrefix);
  }
}
