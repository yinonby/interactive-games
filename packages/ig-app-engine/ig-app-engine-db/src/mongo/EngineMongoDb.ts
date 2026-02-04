
import type { EngineDbAdapter, UsersTableAdapter } from '@ig/app-engine-be-models';
import { PackageDb } from '@ig/be-utils';
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
