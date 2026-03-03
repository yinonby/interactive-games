
import type { SignupPluginAdapter, SignupServiceTransactionAdapter } from '@ig/auth-be-models';
import express from 'express';
import request from 'supertest';
import type { AuthPluginConfigT } from '../../types/AuthPluginTypes';
import { createGraphqlRouter } from './GraphqlRouter';

describe('GraphqlRouter', () => {
  const mock_SignupServiceTransactionAdapter = {} as SignupServiceTransactionAdapter;
  const mock_SignupPluginAdapter = {} as SignupPluginAdapter;
  const publicPluginConfig: AuthPluginConfigT = {
    getSignupServiceTransactionAdapter: () => mock_SignupServiceTransactionAdapter,
    getSignupPluginAdapter: () => mock_SignupPluginAdapter,
  };
  let app: express.Express;

  beforeAll(async () => {
    const router = await createGraphqlRouter(publicPluginConfig);
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
