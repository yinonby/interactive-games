
import type { LoggerAdapter } from '@ig/utils';
import type { AccountIdT, AccountT } from '../../../../ig-app-engine-models';
import { buildFullTestAccount } from '../../../../ig-app-engine-models/test/test-index';
import { MongoAccountsTable } from './MongoAccountsTable';

describe('MongoAccountsTable', () => {
  describe('constructor', () => {
    it('should create instance with defaults', () => {
      const instance = new MongoAccountsTable();
      expect(instance).toBeDefined();
    });

    it('should create instance without defaults', () => {
      const mockLogger: LoggerAdapter = { info: vi.fn() } as unknown as LoggerAdapter;
      const instance = new MongoAccountsTable(true, 'prefix_', mockLogger);
      expect(instance).toBeDefined();
    });
  });

  describe('getTableName', () => {
    it('should return GameConfigs', () => {
      const instance = new MongoAccountsTable();
      expect(instance.getTableName()).toBe('Accounts');
    });
  });

  describe('getAccounts', () => {
    it('should return array of accounts', async () => {
      const accountId1: AccountIdT = 'ACCOUNT1';
      const accountId2: AccountIdT = 'ACCOUNT2';
      const mockAccount1: AccountT = buildFullTestAccount({
        accountId: accountId1,
      });
      const mockAccount2: AccountT = buildFullTestAccount({
        accountId: accountId2,
      });
      const instance = new MongoAccountsTable();

      const res1 = await instance.getAccounts();
      expect(res1).toHaveLength(0);

      await instance.createAccount(mockAccount1);
      await instance.createAccount(mockAccount2);

      const res2 = await instance.getAccounts();
      expect(res2).toHaveLength(2);
    });
  });

  describe('getAccount', () => {
    it('should return array of accounts', async () => {
      const accountId1: AccountIdT = 'ACCOUNT1';
      const mockAccount1: AccountT = buildFullTestAccount({
        accountId: accountId1,
      });
      const instance = new MongoAccountsTable();

      const res1 = await instance.getAccount(accountId1);
      expect(res1).toBeNull();

      await instance.createAccount(mockAccount1);

      const res2 = await instance.getAccount(accountId1);
      expect(res2).not.toBeNull();
    });
  });

  describe('createAccount', () => {
    it('should insert account', async () => {
      const mockAccount1: AccountT = buildFullTestAccount({});
      const instance = new MongoAccountsTable();

      const res1 = await instance.getAccounts();
      expect(res1).toHaveLength(0);

      await instance.createAccount(mockAccount1);

      const res2 = await instance.getAccounts();
      expect(res2).toHaveLength(1);
    });

    it('should fail to create user with an existing unique key', async () => {
      const mockAccount1: AccountT = buildFullTestAccount({});
      const instance = new MongoAccountsTable();

      const res1 = await instance.getAccounts();
      expect(res1).toHaveLength(0);

      await instance.createAccount(mockAccount1);
      await expect(instance.createAccount(mockAccount1)).rejects.toThrow();

      const res2 = await instance.getAccounts();
      expect(res2).toHaveLength(1);
    });
  });
});
