
import type { LoggerAdapter } from '@ig/utils';
import { type MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { type Mongoose } from 'mongoose';
import type { Mock } from 'vitest';
import { InmemMongoDbServer } from './InmemMongoDbServer';

vi.mock('mongoose', () => ({
  default: {
    connect: vi.fn(),
    disconnect: vi.fn(),
    connection: {
      db: {
        dropDatabase: vi.fn(),
      },
    },
  },
}));

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

describe('InmemMongoDbServer', () => {
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
      new InmemMongoDbServer();
    });

    it('should create MongoMemoryServer and connect mongoose', async () => {
      getUriMock.mockReturnValue(mockUri);
      createMock.mockResolvedValue(mockMongoMemoryServer);

      const inmemMongoDbServer: InmemMongoDbServer = new InmemMongoDbServer(mongoose, mockLogger);
      await inmemMongoDbServer.startDb();

      expect(createMock).toHaveBeenCalledOnce();
      expect(getUriMock).toHaveBeenCalledOnce();
      expect(mongoose.connect).toHaveBeenCalledWith(mockUri);
    });

    it('should propagate errors from MongoMemoryServer.create', async () => {
      const error = new Error('Failed to create server');
      createMock.mockRejectedValue(error);

      const inmemMongoDbServer: InmemMongoDbServer = new InmemMongoDbServer(mongoose, mockLogger);
      await expect(inmemMongoDbServer.startDb()).rejects.toThrow(error);

      expect(createMock).toHaveBeenCalledOnce();
    });

    it('should propagate errors from mongoose.connect', async () => {
      const error = new Error('Failed to connect');
      vi.mocked(mongoose.connect).mockRejectedValue(error);

      const inmemMongoDbServer: InmemMongoDbServer = new InmemMongoDbServer(mongoose, mockLogger);
      await expect(inmemMongoDbServer.startDb()).rejects.toThrow(error);
    });
  });

  describe('stop', () => {
    it('should stop MongoMemoryServer', async () => {
      const inmemMongoDbServer: InmemMongoDbServer = new InmemMongoDbServer(mongoose, mockLogger);
      await inmemMongoDbServer.startDb();

      await inmemMongoDbServer.stopDb();
      expect(mongoose.disconnect).toHaveBeenCalledOnce();
    });

    it('should propagate errors from mongoose.disconnect', async () => {
      const error = new Error('Failed to connect');
      vi.mocked(mongoose.disconnect).mockRejectedValue(error);

      const inmemMongoDbServer: InmemMongoDbServer = new InmemMongoDbServer(mongoose, mockLogger);
      await inmemMongoDbServer.startDb();

      await expect(inmemMongoDbServer.stopDb()).rejects.toThrow(error);
    });

    it('should not stop when trying to stop before startDb', async () => {
      const disconnectMock = vi.mocked(mongoose.disconnect)

      const inmemMongoDbServer: InmemMongoDbServer = new InmemMongoDbServer(mongoose, mockLogger);
      await inmemMongoDbServer.stopDb();

      expect(disconnectMock).toHaveBeenCalled();
      expect(stopMock).not.toHaveBeenCalled();
    });
  });

  describe('dropDb', () => {
    it('should not call dropDatabase when disconnected', async () => {
      const mongooseMock: Mongoose = {
        connection: {
          db: undefined,
        }
      } as Mongoose;

      const inmemMongoDbServer: InmemMongoDbServer = new InmemMongoDbServer(mongooseMock);
      await inmemMongoDbServer.dropDb();
    });

    it('should call dropDatabase', async () => {
      const dropDatabaseMock = vi.fn();
      const mongooseMock: Mongoose = {
        connection: {
          db: {
            dropDatabase: dropDatabaseMock,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
        }
      } as Mongoose;


      const inmemMongoDbServer: InmemMongoDbServer = new InmemMongoDbServer(mongooseMock);
      await inmemMongoDbServer.dropDb();
      expect(dropDatabaseMock).toHaveBeenCalledOnce();
    });
  });
});

