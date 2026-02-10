
import type { DbClientProvider } from '@/types/DbTypes';
import type { ExpressAppDbInfoT } from '../types/exported/ExpressTypes';
import { DbClient } from './DbClient';
import { MongoDbClient } from './MongoDbClient';

vi.mock('./MongoDbClient');

describe('DbInstance', () => {
  const dbConnectMock = vi.fn();
  const dbDisconnetMock = vi.fn();
  const dropDbMock = vi.fn();
  dbConnectMock.mockResolvedValue(undefined);
  dbDisconnetMock.mockResolvedValue(undefined);
  const mockMongoDbClient: DbClientProvider = {
    dbConnect: dbConnectMock,
    dbDisconnet: dbDisconnetMock,
    dropDb: dropDbMock,
  };
  vi.mocked(MongoDbClient).mockReturnValue(mockMongoDbClient as MongoDbClient);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should throw error for mysql dbType', () => {
      const dbInfo: ExpressAppDbInfoT = { dbType: 'mysql' } as ExpressAppDbInfoT;

      expect(() => new DbClient(dbInfo)).toThrow('MySql is currently not supported');
    });

    it('init a mongo server', () => {
      const dbInfo: ExpressAppDbInfoT = { dbType: 'mongodb', mongoConnString: 'CONN' } as ExpressAppDbInfoT;
      new DbClient(dbInfo);

      expect(MongoDbClient).toHaveBeenCalledWith('CONN');
    });

    it('init throw error for unknown type', () => {
      const dbInfo: ExpressAppDbInfoT = { dbType: 'unknown' as 'mongodb'} as ExpressAppDbInfoT;

      expect(() => new DbClient(dbInfo)).toThrow('Unexpected db type');
    });
  });

  describe('dbConnect', () => {
    it('should call dbClientProvider.dbConnect', async () => {
      const dbInfo: ExpressAppDbInfoT = { dbType: 'mongodb'} as ExpressAppDbInfoT;
      const dbClient: DbClient = new DbClient(dbInfo);

      await dbClient.dbConnect();
      expect(dbConnectMock).toHaveBeenCalled();
    });
  });

  describe('dbDisconnet', () => {
    it('should throw error for mysql dbType', async () => {
      const dbInfo: ExpressAppDbInfoT = { dbType: 'mongodb'} as ExpressAppDbInfoT;
      const dbClient: DbClient = new DbClient(dbInfo);

      await dbClient.dbDisconnet();
      expect(dbDisconnetMock).toHaveBeenCalled();
    });
  });

  describe('dropDb', () => {
    it('should throw error for mysql dbType', async () => {
      const dbInfo: ExpressAppDbInfoT = { dbType: 'mongodb'} as ExpressAppDbInfoT;
      const dbClient: DbClient = new DbClient(dbInfo);

      await dbClient.dropDb();
      expect(dropDbMock).toHaveBeenCalled();
    });
  });
});
