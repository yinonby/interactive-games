
import type { ChatDbAdapter, ChatMessagesTableAdapter } from '@ig/chat-be-models';
import { getMigrationFiles } from '@ig/prisma-utils/test-utils';
import type { SqlDriverAdapterFactory } from '@prisma/client/runtime/client';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '../generated/prisma/client';
import {
  ChatMessagesTable,
} from './ChatMessagesTable';

export class ChatPrismaDb implements ChatDbAdapter {
  private prismaClient: PrismaClient;

  constructor(
    sqlDriverAdapterFactory: SqlDriverAdapterFactory,
    private isTesting = process.env.NODE_ENV === 'test',
  ) {
    this.prismaClient = new PrismaClient({ adapter: sqlDriverAdapterFactory });
  }

  public async init(): Promise<void> {
    await this.runMigrations();
  }

  public getChatMessagesTableAdapter(): ChatMessagesTableAdapter {
    return new ChatMessagesTable(this.prismaClient);
  }

  // service methods
  private async runMigrations(): Promise<void> {
    // run migrations if needed

    const migrationsDir = this.isTesting ?
      path.resolve(__dirname, '../prisma/migrations') :
      path.resolve(
        process.cwd(),
        '../../packages/ig-chat-plugin/ig-chat-prisma-db/prisma/migrations'
      );

    const migrationFiles = getMigrationFiles(migrationsDir);

    for (const file of migrationFiles) {
      const sql = fs.readFileSync(file, 'utf-8');
      await this.prismaClient.$executeRawUnsafe(sql);
    }
  }
}
