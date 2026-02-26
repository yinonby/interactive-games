
import { AuthMongoDb } from '@/mongo/AuthMongoDb';
import { DbClient, MongoInmemDbServer } from '@ig/be-utils';
import { getMongoMemoryServerCreateTimeout } from '@ig/vitest';

let mongoInmemDbServer: MongoInmemDbServer;
let dbClient: DbClient;
const authMongoDb = new AuthMongoDb();

beforeAll(async () => {
  // start a local mongo inmem server
  mongoInmemDbServer = new MongoInmemDbServer();
  const uri = await mongoInmemDbServer.startDb();

  dbClient = new DbClient({ dbType: 'mongodb', mongoConnString: uri, tableNamePrefix: '' });
  await dbClient.dbConnect();

  await authMongoDb.init();
}, getMongoMemoryServerCreateTimeout());

beforeEach(async () => {
  await dbClient.dropDb();
  await authMongoDb.recreate();
});

afterEach(async () => {
});

afterAll(async () => {
  await mongoInmemDbServer.stopDb();
});
