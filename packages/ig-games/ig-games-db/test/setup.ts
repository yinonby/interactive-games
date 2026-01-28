
import { GamesMongoDb } from '@/mongo/GamesMongoDb';
import { InmemMongoDbServer } from '@ig/be-lib';
import { initBeLibMocks } from '@ig/be-lib/test/mocks/BeLibMocks';

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
