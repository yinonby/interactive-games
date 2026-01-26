
import type { DbProvider } from '@/types/DbTypes';
import type { ExpressAppDbInfoT } from '../types/exported/ExpressTypes';
import { DbInstance } from './DbInstance';
import { InmemMongoDbServer } from './InmemMongoDbServer';
import { MongoDbServer } from './MongoDbServer';

vi.mock('./InmemMongoDbServer');
vi.mock('./MongoDbServer');

describe('DbInstance', () => {
  const startDbMock = vi.fn();
  const stopDbMock = vi.fn();
  startDbMock.mockResolvedValue(undefined);
  stopDbMock.mockResolvedValue(undefined);
  const mockInmemMongoServer: DbProvider = {
    startDb: startDbMock,
    stopDb: stopDbMock,
  };
  vi.mocked(InmemMongoDbServer).mockReturnValue(mockInmemMongoServer as InmemMongoDbServer);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should throw error for mysql dbType', () => {
      const dbInfo: ExpressAppDbInfoT = { dbType: 'mysql' } as ExpressAppDbInfoT;

      expect(() => new DbInstance(dbInfo)).toThrow('MySql is currently not supported');
    });

    it('init an inmem-mongo server', () => {
      const dbInfo: ExpressAppDbInfoT = { dbType: 'inmem-mongodb'} as ExpressAppDbInfoT;
      new DbInstance(dbInfo);

      expect(InmemMongoDbServer).toHaveBeenCalled();
    });

    it('init a mongo server', () => {
      const dbInfo: ExpressAppDbInfoT = { dbType: 'mongodb', mongoConnString: 'CONN' } as ExpressAppDbInfoT;
      new DbInstance(dbInfo);

      expect(MongoDbServer).toHaveBeenCalledWith('CONN');
    });
  });

  describe('startDb', () => {
    it('should call dbProvider.startDb', async () => {
      const dbInfo: ExpressAppDbInfoT = { dbType: 'inmem-mongodb'} as ExpressAppDbInfoT;
      const dbInstance: DbInstance = new DbInstance(dbInfo);

      await dbInstance.startDb();
      expect(startDbMock).toHaveBeenCalled();
    });
  });

  describe('stopDb', () => {
    it('should throw error for mysql dbType', async () => {
      const dbInfo: ExpressAppDbInfoT = { dbType: 'inmem-mongodb'} as ExpressAppDbInfoT;
      const dbInstance: DbInstance = new DbInstance(dbInfo);

      await dbInstance.stopDb();
      expect(stopDbMock).toHaveBeenCalled();
    });
  });
});
