
import * as PrismaTestUtilsModule from '@ig/prisma-utils/test-utils';
import { getTestingSqlDbContainerSinglton } from '@ig/prisma-utils/test-utils';
import type { SqlDriverAdapterFactory } from '@prisma/client/runtime/client';
import type { ChatMessagesTable } from './ChatMessagesTable';
import * as ChatMessagesTableModule from './ChatMessagesTable';
import { ChatPrismaDb } from './ChatPrismaDb';

// tests

describe('ChatPrismaDb', () => {
  let sqlDriverAdapterFactory: SqlDriverAdapterFactory;

  const spy_ChatMessagesTable = vi.spyOn(ChatMessagesTableModule, 'ChatMessagesTable');
  const spy_getMigrationFiles = vi.spyOn(PrismaTestUtilsModule, 'getMigrationFiles');

  beforeAll(() => {
    const sqlDbTestContainer = getTestingSqlDbContainerSinglton();
    sqlDriverAdapterFactory = sqlDbTestContainer.getTestingSqlDriverAdapterFactory();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('constructs PrismaClient with adapter', () => {
      // ChatPrismaDb
      new ChatPrismaDb(sqlDriverAdapterFactory);
    });
  });

  describe('init', () => {
    it('when testing', async () => {
      // setup mocks
      spy_getMigrationFiles.mockReturnValue([]);

      // ChatPrismaDb
      const db = new ChatPrismaDb(sqlDriverAdapterFactory, true);

      await db.init();
    });

    it('when not testing', async () => {
      // setup mocks
      spy_getMigrationFiles.mockReturnValue([]);

      // ChatPrismaDb
      const db = new ChatPrismaDb(sqlDriverAdapterFactory, false);

      await db.init();
    });
  });

  describe('getChatMessagesTableAdapter', () => {
    it('returns ChatMessagesTable instance', () => {
      // setup mocks
      const mock_ChatMessagesTable = { mock: 'table' } as unknown as ChatMessagesTable;
      spy_ChatMessagesTable.mockImplementation(() => {
        return mock_ChatMessagesTable;
      });

      // ChatPrismaDb
      const db = new ChatPrismaDb(sqlDriverAdapterFactory);

      const table = db.getChatMessagesTableAdapter();

      expect(table).toEqual(expect.objectContaining(mock_ChatMessagesTable));
    });
  });
});