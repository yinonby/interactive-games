
import { DbClient, MongoInmemDbServer } from '@ig/be-utils';
import { initBeLibMocks } from '@ig/be-utils/test/mocks/BeLibMocks';
import { EngineMongoDb } from '../src/mongo/EngineMongoDb';

let mongoInmemDbServer: MongoInmemDbServer;
let dbClient: DbClient;
const gamesMongoDb = new EngineMongoDb();

beforeAll(async () => {
  // start a local mongo inmem server
  mongoInmemDbServer = new MongoInmemDbServer();
  const uri = await mongoInmemDbServer.startDb();

  dbClient = new DbClient({ dbType: 'mongodb', mongoConnString: uri, tableNamePrefix: '' });
  await dbClient.dbConnect();

  await gamesMongoDb.init();
});

beforeEach(async () => {
  await dbClient.dropDb();
  await gamesMongoDb.recreate();
});

afterEach(async () => {
});

afterAll(async () => {
  await mongoInmemDbServer.stopDb();
});

initBeLibMocks();
