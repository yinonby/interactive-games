
import type { GamesChatDbAdapter, GamesChatMessagesTableAdapter } from '@ig/games-engine-be-models';
import { getMigrationFiles } from '@ig/prisma-utils/test-utils';
import type { SqlDriverAdapterFactory } from '@prisma/client/runtime/client';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '../generated/prisma/client';
import {
  ChatMessagesTable,
} from './ChatMessagesTable';

export class GamesPrismaDb implements GamesChatDbAdapter {
  private prismaClient: PrismaClient;

  constructor(
    sqlDriverAdapterFactory: SqlDriverAdapterFactory,
  ) {
    this.prismaClient = new PrismaClient({ adapter: sqlDriverAdapterFactory });
  }

  public async init(): Promise<void> {
    await this.runMigrations();
  }

  public getChatMessagesTableAdapter(): GamesChatMessagesTableAdapter {
    return new ChatMessagesTable(this.prismaClient);
  }

  // service methods
  private async runMigrations(): Promise<void> {
    // run migrations if needed
    const migrationsDir = path.resolve(__dirname, '../prisma/migrations');
    const migrationFiles = getMigrationFiles(migrationsDir);

    for (const file of migrationFiles) {
      const sql = fs.readFileSync(file, 'utf-8');
      await this.prismaClient.$executeRawUnsafe(sql);
    }
  }
}
