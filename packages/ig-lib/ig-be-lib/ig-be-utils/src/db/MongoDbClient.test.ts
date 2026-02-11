
import mongoose from 'mongoose';
import { MongoDbClient } from './MongoDbClient';

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

describe('MongoDbClient', () => {
  let mongoDbClient: MongoDbClient;
  const mongoConnString = 'mongodb://localhost:27017/testdb';

  beforeEach(() => {
    vi.clearAllMocks();

    mongoDbClient = new MongoDbClient(mongoConnString);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('dbConnect', () => {
    it('should call mongoose.connect with the connection string', async () => {
      await mongoDbClient.dbConnect();

      expect(mongoose.connect).toHaveBeenCalledWith(mongoConnString);
      expect(mongoose.connect).toHaveBeenCalledTimes(1);
    });

    it('should throw error if mongoose.connect fails', async () => {
      const error = new Error('Connection failed');
      vi.mocked(mongoose.connect).mockRejectedValueOnce(error);

      await expect(mongoDbClient.dbConnect()).rejects.toThrow('Connection failed');
    });
  });

  describe('dbDisconnect', () => {
    it('should call mongoose.disconnect', async () => {
      await mongoDbClient.dbDisconnect();

      expect(mongoose.disconnect).toHaveBeenCalledTimes(1);
    });

    it('should throw error if mongoose.disconnect fails', async () => {
      const error = new Error('Connection failed');
      vi.mocked(mongoose.disconnect).mockRejectedValueOnce(error);

      await expect(mongoDbClient.dbDisconnect()).rejects.toThrow('Connection failed');
    });
  });

  describe('dropDb', () => {
    it('should not dropDb when disconnected', async () => {
      await mongoDbClient.dbDisconnect();

      expect(mongoose.connection.db?.dropDatabase).not.toHaveBeenCalled();
    });

    it('should dropDb when connected', async () => {

      await mongoDbClient.dropDb();

      expect(mongoose.connection.db?.dropDatabase).toHaveBeenCalledTimes(1);
    });
  });
});
