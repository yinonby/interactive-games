
import type { ExpressAppInfoT } from '@ig/be-lib';
import type { GamesDbAdapter } from '@ig/games-be-models';
import type { Router } from 'express';
import * as graphqlModule from '../graphql/server/GraphqlRouter';
import { gamesApiPlugin } from './GamesExpressPlugin';

describe('gamesApiPlugin', () => {
  let mockDbAdapter: GamesDbAdapter;
  let mockRouter: Router;

  beforeEach(() => {
    // Mock a DB adapter (methods are irrelevant here)
    mockDbAdapter = {} as GamesDbAdapter;

    // Mock an Express router
    mockRouter = {} as Router;

    // Spy on createGraphqlRouter and force it to return the mocked router
    vi.spyOn(graphqlModule, 'createGraphqlRouter').mockResolvedValue(mockRouter);
  });

  it('initRouter fails when db adapter is null', async () => {
    const mockAppInfo = {} as ExpressAppInfoT;

    await expect(gamesApiPlugin.initRouter(mockAppInfo, null)).rejects.toThrow();
  });

  it('initRouter calls createGraphqlRouter and returns a Router', async () => {
    const mockAppInfo = {} as ExpressAppInfoT;

    const router = await gamesApiPlugin.initRouter(mockAppInfo, mockDbAdapter);

    expect(graphqlModule.createGraphqlRouter).toHaveBeenCalledWith(mockDbAdapter);
    expect(router).toBe(mockRouter);
  });
});
