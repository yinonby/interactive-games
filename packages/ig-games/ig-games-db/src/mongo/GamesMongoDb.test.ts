
import { GamesMongoDb } from './GamesMongoDb';
import * as MongoGameConfigsTableModule from './tables/MongoGameConfigsTable';
import { type MongoGameConfigsTable } from './tables/MongoGameConfigsTable';

describe('GamesMongoDb', () => {
  const mongoGamesDb: GamesMongoDb = new GamesMongoDb();
  const mockMongoGameConfigsTable: MongoGameConfigsTable = {
    createTable: vi.fn().mockResolvedValue(undefined),
  } as unknown as MongoGameConfigsTable;
  const MongoGameConfigsTableSpy = vi.spyOn(MongoGameConfigsTableModule, 'MongoGameConfigsTable');
  MongoGameConfigsTableSpy.mockReturnValue(mockMongoGameConfigsTable)

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createTables', () => {
    it('should create tables with defult parameters', async () => {
      const registerSchema = true;
      await mongoGamesDb.createTables(registerSchema);

      expect(MongoGameConfigsTableSpy).toHaveBeenCalledWith(registerSchema, undefined);
      expect(mockMongoGameConfigsTable.createTable).toHaveBeenCalled();
    });

    it('should create tables with given parameters', async () => {
      const tableNamePrefix = 'test_prefix';
      const registerSchema = true;
      await mongoGamesDb.createTables(registerSchema, tableNamePrefix);

      expect(MongoGameConfigsTableSpy).toHaveBeenCalledWith(registerSchema, tableNamePrefix);
      expect(mockMongoGameConfigsTable.createTable).toHaveBeenCalled();
    });
  });

  describe('getGameConfigsTableAdapter', () => {
    it('should return a MongoGameConfigsTable instance with default parameters', () => {
      const result = mongoGamesDb.getGameConfigsTableAdapter();

      expect(MongoGameConfigsTableSpy).toHaveBeenCalledWith(false, undefined);
      expect(result).toBe(mockMongoGameConfigsTable);
    });

    it('should return a MongoGameConfigsTable instance with given parameters', () => {
      const tableNamePrefix = 'test_prefix';
      const result = mongoGamesDb.getGameConfigsTableAdapter(tableNamePrefix);

      expect(MongoGameConfigsTableSpy).toHaveBeenCalledWith(false, tableNamePrefix);
      expect(result).toBe(mockMongoGameConfigsTable);
    });
  });
});