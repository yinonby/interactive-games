
import type { LoggerAdapter } from '@ig/utils';
import type { RedisClientType } from 'redis';
import { createClient } from 'redis';
import { BeLogger } from '../logger/BeLogger';

export interface RedisClientAdapter<T> {
  connect(): Promise<void>;
  publish(channel: string, message: T): Promise<number>;
  enqueue(queueName: string, message: T): Promise<number>;
  disconnect(): Promise<void>;
}

export class RedisClient<T> implements RedisClientAdapter<T> {
  private client: RedisClientType;

  constructor(
    redisUrl: string,
    private logger: LoggerAdapter = new BeLogger(),
  ) {
    this.client = createClient({ url: redisUrl });

    // Always handle connection errors
    const handleError = async (error: unknown): Promise<void> => {
      await this.handleError(error);
    }
    this.client.on('error', handleError);
  }

  /**
   * Connect to the Redis instance
   */
  private async handleError(error: unknown): Promise<void> {
    this.logger.warn('Redis client error, will reconnect', error);
    await this.disconnect();
    await this.connect();
  }

  /**
   * Connect to the Redis instance
   */
  public async connect(): Promise<void> {
    if (!this.client.isOpen) {
      this.logger.info('Redis client connecting...');
      await this.client.connect();
      this.logger.info('Redis client connected');
    }
  }

  /**
   * Send a message to a Pub/Sub channel
   */
  public async publish(channel: string, message: T): Promise<number> {
    const payload = JSON.stringify(message);
    return await this.client.publish(channel, payload);
  }

  /**
   * Push a message to a Redis List (Queue)
   */
  public async enqueue(queueName: string, message: T): Promise<number> {
    const payload = JSON.stringify(message);
    return await this.client.rPush(queueName, payload);
  }

  /**
   * Disconnect from Redis
   */
  public async disconnect(): Promise<void> {
    this.logger.info('Redis client disconnecting...');
    await this.client.quit();
    this.logger.info('Redis client disconnected');
  }
}
