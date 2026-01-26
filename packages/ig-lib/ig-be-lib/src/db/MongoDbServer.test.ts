
import mongoose from 'mongoose';
import { MongoDbServer } from './MongoDbServer';

vi.mock('mongoose');

describe('MongoDbServer', () => {
  let mongoDbServer: MongoDbServer;
  const mongoConnString = 'mongodb://localhost:27017/testdb';

  beforeEach(() => {
    vi.clearAllMocks();
    mongoDbServer = new MongoDbServer(mongoConnString);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('startDb', () => {
    it('should call mongoose.connect with the connection string', async () => {
      await mongoDbServer.startDb();

      expect(mongoose.connect).toHaveBeenCalledWith(mongoConnString);
      expect(mongoose.connect).toHaveBeenCalledTimes(1);
    });

    it('should throw error if mongoose.connect fails', async () => {
      const error = new Error('Connection failed');
      vi.mocked(mongoose.connect).mockRejectedValueOnce(error);

      await expect(mongoDbServer.startDb()).rejects.toThrow('Connection failed');
    });
  });

  describe('stopDb', () => {
    it('should call mongoose.disconnect', async () => {
      await mongoDbServer.stopDb();

      expect(mongoose.disconnect).toHaveBeenCalledTimes(1);
    });

    it('should throw error if mongoose.disconnect fails', async () => {
      const error = new Error('Connection failed');
      vi.mocked(mongoose.disconnect).mockRejectedValueOnce(error);

      await expect(mongoDbServer.stopDb()).rejects.toThrow('Connection failed');
    });
  });
});
