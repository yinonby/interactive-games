
import { EngineMongoDb } from './EngineMongoDb';
import type { MongoAccountsTable } from './tables/MongoAccountsTable';
import * as MongoAccountsTableModule from './tables/MongoAccountsTable';
import * as UsersMongoTableModule from './tables/UsersMongoTable';
import { type UsersMongoTable } from './tables/UsersMongoTable';

describe('EngineMongoDb', () => {
  const mongoGamesDb: EngineMongoDb = new EngineMongoDb();

  const mockUsersMongoTable: UsersMongoTable = {
    createTable: vi.fn().mockResolvedValue(undefined),
  } as unknown as UsersMongoTable;
  const UsersMongoTableSpy = vi.spyOn(UsersMongoTableModule, 'UsersMongoTable');
  UsersMongoTableSpy.mockReturnValue(mockUsersMongoTable)

  const mockMongoAccountsTable: MongoAccountsTable = {
    createTable: vi.fn().mockResolvedValue(undefined),
  } as unknown as MongoAccountsTable;
  const MongoAccountsTableSpy = vi.spyOn(MongoAccountsTableModule, 'MongoAccountsTable');
  MongoAccountsTableSpy.mockReturnValue(mockMongoAccountsTable)

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createTables', () => {
    it('should create tables with defult parameters', async () => {
      const registerSchema = true;
      await mongoGamesDb.createTables(registerSchema);

      expect(UsersMongoTableSpy).toHaveBeenCalledWith(registerSchema, undefined);
      expect(mockUsersMongoTable.createTable).toHaveBeenCalled();
    });

    it('should create tables with given parameters', async () => {
      const tableNamePrefix = 'test_prefix';
      const registerSchema = true;
      await mongoGamesDb.createTables(registerSchema, tableNamePrefix);

      expect(UsersMongoTableSpy).toHaveBeenCalledWith(registerSchema, tableNamePrefix);
      expect(mockUsersMongoTable.createTable).toHaveBeenCalled();
    });
  });

  describe('getUsersTableAdapter', () => {
    it('should return a UsersMongoTable instance with default parameters', () => {
      const result = mongoGamesDb.getUsersTableAdapter();

      expect(UsersMongoTableSpy).toHaveBeenCalledWith(false, undefined);
      expect(result).toBe(mockUsersMongoTable);
    });

    it('should return a UsersMongoTable instance with given parameters', () => {
      const tableNamePrefix = 'test_prefix';
      const result = mongoGamesDb.getUsersTableAdapter(tableNamePrefix);

      expect(UsersMongoTableSpy).toHaveBeenCalledWith(false, tableNamePrefix);
      expect(result).toBe(mockUsersMongoTable);
    });
  });

  describe('getAccountsTableAdapter', () => {
    it('should return a MongoAccountsTable instance with default parameters', () => {
      const result = mongoGamesDb.getAccountsTableAdapter();

      expect(MongoAccountsTableSpy).toHaveBeenCalledWith(false, undefined);
      expect(result).toBe(mockMongoAccountsTable);
    });

    it('should return a MongoAccountsTable instance with given parameters', () => {
      const tableNamePrefix = 'test_prefix';
      const result = mongoGamesDb.getAccountsTableAdapter(tableNamePrefix);

      expect(MongoAccountsTableSpy).toHaveBeenCalledWith(false, tableNamePrefix);
      expect(result).toBe(mockMongoAccountsTable);
    });
  });
});