
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { type Mongoose } from 'mongoose';
import { InmemMongoDbServer } from './InmemMongoDbServer';

vi.mock('mongodb-memory-server');
vi.mock('mongoose');

describe('InmemMongoDbServer', () => {
  const mockUri = 'mongodb://localhost:12345';
  const mockMongoMemoryServer: MongoMemoryServer = {
    getUri: vi.fn().mockReturnValue(mockUri),
    stop: vi.fn(),
  } as unknown as MongoMemoryServer;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('startDb', () => {
    it('should create MongoMemoryServer and connect mongoose', async () => {
      vi.mocked(MongoMemoryServer.create).mockResolvedValue(mockMongoMemoryServer);

      const inmemMongoDbServer: InmemMongoDbServer = new InmemMongoDbServer();
      await inmemMongoDbServer.startDb();

      expect(MongoMemoryServer.create).toHaveBeenCalledOnce();
      expect(mockMongoMemoryServer.getUri).toHaveBeenCalledOnce();
      expect(mongoose.connect).toHaveBeenCalledWith(mockUri);
    });

    it('should propagate errors from MongoMemoryServer.create', async () => {
      const error = new Error('Failed to create server');
      vi.mocked(MongoMemoryServer.create).mockRejectedValue(error);

      const inmemMongoDbServer: InmemMongoDbServer = new InmemMongoDbServer();
      await expect(inmemMongoDbServer.startDb()).rejects.toThrow(error);
    });

    it('should propagate errors from mongoose.connect', async () => {
      const error = new Error('Failed to connect');

      vi.mocked(MongoMemoryServer.create).mockResolvedValue(mockMongoMemoryServer);
      vi.mocked(mongoose.connect).mockRejectedValue(error);

      const inmemMongoDbServer: InmemMongoDbServer = new InmemMongoDbServer();
      await expect(inmemMongoDbServer.startDb()).rejects.toThrow(error);
    });
  });

  describe('stop', () => {
    it('should stop MongoMemoryServer', async () => {
      vi.mocked(MongoMemoryServer.create).mockResolvedValue(mockMongoMemoryServer);

      const inmemMongoDbServer: InmemMongoDbServer = new InmemMongoDbServer();
      await inmemMongoDbServer.startDb();

      await inmemMongoDbServer.stopDb();
      expect(mongoose.disconnect).toHaveBeenCalledOnce();
    });

    it('should propagate errors from mongoose.disconnect', async () => {
      const error = new Error('Failed to connect');

      vi.mocked(MongoMemoryServer.create).mockResolvedValue(mockMongoMemoryServer);
      vi.mocked(mongoose.disconnect).mockRejectedValue(error);

      const inmemMongoDbServer: InmemMongoDbServer = new InmemMongoDbServer();
      await inmemMongoDbServer.startDb();

      await expect(inmemMongoDbServer.stopDb()).rejects.toThrow(error);
    });

    it('should not stop when trying to stop before startDb', async () => {
      const disconnectMock = vi.mocked(mongoose.disconnect)

      const createSpy = vi.spyOn(MongoMemoryServer, 'create');
      const stopMock = vi.fn();
      createSpy.mockResolvedValue({ stop: stopMock } as unknown as MongoMemoryServer)

      const inmemMongoDbServer: InmemMongoDbServer = new InmemMongoDbServer();
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

