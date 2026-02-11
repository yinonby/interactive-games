
import type { LoggerAdapter } from '@ig/utils';
import type { UserIdT, UserT } from '../../../../ig-app-engine-models';
import { buildFullTestUser } from '../../../../ig-app-engine-models/test/test-index';
import { UsersMongoTable } from './UsersMongoTable';

describe('UsersMongoTable', () => {
  describe('constructor', () => {
    it('should create instance with defaults', () => {
      const instance = new UsersMongoTable();
      expect(instance).toBeDefined();
    });

    it('should create instance without defaults', () => {
      const mockLogger: LoggerAdapter = { info: vi.fn() } as unknown as LoggerAdapter;
      const instance = new UsersMongoTable(true, 'prefix_', mockLogger);
      expect(instance).toBeDefined();
    });
  });

  describe('getTableName', () => {
    it('should return GameConfigs', () => {
      const instance = new UsersMongoTable();
      expect(instance.getTableName()).toBe('Users');
    });
  });

  describe('getUsers', () => {
    it('should return array of game configs', async () => {
      const userId1: UserIdT = 'USER1';
      const userId2: UserIdT = 'USER2';
      const mockUser1: UserT = buildFullTestUser({
        userId: userId1,
      });
      const mockUser2: UserT = buildFullTestUser({
        userId: userId2,
      });
      const instance = new UsersMongoTable();

      const res1 = await instance.getUsers();
      expect(res1).toHaveLength(0);

      await instance.createUser(mockUser1);
      await instance.createUser(mockUser2);

      const res2 = await instance.getUsers();
      expect(res2).toHaveLength(2);
    });
  });


  describe('getUser', () => {
    it('should return array of game configs', async () => {
      const userId1: UserIdT = 'USER1';
      const mockUser1: UserT = buildFullTestUser({
        userId: userId1,
      });
      const instance = new UsersMongoTable();

      const res1 = await instance.getUser(userId1);
      expect(res1).toBeNull();

      await instance.createUser(mockUser1);

      const res2 = await instance.getUser(userId1);
      expect(res2).not.toBeNull();
    });
  });

  describe('createUser', () => {
    it('should insert game config', async () => {
      const mockUser1: UserT = buildFullTestUser({});
      const instance = new UsersMongoTable();

      const res1 = await instance.getUsers();
      expect(res1).toHaveLength(0);

      await instance.createUser(mockUser1);

      const res2 = await instance.getUsers();
      expect(res2).toHaveLength(1);
    });

    it('should fail to create user with an existing unique key', async () => {
      const mockUser1: UserT = buildFullTestUser({});
      const instance = new UsersMongoTable();

      const res1 = await instance.getUsers();
      expect(res1).toHaveLength(0);

      await instance.createUser(mockUser1);
      await expect(instance.createUser(mockUser1)).rejects.toThrow();

      const res2 = await instance.getUsers();
      expect(res2).toHaveLength(1);
    });
  });
});
