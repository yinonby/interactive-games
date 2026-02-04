
import type { EngineDbAdapter } from '@ig/app-engine-be-models';
import express from 'express';
import request from 'supertest';
import type { AuthPluginConfigT } from '../../types/AuthPluginTypes';
import { createGraphqlRouter } from './GraphqlRouter';

describe('GraphqlRouter', () => {
  // Mock EngineDbAdapter
  const usersTableAdapterMock = vi.fn();
  const mockEngineDbAdapter: EngineDbAdapter = {
    getUsersTableAdapter: vi.fn().mockReturnValue(usersTableAdapterMock),
  };
  const pluginConfig: AuthPluginConfigT = {
    jwtCookieDomain: 'DOMAIN1',
    jwtAlgorithm: 'HS256',
    jwtSecret: 'SECRET',
    jwtCookieIsSecure: true,
    jwtExpiresInMs: 100,
  };
  let app: express.Express;

  beforeAll(async () => {
    const router = await createGraphqlRouter(mockEngineDbAdapter, pluginConfig);
    app = express();
    app.use(express.json());
    app.use(router);
  });

  it('should respond at /graphql', async () => {
    const response = await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('apollo-require-preflight', 'true')
      .send({ query: '{ __typename }' }); // minimal introspection query

    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
  });
});
