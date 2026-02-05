
import { ApolloServer } from '@apollo/server';
import type { AuthLogicAdapter } from '@ig/auth-be-models';
import { healthQuery, type HealthQuryResultT } from '@ig/auth-models';
import type { Request, Response } from 'express';
import type { ApolloContextT, AuthPluginConfigT } from '../../types/AuthPluginTypes';
import { createAuthSchema } from './AuthSchema';

describe('createAuthSchema', () => {
  const authLogicAdapterMock = {} as AuthLogicAdapter;
  const pluginConfig: AuthPluginConfigT = {
    getAuthLogicAdapter: () => authLogicAdapterMock,
  };

  it('creates a working schema and resolves guestLogin', async () => {
    // --- create schema ---
    const schema = createAuthSchema(pluginConfig);

    // --- create Apollo server ---
    const server = new ApolloServer<ApolloContextT>({ schema });
    await server.start();

    // --- execute query ---
    const result = await server.executeOperation<HealthQuryResultT>({
      query: healthQuery,
    }, {
      contextValue: {
        req: {} as Request,
        res: {} as Response,
      },
    });

    // --- extract result ---
    assert(result.body.kind === 'single');
    const { data, errors } = result.body.singleResult;

    // --- assertions ---
    expect(errors).toBeUndefined();
    assert(data !== undefined);
    assert(data !== null);
    expect(data._health).toBe(true);
  });
});
