
import { getTestingSqlDbContainerSinglton } from '@ig/prisma-utils/test-utils';
import type { SqlDriverAdapterFactory } from '@prisma/client/runtime/client';
import type { ChatMessagesTable } from './ChatMessagesTable';
import * as ChatMessagesTableModule from './ChatMessagesTable';
import { GamesPrismaDb } from './GamesPrismaDb';

// tests

describe('GamesPrismaDb', () => {
  let sqlDriverAdapterFactory: SqlDriverAdapterFactory;

  const spy_ChatMessagesTable =
    vi.spyOn(ChatMessagesTableModule, 'ChatMessagesTable');

  beforeAll(() => {
    const sqlDbTestContainer = getTestingSqlDbContainerSinglton();
    sqlDriverAdapterFactory = sqlDbTestContainer.getTestingSqlDriverAdapterFactory();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('constructs PrismaClient with adapter', () => {
      // GamesPrismaDb
      new GamesPrismaDb(sqlDriverAdapterFactory);
    });
  });

  describe('getChatMessagesTableAdapter', () => {
    it('returns ChatMessagesTable instance', () => {
      // setup mocks
      const mock_ChatMessagesTable = { mock: 'table' } as unknown as ChatMessagesTable;
      spy_ChatMessagesTable.mockImplementation(() => {
        console.log("in mock")
        return mock_ChatMessagesTable;
      });

      // GamesPrismaDb
      const db = new GamesPrismaDb(sqlDriverAdapterFactory);

      const table = db.getChatMessagesTableAdapter();

      expect(table).toEqual(expect.objectContaining(mock_ChatMessagesTable));
    });
  });
});