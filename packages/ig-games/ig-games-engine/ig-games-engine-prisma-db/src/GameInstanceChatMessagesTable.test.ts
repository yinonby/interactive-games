
import { getTestingSqlDbContainerSinglton } from '@ig/prisma-utils/test-utils';
import type { SqlDriverAdapterFactory } from '@prisma/client/runtime/client';
import { PrismaClient } from '../generated/prisma/client';
import { GameInstanceChatMessagesTable } from './GameInstanceChatMessagesTable';

describe('GameInstanceChatMessagesTable', () => {
  let prismaClient: PrismaClient;

  beforeAll(() => {
    const sqlDbTestContainer = getTestingSqlDbContainerSinglton();
    const sqlDriverAdapterFactory: SqlDriverAdapterFactory = sqlDbTestContainer.getTestingSqlDriverAdapterFactory();
    prismaClient = new PrismaClient({ adapter: sqlDriverAdapterFactory });
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  describe('constructor', () => {
    it('should create instance with defaults', () => {
      const instance = new GameInstanceChatMessagesTable(prismaClient);
      expect(instance).toBeDefined();
    });
  });

  describe('createMessage', () => {
    it('should create a new chat message', async () => {
      const instance = new GameInstanceChatMessagesTable(prismaClient);
      const chatMsgId = await instance.createMessage(
        'gameInstanceChat',
        'CID1',
        'ACC1',
        'test message',
        1234567890,
      );
      expect(chatMsgId).toBeDefined();
    });
  });

  describe('getMostRecentMessagesForGameInstance', () => {
    it('should get last messages for a game instance', async () => {
      const instance = new GameInstanceChatMessagesTable(prismaClient);

      // create messages 0-9
      const n = 10;
      for (let i = 0; i < n; i++) {
        await instance.createMessage(
          'gameInstanceChat',
          'CID1',
          'ACC1',
          `test message ${i}`,
          1234567890 + i,
        );
      }

      // get messages 6,7,8,9
      const limit = 4;
      const messages1 = await instance.getMostRecentMessagesForGameInstance(
        'CID1',
        limit,
      );
      expect(messages1).toHaveLength(limit);
      for (let i = 0; i < limit; i++) {
        expect(messages1[i].msgText).toEqual(`test message ${n - 1 - (limit - 1 - i)}`);
      }
    });
  });

  describe('getPriorMessagesForGameInstance', () => {
    it('should get messages for a game instance', async () => {
      const instance = new GameInstanceChatMessagesTable(prismaClient);

      // create messages 0-9
      const n = 10;
      for (let i = 0; i < n; i++) {
        await instance.createMessage(
          'gameInstanceChat',
          'CID1',
          'ACC1',
          `test message ${i}`,
          1234567890 + i,
        );
      }

      // get message 9
      const messages1 = await instance.getMostRecentMessagesForGameInstance(
        'CID1',
        1,
      );
      expect(messages1).toHaveLength(1);
      expect(messages1[0].msgText).toEqual(`test message ${n - 1}`);

      // get messages 7,8
      const beforePaginationId = messages1[0].paginationId;
      const limit = 2;
      const messages2 = await instance.getPriorMessagesForGameInstance(
        'CID1',
        beforePaginationId,
        limit,
      );
      expect(messages2).toHaveLength(limit);
      for (let i = 0; i < limit; i++) {
        expect(messages2[i].msgText).toEqual(`test message ${n - 2 - (limit - 1 - i)}`);
      }
    });
  });

  describe('getNewerMessagesForGameInstance', () => {
    it('should get newer messages for a game instance', async () => {
      const instance = new GameInstanceChatMessagesTable(prismaClient);

      // create message 0
      await instance.createMessage(
        'gameInstanceChat',
        'CID1',
        'ACC1',
        `test message 0`,
        1234567890,
      );

      // get message 0
      const messages1 = await instance.getMostRecentMessagesForGameInstance(
        'CID1',
        1,
      );
      expect(messages1).toHaveLength(1);
      expect(messages1[0].msgText).toEqual(`test message 0`);

      // create messages 1-9
      const n = 10;
      for (let i = 1; i < n; i++) {
        await instance.createMessage(
          'gameInstanceChat',
          'CID1',
          'ACC1',
          `test message ${i}`,
          1234567890 + i,
        );
      }

      // get messages 1,2,3
      const afterPaginationId = messages1[0].paginationId;
      const limit = 3;
      const messages2 = await instance.getNewerMessagesForGameInstance(
        'CID1',
        afterPaginationId,
        limit,
      );
      expect(messages2).toHaveLength(limit);
      for (let i = 0; i < limit; i++) {
        expect(messages2[i].msgText).toEqual(`test message ${i + 1}`);
      }
    });
  });
});
