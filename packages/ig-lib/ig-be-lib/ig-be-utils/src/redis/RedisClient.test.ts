
import type { LoggerAdapter } from '@ig/utils';
import type { createClient } from 'redis';
import * as RedisModule from 'redis';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RedisClient } from './RedisClient';

describe('RedisClient', () => {
  type TestT = { name: string };
  const mock_isOpen = vi.fn();
  const mock_logger = {
    info: vi.fn(),
    warn: vi.fn(),
  } as unknown as LoggerAdapter;

  const mock_on = vi.fn();
  const mock_client: ReturnType<typeof createClient> = {
    connect: vi.fn().mockResolvedValue(undefined),
    publish: vi.fn().mockResolvedValue(1),
    rPush: vi.fn().mockResolvedValue(1),
    quit: vi.fn().mockResolvedValue(undefined),
    on: mock_on,
  } as unknown as ReturnType<typeof createClient>;

  Object.defineProperty(mock_client, 'isOpen', {
    get: vi.fn(() => mock_isOpen()),
    configurable: true // Required to allow re-definition if needed
  });

  const spy_createClient = vi.spyOn(RedisModule, 'createClient');
  spy_createClient.mockReturnValue(mock_client);

  beforeEach(() => {
    vi.clearAllMocks();

    mock_isOpen.mockReturnValue(false);
  });

  it('should construct with defaults and call createClient with correct args', () => {
    new RedisClient<TestT>('mockUrl');
    expect(spy_createClient).toHaveBeenCalledWith({ url: 'mockUrl' });
  });

  it('should handle error', async () => {
    new RedisClient<TestT>('mockUrl', mock_logger);

    expect(mock_on).toHaveBeenCalledTimes(1);
    const errorHandler = mock_on.mock.calls[0][1];
    await errorHandler('ERROR');

    expect(mock_client.quit).toHaveBeenCalledTimes(1);
    expect(mock_client.connect).toHaveBeenCalledTimes(1);
  });

  it('should connect to redis if not already open', async () => {
    const messageService: RedisClient<TestT> = new RedisClient<TestT>('mockUrl', mock_logger);

    await messageService.connect();
    expect(mock_client.connect).toHaveBeenCalledTimes(1);
  });

  it('should not connect to redis if already open', async () => {
    const messageService: RedisClient<TestT> = new RedisClient<TestT>('mockUrl', mock_logger);

    mock_isOpen.mockReturnValue(true);

    // doesn't connect when already open
    await messageService.connect();
    expect(mock_client.connect).not.toHaveBeenCalled();
  });

  it('should publish a JSON stringified message to a channel', async () => {
    const messageService: RedisClient<TestT> = new RedisClient<TestT>('mockUrl', mock_logger);

    const channel = 'test-channel';
    const message = { name: 'world' };

    await messageService.connect();
    await messageService.publish(channel, message);

    // Verify it was stringified correctly
    expect(mock_client.publish).toHaveBeenCalledWith(
      channel,
      JSON.stringify(message)
    );
  });

  it('should push a message to a queue (list)', async () => {
    const messageService: RedisClient<TestT> = new RedisClient<TestT>('mockUrl', mock_logger);

    const queue = 'test-queue';
    const message = { name: 'world' };

    await messageService.connect();
    await messageService.enqueue(queue, message);

    expect(mock_client.rPush).toHaveBeenCalledWith(
      queue,
      JSON.stringify(message)
    );
  });

  it('should disconnect from redis on quit', async () => {
    const messageService: RedisClient<TestT> = new RedisClient<TestT>('mockUrl', mock_logger);

    await messageService.disconnect();
    expect(mock_client.quit).toHaveBeenCalled();
  });
});
