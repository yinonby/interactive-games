
import { PackageDb } from '@ig/be-lib';
import type { GameConfigsTableAdapter } from '@ig/games-be-models';
import { type GamesDbAdapter } from '@ig/games-be-models';
import { MongoGameConfigsTable } from './tables/MongoGameConfigsTable';

export class GamesMongoDb extends PackageDb implements GamesDbAdapter {
  // interface PackageDbAdapter
  public async createTables(registerSchema: boolean, tableNamePrefix?: string): Promise<void> {
    const mongoGameConfigsTable: MongoGameConfigsTable = new MongoGameConfigsTable(registerSchema, tableNamePrefix);

    await mongoGameConfigsTable.createTable();
  }

  // interface GamesDbAdapter
  public getGameConfigsTableAdapter(
    tableNamePrefix?: string,
  ): GameConfigsTableAdapter {
    return new MongoGameConfigsTable(false, tableNamePrefix);
  }
}
