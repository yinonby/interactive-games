
import type { GamesDbAdapter, GamesRequestAdapter, GamesUserAdapter } from '@ig/games-engine-be-models';
import type { WordleAdapter } from '@ig/games-wordle-be-models';
import express from 'express';
import request from 'supertest';
import { createGraphqlRouter } from './GraphqlRouter';

describe('GraphqlRouter', () => {
  // Mock GamesDbAdapter
  const mock_GamesDbAdapter: GamesDbAdapter = {
    getGameUserTableAdapter: vi.fn().mockReturnValue({}),
    getGameConfigsTableAdapter: vi.fn().mockReturnValue({}),
    getGameInstancesTableAdapter: vi.fn().mockReturnValue({}),
  };

  const mock_extractPlayerId = vi.fn();
  const mock_gamesAuthJwtAdapter: GamesRequestAdapter = {
    extractGameUserId: mock_extractPlayerId,
  }

  const mock_gamesPlayerInfoAdapter: GamesUserAdapter = {
    retrieveGameUserInfo: vi.fn(),
  }

  const mock_generateWordleSolution = vi.fn();
  const mock_wordleAdapter: WordleAdapter = {
    generateWordleSolution: mock_generateWordleSolution,
  }

  let app: express.Express;

  beforeAll(async () => {
    const router = await createGraphqlRouter(mock_GamesDbAdapter, mock_gamesAuthJwtAdapter,
      mock_gamesPlayerInfoAdapter, mock_wordleAdapter);
    app = express();
    app.use(express.json());
    app.use(router);
  });

  it('should respond at /graphql', async () => {
    // setup mocks
    mock_extractPlayerId.mockReturnValue('USER1');

    const response = await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('apollo-require-preflight', 'true')
      .send({ query: '{ __typename }' }); // minimal introspection query

    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
  });
});
