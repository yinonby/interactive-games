/* istanbul ignore file -- @preserve */

import { isCI } from 'std-env';
import { GenericContainer, type StartedTestContainer } from 'testcontainers';

const containerPostgressPort = 5432;

export interface PostgresContainerAdapter {
  getConnectionString(): string;
  stop(): Promise<void>;
}

export async function startPostgresContainer(): Promise<PostgresContainerAdapter> {
  if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
    throw new Error('startPostgressContainer should only be used in testing or development');
  }

  try {
    const container = await new GenericContainer('postgres:16')
      .withName('postgres')
      .withEnvironment({'POSTGRES_PASSWORD': 'pass'})
      .withExposedPorts(containerPostgressPort)
      .start();

    return new PostgresContainer(container);
  } catch (err) {
    console.error('Error starting SQL DB test container, please run docker');
    throw err;
  }
}

export const getPostgressContainerCreateTimeout = (): number => {
  // use 60 seconds in CI
  return isCI ? 60000 : 10000;
}

class PostgresContainer implements PostgresContainerAdapter {
  constructor(private container: StartedTestContainer) {}

  public getConnectionString(): string {
    const host = this.container.getHost();
    const port = this.container.getMappedPort(containerPostgressPort); // get the port on the host machine
    const databaseUrl = `postgresql://postgres:pass@${host}:${port}/postgres`;

    return databaseUrl;
  }

  public async stop(): Promise<void> {
    await this.container.stop();
  }
}
