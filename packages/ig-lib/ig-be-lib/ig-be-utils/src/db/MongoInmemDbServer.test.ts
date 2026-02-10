
import type { LoggerAdapter } from '@ig/utils';
import { type MongoMemoryServer } from 'mongodb-memory-server';
import type { Mock } from 'vitest';
import { MongoInmemDbServer } from './MongoInmemDbServer';

vi.mock('mongodb-memory-server', () => {
  const createMock = vi.fn();

  return {
    MongoMemoryServer: {
      create: createMock,
    },

    __mmsMocks: { createMock },
  };
});

declare module 'mongodb-memory-server' {
  export const __mmsMocks: {
    createMock: Mock,
  };
}

import { __mmsMocks } from 'mongodb-memory-server';

describe('MongoInmemDbServer', () => {
  // mock MongoMemoryServer
  const mockUri = 'mongodb://localhost:12345';
  const getUriMock = vi.fn();
  const stopMock = vi.fn();
  const mockMongoMemoryServer: MongoMemoryServer = {
    getUri: getUriMock,
    stop: stopMock,
  } as unknown as MongoMemoryServer;
  const { createMock } = __mmsMocks;
  createMock.mockResolvedValue(mockMongoMemoryServer);

  // mock logger
  const mockLogger: LoggerAdapter = {
    info: vi.fn(),
    log: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks();

    createMock.mockResolvedValue(mockMongoMemoryServer);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('startDb', () => {
    it('should create MongoMemoryServer with defaults', () => {
      new MongoInmemDbServer();
    });

    it('should create MongoMemoryServer', async () => {
      getUriMock.mockReturnValue(mockUri);
      createMock.mockResolvedValue(mockMongoMemoryServer);

      const mongoInmemDbServer: MongoInmemDbServer = new MongoInmemDbServer(mockLogger);
      await mongoInmemDbServer.startDb();

      expect(createMock).toHaveBeenCalledOnce();
      expect(getUriMock).toHaveBeenCalledOnce();
    });

    it('should propagate errors from MongoMemoryServer.create', async () => {
      const error = new Error('Failed to create server');
      createMock.mockRejectedValue(error);

      const mongoInmemDbServer: MongoInmemDbServer = new MongoInmemDbServer(mockLogger);
      await expect(mongoInmemDbServer.startDb()).rejects.toThrow(error);

      expect(createMock).toHaveBeenCalledOnce();
    });
  });

  describe('stop', () => {
    it('should stop MongoMemoryServer', async () => {
      const mongoInmemDbServer: MongoInmemDbServer = new MongoInmemDbServer(mockLogger);
      await mongoInmemDbServer.startDb();

      await mongoInmemDbServer.stopDb();
      expect(stopMock).toHaveBeenCalledOnce();
    });

    it('should not stop when trying to stop before startDb', async () => {
      const mongoInmemDbServer: MongoInmemDbServer = new MongoInmemDbServer(mockLogger);
      await mongoInmemDbServer.stopDb();

      expect(stopMock).not.toHaveBeenCalled();
    });
  });
});

