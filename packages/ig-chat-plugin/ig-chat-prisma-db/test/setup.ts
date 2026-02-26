
import {
  getSqlDbTestContainerCreateTimeout,
  startTestingSqlDbContainer,
  type SqlDbTestContainer
} from '@ig/prisma-utils/test-utils';
import type { SqlDriverAdapterFactory } from '@prisma/client/runtime/client';
import { ChatPrismaDb } from '../src/ChatPrismaDb';

let sqlDbTestContainer: SqlDbTestContainer | null = null;

beforeAll(async () => {
  // start an sql db container
  sqlDbTestContainer = await startTestingSqlDbContainer();

  // after container is started, get the sql driver adapter factory for testing
  const sqlDriverAdapterFactory: SqlDriverAdapterFactory = sqlDbTestContainer.getTestingSqlDriverAdapterFactory();

  // initialize the prisma db (run migrations)
  const gamesPrismaDb = new ChatPrismaDb(sqlDriverAdapterFactory);
  await gamesPrismaDb.init();
}, getSqlDbTestContainerCreateTimeout());

beforeEach(async () => {
});

afterEach(async () => {
});

afterAll(async () => {
  if (sqlDbTestContainer !== null) {
    await sqlDbTestContainer.stop();
  }
});
