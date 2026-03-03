
import { ApolloServer } from '@apollo/server';
import type {
  GameInstancesTableAdapter,
  GamesDbAdapter, GamesUserAdapter
} from '@ig/games-engine-be-models';
import {
  getGameInstanceIdsForGameConfigQuery,
  type GetGameInstanceIdsForGameConfigResultT
} from '@ig/games-engine-models';
import type { WordleAdapter } from '@ig/games-wordle-be-models';
import { createGameInstanceSchema } from './GameInstanceSchema';

describe('createGameInstanceSchema', () => {
  it('creates a working schema and resolves getGameConfigs', async () => {
    // --- mock table adapter ---
    const mock_GameInstancesTableAdapter: Partial<GameInstancesTableAdapter> = {
      getGameInstanceIdsForGameConfig: vi.fn().mockResolvedValue(['GI1']),
    };

    // --- mock db adapter ---
    const mock_GamesDbAdapter: Partial<GamesDbAdapter> = {
      getGameConfigsTableAdapter: vi.fn(),
      getGameInstancesTableAdapter: () => mock_GameInstancesTableAdapter as GameInstancesTableAdapter,
    };

    const mock_gamesPlayerInfoAdapter: GamesUserAdapter = {
      retrieveGameUserInfo: vi.fn(),
    }

    const mock_wordleAdapter: WordleAdapter = {
      generateWordleSolution: vi.fn(),
    }

    // --- create schema ---
    const schema = createGameInstanceSchema(mock_GamesDbAdapter as GamesDbAdapter,
      mock_gamesPlayerInfoAdapter, mock_wordleAdapter);

    // --- create Apollo server ---
    const server = new ApolloServer({ schema });
    await server.start();

    // --- execute query ---
    const result = await server.executeOperation<GetGameInstanceIdsForGameConfigResultT>({
      query: getGameInstanceIdsForGameConfigQuery,
      variables: { gameConfigId: 'GC1' },
    });

    // --- extract result ---
    assert(result.body.kind === 'single');
    const { data, errors } = result.body.singleResult;

    // --- assertions ---
    expect(errors).toBeUndefined();
    assert(data !== undefined);
    assert(data !== null);
    expect(data.gameInstanceIds).toHaveLength(1);
    expect(data.gameInstanceIds[0]).toEqual('GI1');

    // --- ensure logic path was called ---
    expect(mock_GameInstancesTableAdapter.getGameInstanceIdsForGameConfig).toHaveBeenCalledOnce();
  });
});
