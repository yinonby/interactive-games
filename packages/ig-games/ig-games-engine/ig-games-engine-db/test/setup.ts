
import { GamesMongoDb } from '@/mongo/GamesMongoDb';
import { InmemMongoDbServer } from '@ig/be-utils';
import { initBeLibMocks } from '@ig/be-utils/test/mocks/BeLibMocks';

let inmemMongoDbServer: InmemMongoDbServer;
const gamesMongoDb = new GamesMongoDb();

beforeAll(async () => {
  inmemMongoDbServer = new InmemMongoDbServer();
  await inmemMongoDbServer.startDb();

  await gamesMongoDb.init();
});

beforeEach(async () => {
  await inmemMongoDbServer.dropDb();
  await gamesMongoDb.recreate();
});

afterEach(async () => {
});

afterAll(async () => {
  await inmemMongoDbServer.stopDb();
});

initBeLibMocks();
