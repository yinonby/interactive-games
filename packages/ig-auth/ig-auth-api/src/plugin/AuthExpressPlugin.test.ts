
import type { AuthPluginConfigT } from '@/types/AuthPluginTypes';
import type { EngineDbAdapter } from '@ig/app-engine-be-models';
import type { ExpressAppInfoT } from '@ig/be-utils';
import type { Router } from 'express';
import * as graphqlModule from '../graphql/server/GraphqlRouter';
import { authApiPlugin } from './AuthExpressPlugin';

describe('authApiPlugin', () => {
  let mockDbAdapter: EngineDbAdapter;
  let mockRouter: Router;

  beforeEach(() => {
    // Mock a DB adapter (methods are irrelevant here)
    mockDbAdapter = {} as EngineDbAdapter;

    // Mock an Express router
    mockRouter = {} as Router;

    // Spy on createGraphqlRouter and force it to return the mocked router
    vi.spyOn(graphqlModule, 'createGraphqlRouter').mockResolvedValue(mockRouter);
  });

  it('initRouter fails when db adapter is null', async () => {
    const mockAppInfo = {} as ExpressAppInfoT;

    await expect(authApiPlugin.initRouter(mockAppInfo, null)).rejects.toThrow();
  });

  it('initRouter calls createGraphqlRouter and returns a Router', async () => {
    const mockAppInfo = {} as ExpressAppInfoT;

    const router = await authApiPlugin.initRouter(mockAppInfo, mockDbAdapter, {} as AuthPluginConfigT);

    expect(graphqlModule.createGraphqlRouter).toHaveBeenCalledWith(mockDbAdapter, {});
    expect(router).toBe(mockRouter);
  });
});
