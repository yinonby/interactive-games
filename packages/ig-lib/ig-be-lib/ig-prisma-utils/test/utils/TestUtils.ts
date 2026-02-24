
import { PrismaPg } from '@prisma/adapter-pg';
import type { SqlDriverAdapterFactory } from '@prisma/client/runtime/client';
import fs from 'fs';
import path from 'path';
import { GenericContainer, type StartedTestContainer } from 'testcontainers';

const exposedPort = 5432;
let _sqlDbTestContainerSinglton: SqlDbTestContainer | null = null;

export class SqlDbTestContainer {
  constructor(private container: StartedTestContainer) {}

  public getConnectionString(): string {
    const host = this.container.getHost();
    const port = this.container.getMappedPort(exposedPort);
    const databaseUrl = `postgresql://postgres:pass@${host}:${port}/postgres`;

    return databaseUrl;
  }

  public getTestingSqlDriverAdapterFactory(): SqlDriverAdapterFactory {
    const databaseUrl = this.getConnectionString();

    const adapter: SqlDriverAdapterFactory | null = new PrismaPg({ connectionString: databaseUrl });

    return adapter;
  }

  public async stop(): Promise<void> {
    await this.container.stop();
  }
}

export async function startTestingSqlDbContainer(): Promise<SqlDbTestContainer> {
  if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
    throw new Error('startTestingSqlDbContainer should only be used in testing or development');
  }

  try {
    const container = await new GenericContainer('postgres:16')
      .withEnvironment({'POSTGRES_PASSWORD': 'pass'})
      .withExposedPorts(exposedPort)
      .start();

    _sqlDbTestContainerSinglton = new SqlDbTestContainer(container);
    return _sqlDbTestContainerSinglton;
  } catch (err) {
    console.error('Error starting SQL DB test container, please run docker');
    throw err;
  }
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
