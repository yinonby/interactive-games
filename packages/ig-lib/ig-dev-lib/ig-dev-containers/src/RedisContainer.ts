/* istanbul ignore file -- @preserve */

import { GenericContainer, type StartedTestContainer } from 'testcontainers';

const containerRedisPort = 5432;

export interface RedisContainerAdapter {
  getRedisUrl(): string;
  stop(): Promise<void>;
}

export async function startRedisContainer(): Promise<RedisContainerAdapter> {
  if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
    throw new Error('startRedisContainer should only be used in testing or development');
  }

  try {
    const container = await new GenericContainer('redis')
      .withName('redis')
      .withExposedPorts(containerRedisPort)
      .start();

    return new RedisContainer(container);
  } catch (err) {
    console.error('Error starting SQL DB test container, please run docker');
    throw err;
  }
}

class RedisContainer implements RedisContainerAdapter {
  constructor(private container: StartedTestContainer) {}

  public getRedisUrl(): string {
    const host = this.container.getHost();
    const port = this.container.getMappedPort(containerRedisPort); // get the port on the host machine
    const url = `redis://${host}:${port}`;

    return url;
  }

  public async stop(): Promise<void> {
    await this.container.stop();
  }
}
