
import {
  getPostgressContainerCreateTimeout,
  type PostgresContainerAdapter, startPostgresContainer
} from '@ig/dev-containers';
import { PrismaPg } from '@prisma/adapter-pg';
import type { SqlDriverAdapterFactory } from '@prisma/client/runtime/client';
import fs from 'fs';
import path from 'path';

let _sqlDbTestContainerSinglton: SqlDbTestContainer | null = null;

export class SqlDbTestContainer {
  constructor(private postgresContainerAdapter: PostgresContainerAdapter) {}

  public getConnectionString(): string {
    return this.postgresContainerAdapter.getConnectionString();
  }

  public getTestingSqlDriverAdapterFactory(): SqlDriverAdapterFactory {
    const databaseUrl = this.getConnectionString();

    const adapter: SqlDriverAdapterFactory | null = new PrismaPg({ connectionString: databaseUrl });

    return adapter;
  }

  public async stop(): Promise<void> {
    await this.postgresContainerAdapter.stop();
  }
}

export async function startTestingSqlDbContainer(): Promise<SqlDbTestContainer> {
  if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
    throw new Error('startTestingSqlDbContainer should only be used in testing or development');
  }

  try {
    const postgresContainerAdapter: PostgresContainerAdapter = await startPostgresContainer();

    _sqlDbTestContainerSinglton = new SqlDbTestContainer(postgresContainerAdapter);
    return _sqlDbTestContainerSinglton;
  } catch (err) {
    console.error('Error starting SQL DB test container, please run docker');
    throw err;
  }
}

export const getSqlDbTestContainerCreateTimeout = (): number => {
  return getPostgressContainerCreateTimeout();
}

export function getTestingSqlDbContainerSinglton(): SqlDbTestContainer {
  if (_sqlDbTestContainerSinglton === null) {
    throw new Error('SQL DB container is not started. Please call startTestingSqlDbContainer() first.');
  }

  return _sqlDbTestContainerSinglton;
}

export function getMigrationFiles(migrationsDir: string): string[] {
  const migrationFolders = fs.readdirSync(migrationsDir).sort();
  const migrationFiles = migrationFolders
    .filter(e => e !== 'migration_lock.toml')
    .map(folder =>
      path.join(migrationsDir, folder, 'migration.sql')
    );

  return migrationFiles;
}
