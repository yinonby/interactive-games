
import { EngineMongoDb } from './EngineMongoDb';
import type { MongoAccountsTable } from './tables/MongoAccountsTable';
import * as MongoAccountsTableModule from './tables/MongoAccountsTable';

describe('EngineMongoDb', () => {
  const engineMongoDb: EngineMongoDb = new EngineMongoDb();

  const mock_MongoAccountsTable: MongoAccountsTable = {
    createTable: vi.fn().mockResolvedValue(undefined),
  } as unknown as MongoAccountsTable;
  const MongoAccountsTableSpy = vi.spyOn(MongoAccountsTableModule, 'MongoAccountsTable');
  MongoAccountsTableSpy.mockReturnValue(mock_MongoAccountsTable);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createTables', () => {
    it('should create tables with defult parameters', async () => {
      const registerSchema = true;
      await engineMongoDb.createTables(registerSchema);

      expect(MongoAccountsTableSpy).toHaveBeenCalledWith(registerSchema, undefined);
      expect(mock_MongoAccountsTable.createTable).toHaveBeenCalled();
    });

    it('should create tables with given parameters', async () => {
      const tableNamePrefix = 'test_prefix';
      const registerSchema = true;
      await engineMongoDb.createTables(registerSchema, tableNamePrefix);

      expect(MongoAccountsTableSpy).toHaveBeenCalledWith(registerSchema, tableNamePrefix);
      expect(mock_MongoAccountsTable.createTable).toHaveBeenCalled();
    });
  });

  describe('getAccountsTableAdapter', () => {
    it('should return a MongoAccountsTable instance with default parameters', () => {
      const result = engineMongoDb.getAccountsTableAdapter();

      expect(MongoAccountsTableSpy).toHaveBeenCalledWith(false, undefined);
      expect(result).toBe(mock_MongoAccountsTable);
    });

    it('should return a MongoAccountsTable instance with given parameters', () => {
      const tableNamePrefix = 'test_prefix';
      const result = engineMongoDb.getAccountsTableAdapter(tableNamePrefix);

      expect(MongoAccountsTableSpy).toHaveBeenCalledWith(false, tableNamePrefix);
      expect(result).toBe(mock_MongoAccountsTable);
    });
  });
});