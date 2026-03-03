
import type { ExpressAppInfoT } from '@ig/be-utils';
import type { GamesDbAdapter, GamesRequestAdapter, GamesUserAdapter } from '@ig/games-engine-be-models';
import type { WordleAdapter } from '@ig/games-wordle-be-models';
import type { Router } from 'express';
import * as graphqlModule from '../graphql/server/GraphqlRouter';
import type { GamesPluginConfigT } from '../types/GamesPluginTypes';
import { gamesApiPlugin } from './GamesExpressPlugin';

describe('gamesApiPlugin', () => {
  let mockRouter: Router;

  beforeEach(() => {
    // Mock an Express router
    mockRouter = {} as Router;

    // Spy on createGraphqlRouter and force it to return the mocked router
    vi.spyOn(graphqlModule, 'createGraphqlRouter').mockResolvedValue(mockRouter);
  });

  it('initRouter calls createGraphqlRouter and returns a Router', async () => {
    const appInfoMock = {} as ExpressAppInfoT;
    const pluginConfigMock: GamesPluginConfigT = {
      gamesDbAdapter: 'GamesDbAdapter' as unknown as GamesDbAdapter,
      gamesRequestAdapter: 'GamesRequestAdapter' as unknown as GamesRequestAdapter,
      gamesUserAdapter: 'GamesUserAdapter' as unknown as GamesUserAdapter,
      wordleAdapter: 'WordleAdapter' as unknown as WordleAdapter,
    };

    const router = await gamesApiPlugin.initRouter(appInfoMock, pluginConfigMock);

    expect(graphqlModule.createGraphqlRouter).toHaveBeenCalledWith(
      pluginConfigMock.gamesDbAdapter,
      pluginConfigMock.gamesRequestAdapter,
      pluginConfigMock.gamesUserAdapter,
      pluginConfigMock.wordleAdapter,
    );
    expect(router).toBe(mockRouter);
  });
});
