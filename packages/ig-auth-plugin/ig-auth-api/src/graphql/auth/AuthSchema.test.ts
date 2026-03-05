
import { ApolloServer } from '@apollo/server';
import type { SignupPluginAdapter, SignupServiceTransactionAdapter } from '@ig/auth-be-models';
import { getLoginInfoQuery, type GetLoginInfoResultT } from '@ig/auth-models';
import type { Request, Response } from 'express';
import type { AuthGraphqlContextT } from '../../types/AuthInternalTypes';
import type { AuthPluginConfigT } from '../../types/AuthPluginTypes';
import { createAuthSchema } from './AuthSchema';

describe('createAuthSchema', () => {
  const mock_SignupServiceTransactionAdapter = {} as SignupServiceTransactionAdapter;
  const mock_SignupPluginAdapter = {
    extractRequestAuthId: vi.fn().mockReturnValue(null),
  } as unknown as SignupPluginAdapter;
  const publicPluginConfig: AuthPluginConfigT = {
    getSignupServiceTransactionAdapter: () => mock_SignupServiceTransactionAdapter,
    getSignupPluginAdapter: () => mock_SignupPluginAdapter,
  };

  it('creates a working schema and resolves getLoginInfoQuery', async () => {
    // --- create schema ---
    const schema = createAuthSchema(publicPluginConfig);

    // --- create Apollo server ---
    const server = new ApolloServer<AuthGraphqlContextT>({ schema });
    await server.start();

    // --- execute query ---
    const result = await server.executeOperation<GetLoginInfoResultT>({
      query: getLoginInfoQuery,
    }, {
      contextValue: {
        req: {} as Request,
        res: {} as Response,
        reqAuthId: null,
      },
    });

    // --- extract result ---
    assert(result.body.kind === 'single');
    const { data, errors } = result.body.singleResult;

    // --- assertions ---
    expect(errors).toBeUndefined();
    assert(data !== undefined);
    assert(data !== null);
    expect(data.loginInfo.authId).toBe(null);
  });
});
