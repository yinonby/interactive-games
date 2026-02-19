
import type { SignupPluginTransactionAdapter } from '@ig/auth-be-models/src/logic/AuthLogicTypes';
import { AuthMongoDb } from './AuthMongoDb';
import type { MongoSignupServiceTransaction } from './services/auth/MongoSignupServiceTransaction';
import * as MongoSignupTransactionAdapterModule from './services/auth/MongoSignupServiceTransaction';
import * as UsersMongoTableModule from './tables/MongoUsersTable';
import { type MongoUsersTable } from './tables/MongoUsersTable';

describe('AuthMongoDb', () => {
  const authMongoDb: AuthMongoDb = new AuthMongoDb();

  const mock_UsersMongoTable: MongoUsersTable = {
    createTable: vi.fn().mockResolvedValue(undefined),
  } as unknown as MongoUsersTable;
  const UsersMongoTableSpy = vi.spyOn(UsersMongoTableModule, 'MongoUsersTable');
  UsersMongoTableSpy.mockReturnValue(mock_UsersMongoTable);

  const mock_MongoSignupTransactionAdapter: MongoSignupServiceTransaction = {
    signup: vi.fn().mockResolvedValue(undefined),
  } as unknown as MongoSignupServiceTransaction;
  const spy_MongoSignupTransactionAdapter =
    vi.spyOn(MongoSignupTransactionAdapterModule, 'MongoSignupServiceTransaction');
  spy_MongoSignupTransactionAdapter.mockReturnValue(mock_MongoSignupTransactionAdapter);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createTables', () => {
    it('should create tables with defult parameters', async () => {
      const registerSchema = true;
      await authMongoDb.createTables(registerSchema);

      expect(UsersMongoTableSpy).toHaveBeenCalledWith(registerSchema, undefined);
      expect(mock_UsersMongoTable.createTable).toHaveBeenCalled();
    });

    it('should create tables with given parameters', async () => {
      const tableNamePrefix = 'test_prefix';
      const registerSchema = true;
      await authMongoDb.createTables(registerSchema, tableNamePrefix);

      expect(UsersMongoTableSpy).toHaveBeenCalledWith(registerSchema, tableNamePrefix);
      expect(mock_UsersMongoTable.createTable).toHaveBeenCalled();
    });
  });

  describe('getUsersTableAdapter', () => {
    it('should return a MongoUsersTable instance with default parameters', () => {
      const result = authMongoDb.getUsersTableAdapter();

      expect(UsersMongoTableSpy).toHaveBeenCalledWith(false, undefined);
      expect(result).toBe(mock_UsersMongoTable);
    });

    it('should return a MongoUsersTable instance with given parameters', () => {
      const tableNamePrefix = 'test_prefix';
      const result = authMongoDb.getUsersTableAdapter(tableNamePrefix);

      expect(UsersMongoTableSpy).toHaveBeenCalledWith(false, tableNamePrefix);
      expect(result).toBe(mock_UsersMongoTable);
    });
  });

  describe('getSignupServiceTransactionAdapter', () => {
    it('should return a MongoSignupServiceTransaction instance with default parameters', () => {
      const result = authMongoDb.getSignupServiceTransactionAdapter();

      expect(spy_MongoSignupTransactionAdapter).toHaveBeenCalled();
      expect(result).toBe(mock_MongoSignupTransactionAdapter);
    });

    it('should return a MongoSignupServiceTransaction instance with given parameters', () => {
      const tableNamePrefix = 'test_prefix';
      const mock_signupPluginTransactionAdapter: SignupPluginTransactionAdapter =
        {} as unknown as SignupPluginTransactionAdapter;
      const result = authMongoDb.getSignupServiceTransactionAdapter(tableNamePrefix,
        mock_signupPluginTransactionAdapter);

      expect(spy_MongoSignupTransactionAdapter).toHaveBeenCalledWith(mock_UsersMongoTable,
        mock_signupPluginTransactionAdapter);
      expect(result).toBe(mock_MongoSignupTransactionAdapter);
    });
  });
});