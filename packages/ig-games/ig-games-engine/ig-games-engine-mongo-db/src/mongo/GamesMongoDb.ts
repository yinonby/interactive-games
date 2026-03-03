
import { PackageDb } from '@ig/be-utils';
import type {
  GameConfigsTableAdapter, GameInstancesTableAdapter,
  GameUserTableAdapter
} from '@ig/games-engine-be-models';
import { type GamesDbAdapter } from '@ig/games-engine-be-models';
import { MongoGameConfigsTable } from './tables/MongoGameConfigsTable';
import { MongoGameInstancesTable } from './tables/MongoGameInstancesTable';
import { MongoGameUserTable } from './tables/MongoGameUserTable';

export class GamesMongoDb extends PackageDb implements GamesDbAdapter {
  // interface PackageDbAdapter
  public async createTables(registerSchema: boolean, tableNamePrefix?: string): Promise<void> {
    const mongoGameUserTable: MongoGameUserTable = new MongoGameUserTable(registerSchema, tableNamePrefix);
    const mongoGameConfigsTable: MongoGameConfigsTable = new MongoGameConfigsTable(registerSchema, tableNamePrefix);
    const mongoGameInstancesTable: MongoGameInstancesTable =
      new MongoGameInstancesTable(registerSchema, tableNamePrefix);

    await mongoGameUserTable.createTable();
    await mongoGameConfigsTable.createTable();
    await mongoGameInstancesTable.createTable();
  }

  // interface GamesDbAdapter
  public getGameUserTableAdapter(tableNamePrefix?: string,): GameUserTableAdapter {
    return new MongoGameUserTable(false, tableNamePrefix);
  }

  public getGameConfigsTableAdapter(tableNamePrefix?: string,): GameConfigsTableAdapter {
    return new MongoGameConfigsTable(false, tableNamePrefix);
  }

  public getGameInstancesTableAdapter(tableNamePrefix?: string): GameInstancesTableAdapter {
    return new MongoGameInstancesTable(false, tableNamePrefix);
  }
}
