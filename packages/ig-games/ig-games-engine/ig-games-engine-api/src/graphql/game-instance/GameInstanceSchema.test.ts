
import { ApolloServer } from '@apollo/server';
import type { GameInstancesTableAdapter, GamesDbAdapter } from '@ig/games-engine-be-models';
import { getGameConfigInstanceIdsQuery, type GetGameConfigInstanceIdsResultT } from '@ig/games-engine-models';
import { createGameInstanceSchema } from './GameInstanceSchema';

describe('createGameInstanceSchema', () => {
  it('creates a working schema and resolves getGameConfigs', async () => {
    // --- mock table adapter ---
    const mock_GameInstancesTableAdapter: Partial<GameInstancesTableAdapter> = {
      getGameConfigInstanceIds: vi.fn().mockResolvedValue(['GI1']),
    };

    // --- mock db adapter ---
    const mock_GamesDbAdapter: GamesDbAdapter = {
      getGameInstancesTableAdapter: () => mock_GameInstancesTableAdapter,
    } as GamesDbAdapter;

    // --- create schema ---
    const schema = createGameInstanceSchema(mock_GamesDbAdapter);

    // --- create Apollo server ---
    const server = new ApolloServer({ schema });
    await server.start();

    // --- execute query ---
    const result = await server.executeOperation<GetGameConfigInstanceIdsResultT>({
      query: getGameConfigInstanceIdsQuery,
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
    expect(mock_GameInstancesTableAdapter.getGameConfigInstanceIds).toHaveBeenCalledOnce();
  });
});
