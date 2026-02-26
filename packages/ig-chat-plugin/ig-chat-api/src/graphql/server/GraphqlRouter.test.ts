
import type { ChatDbAdapter } from '@ig/chat-be-models';
import express from 'express';
import request from 'supertest';
import { createGraphqlRouter } from './GraphqlRouter';

describe('GraphqlRouter', () => {
  // Mock ChatDbAdapter
  const mock_ChatDbAdapter: ChatDbAdapter = {
    getChatMessagesTableAdapter: vi.fn(),
  } as unknown as ChatDbAdapter;

  let app: express.Express;

  beforeAll(async () => {
    const router = await createGraphqlRouter(mock_ChatDbAdapter);
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
