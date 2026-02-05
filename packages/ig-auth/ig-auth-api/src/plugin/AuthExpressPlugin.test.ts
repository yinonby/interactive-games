
import type { AuthLogicAdapter } from '@ig/auth-be-models';
import type { ExpressAppInfoT } from '@ig/be-utils';
import type { Router } from 'express';
import * as graphqlModule from '../graphql/server/GraphqlRouter';
import type { AuthPluginConfigT } from '../types/AuthPluginTypes';
import { authApiPlugin } from './AuthExpressPlugin';

describe('authApiPlugin', () => {
  let mockRouter: Router;

  beforeEach(() => {
    // Mock an Express router
    mockRouter = {} as Router;

    // Spy on createGraphqlRouter and force it to return the mocked router
    vi.spyOn(graphqlModule, 'createGraphqlRouter').mockResolvedValue(mockRouter);
  });

  it('initRouter calls createGraphqlRouter and returns a Router', async () => {
    const mockAppInfo = {} as ExpressAppInfoT;
    const authLogicAdapterMock = {} as AuthLogicAdapter;
    const pluginConfig: AuthPluginConfigT = {
      getAuthLogicAdapter: () => authLogicAdapterMock,
    };

    const router = await authApiPlugin.initRouter(mockAppInfo, pluginConfig);

    expect(graphqlModule.createGraphqlRouter).toHaveBeenCalledWith(pluginConfig);
    expect(router).toBe(mockRouter);
  });
});
