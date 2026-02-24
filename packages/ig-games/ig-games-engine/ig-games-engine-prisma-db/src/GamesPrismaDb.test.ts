
import { getTestingSqlDbContainerSinglton } from '@ig/prisma-utils/test-utils';
import type { SqlDriverAdapterFactory } from '@prisma/client/runtime/client';
import type { GameInstanceChatMessagesTable } from './GameInstanceChatMessagesTable';
import * as GameInstanceChatMessagesTableModule from './GameInstanceChatMessagesTable';
import { GamesPrismaDb } from './GamesPrismaDb';

// tests

describe('GamesPrismaDb', () => {
  let sqlDriverAdapterFactory: SqlDriverAdapterFactory;

  const spy_GameInstanceChatMessagesTable =
    vi.spyOn(GameInstanceChatMessagesTableModule, 'GameInstanceChatMessagesTable');

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

  describe('getGameInstanceChatMessagesTableAdapter', () => {
    it('returns GameInstanceChatMessagesTable instance', () => {
      // setup mocks
      const mock_GameInstanceChatMessagesTable = { mock: 'table' } as unknown as GameInstanceChatMessagesTable;
      spy_GameInstanceChatMessagesTable.mockImplementation(() => {
        console.log("in mock")
        return mock_GameInstanceChatMessagesTable;
      });

      // GamesPrismaDb
      const db = new GamesPrismaDb(sqlDriverAdapterFactory);

      const table = db.getGameInstanceChatMessagesTableAdapter();

      expect(table).toEqual(expect.objectContaining(mock_GameInstanceChatMessagesTable));
    });
  });
});