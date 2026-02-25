
import type { UserIdT, UserT } from '@ig/auth-models';
import { buildFullTestUser } from '@ig/auth-models/test-utils';
import { MongoDbTransactionContext } from '@ig/be-utils';
import type { LoggerAdapter } from '@ig/utils';
import mongoose from 'mongoose';
import { MongoUsersTable } from './MongoUsersTable';

describe('MongoUsersTable', () => {
  describe('constructor', () => {
    it('should create instance with defaults', () => {
      const instance = new MongoUsersTable();
      expect(instance).toBeDefined();
    });

    it('should create instance without defaults', () => {
      const mockLogger: LoggerAdapter = { info: vi.fn() } as unknown as LoggerAdapter;
      const instance = new MongoUsersTable(true, 'prefix_', mockLogger);
      expect(instance).toBeDefined();
    });
  });

  describe('getTableName', () => {
    it('should return GameConfigs', () => {
      const instance = new MongoUsersTable();
      expect(instance.getTableName()).toBe('Users');
    });
  });

  describe('getUsers', () => {
    it('should return array of users', async () => {
      const userId1: UserIdT = 'USER1';
      const userId2: UserIdT = 'USER2';
      const mockUser1: UserT = buildFullTestUser({
        userId: userId1,
      });
      const mockUser2: UserT = buildFullTestUser({
        userId: userId2,
      });
      const instance = new MongoUsersTable();

      const res1 = await instance.getUsers();
      expect(res1).toHaveLength(0);

      await instance.createUser(mockUser1);
      await instance.createUser(mockUser2);

      const res2 = await instance.getUsers();
      expect(res2).toHaveLength(2);
    });
  });

  describe('getUser', () => {
    it('should return array of users', async () => {
      const userId1: UserIdT = 'USER1';
      const mockUser1: UserT = buildFullTestUser({
        userId: userId1,
      });
      const instance = new MongoUsersTable();

      const res1 = await instance.getUser(userId1);
      expect(res1).toBeNull();

      await instance.createUser(mockUser1);

      const res2 = await instance.getUser(userId1);
      expect(res2).not.toBeNull();
    });
  });

  describe('createUser', () => {
    it('should insert user', async () => {
      const mockUser1: UserT = buildFullTestUser({});
      const instance = new MongoUsersTable();

      const res1 = await instance.getUsers();
      expect(res1).toHaveLength(0);

      await instance.createUser(mockUser1);

      const res2 = await instance.getUsers();
      expect(res2).toHaveLength(1);
    });

    it('should fail to create user with an existing unique key', async () => {
      const mockUser1: UserT = buildFullTestUser({});
      const instance = new MongoUsersTable();

      const res1 = await instance.getUsers();
      expect(res1).toHaveLength(0);

      await instance.createUser(mockUser1);
      await expect(instance.createUser(mockUser1)).rejects.toThrow();

      const res2 = await instance.getUsers();
      expect(res2).toHaveLength(1);
    });

    it('should insert user, persist document when transaction commits', async () => {
      const mockUser1: UserT = buildFullTestUser({});
      const instance = new MongoUsersTable();

      const session = await mongoose.startSession();
      session.startTransaction();

      const res1 = await instance.getUsers();
      expect(res1).toHaveLength(0);

      const ctx = new MongoDbTransactionContext(session);
      await instance.createUser(mockUser1, ctx);

      // commit and end session
      await session.commitTransaction();
      await session.endSession();

      const res2 = await instance.getUsers();
      expect(res2).toHaveLength(1);
    });

    it('should insert user, not persist document when transaction aborts', async () => {
      const mockUser1: UserT = buildFullTestUser({});
      const instance = new MongoUsersTable();

      const session = await mongoose.startSession();
      session.startTransaction();

      const res1 = await instance.getUsers();
      expect(res1).toHaveLength(0);

      const ctx = new MongoDbTransactionContext(session);
      await instance.createUser(mockUser1, ctx);

      // abort and end session
      await session.abortTransaction();
      await session.endSession();

      const res2 = await instance.getUsers();
      expect(res2).toHaveLength(0);
    });
  });
});
