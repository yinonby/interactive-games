
import { GamesMongoDb } from './GamesMongoDb';
import * as MongoGameConfigsTableModule from './tables/MongoGameConfigsTable';
import { type MongoGameConfigsTable } from './tables/MongoGameConfigsTable';
import type { MongoGameInstancesTable } from './tables/MongoGameInstancesTable';
import * as MongoGameInstancesTableModule from './tables/MongoGameInstancesTable';
import type { MongoGameUserTable } from './tables/MongoGameUserTable';
import * as MongoGameUserTableModule from './tables/MongoGameUserTable';

describe('GamesMongoDb', () => {
  const mongoGamesDb: GamesMongoDb = new GamesMongoDb();

  const spy_MongoGameUserTable = vi.spyOn(MongoGameUserTableModule, 'MongoGameUserTable');
  const mock_MongoGameUserTable: MongoGameUserTable = {
    createTable: vi.fn().mockResolvedValue(undefined),
  } as unknown as MongoGameUserTable;
  spy_MongoGameUserTable.mockReturnValue(mock_MongoGameUserTable);

  const spy_MongoGameConfigsTable = vi.spyOn(MongoGameConfigsTableModule, 'MongoGameConfigsTable');
  const mock_MongoGameConfigsTable: MongoGameConfigsTable = {
    createTable: vi.fn().mockResolvedValue(undefined),
  } as unknown as MongoGameConfigsTable;
  spy_MongoGameConfigsTable.mockReturnValue(mock_MongoGameConfigsTable);

  const spy_MongoGameInstancesTable = vi.spyOn(MongoGameInstancesTableModule, 'MongoGameInstancesTable');
  const mock_MongoGameInstancesTable: MongoGameInstancesTable = {
    createTable: vi.fn().mockResolvedValue(undefined),
  } as unknown as MongoGameInstancesTable;
  spy_MongoGameInstancesTable.mockReturnValue(mock_MongoGameInstancesTable);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createTables', () => {
    it('should create tables with defult parameters', async () => {
      const registerSchema = true;
      await mongoGamesDb.createTables(registerSchema);

      expect(spy_MongoGameUserTable).toHaveBeenCalledWith(registerSchema, undefined);
      expect(mock_MongoGameUserTable.createTable).toHaveBeenCalled();
      expect(spy_MongoGameConfigsTable).toHaveBeenCalledWith(registerSchema, undefined);
      expect(mock_MongoGameConfigsTable.createTable).toHaveBeenCalled();
      expect(spy_MongoGameInstancesTable).toHaveBeenCalledWith(registerSchema, undefined);
      expect(mock_MongoGameInstancesTable.createTable).toHaveBeenCalled();
    });

    it('should create tables with given parameters', async () => {
      const tableNamePrefix = 'test_prefix';
      const registerSchema = true;
      await mongoGamesDb.createTables(registerSchema, tableNamePrefix);

      expect(spy_MongoGameUserTable).toHaveBeenCalledWith(registerSchema, tableNamePrefix);
      expect(mock_MongoGameUserTable.createTable).toHaveBeenCalled();
      expect(spy_MongoGameConfigsTable).toHaveBeenCalledWith(registerSchema, tableNamePrefix);
      expect(mock_MongoGameConfigsTable.createTable).toHaveBeenCalled();
      expect(spy_MongoGameInstancesTable).toHaveBeenCalledWith(registerSchema, tableNamePrefix);
      expect(mock_MongoGameInstancesTable.createTable).toHaveBeenCalled();
    });
  });

  describe('getGameUserTableAdapter', () => {
    it('should return a MongoGameUserTable instance with default parameters', () => {
      const result = mongoGamesDb.getGameUserTableAdapter();

      expect(spy_MongoGameUserTable).toHaveBeenCalledWith(false, undefined);
      expect(result).toBe(mock_MongoGameUserTable);
    });

    it('should return a MongoGameUserTable instance with given parameters', () => {
      const tableNamePrefix = 'test_prefix';
      const result = mongoGamesDb.getGameUserTableAdapter(tableNamePrefix);

      expect(spy_MongoGameUserTable).toHaveBeenCalledWith(false, tableNamePrefix);
      expect(result).toBe(mock_MongoGameUserTable);
    });
  });

  describe('getGameConfigsTableAdapter', () => {
    it('should return a MongoGameConfigsTable instance with default parameters', () => {
      const result = mongoGamesDb.getGameConfigsTableAdapter();

      expect(spy_MongoGameConfigsTable).toHaveBeenCalledWith(false, undefined);
      expect(result).toBe(mock_MongoGameConfigsTable);
    });

    it('should return a MongoGameConfigsTable instance with given parameters', () => {
      const tableNamePrefix = 'test_prefix';
      const result = mongoGamesDb.getGameConfigsTableAdapter(tableNamePrefix);

      expect(spy_MongoGameConfigsTable).toHaveBeenCalledWith(false, tableNamePrefix);
      expect(result).toBe(mock_MongoGameConfigsTable);
    });
  });

  describe('getGameInstancesTableAdapter', () => {
    it('should return a MongoGameInstancesTable instance with default parameters', () => {
      const result = mongoGamesDb.getGameInstancesTableAdapter();

      expect(spy_MongoGameInstancesTable).toHaveBeenCalledWith(false, undefined);
      expect(result).toBe(mock_MongoGameInstancesTable);
    });

    it('should return a MongoGameInstancesTable instance with given parameters', () => {
      const tableNamePrefix = 'test_prefix';
      const result = mongoGamesDb.getGameInstancesTableAdapter(tableNamePrefix);

      expect(spy_MongoGameInstancesTable).toHaveBeenCalledWith(false, tableNamePrefix);
      expect(result).toBe(mock_MongoGameInstancesTable);
    });
  });
});