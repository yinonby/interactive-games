
import { ApolloServer } from '@apollo/server';
import type {
  GamesDbAdapter,
  GameUserTableAdapter
} from '@ig/games-engine-be-models';
import { getPublicGameUserQuery, type GetPublicGameUserResultT } from '@ig/games-engine-models';
import { buildGameUserMock } from '@ig/games-engine-models/test-utils';
import { createGameUserSchema } from './GameUserSchema';

describe('createGameUserSchema', () => {
  it('creates a working schema and resolves getGameConfigs', async () => {
    // --- mock table adapter ---
    const mock_GameUserTableAdapter: Partial<GameUserTableAdapter> = {
      getGameUser: vi.fn().mockResolvedValue(buildGameUserMock({
        joinedGameConfigIds: ['GC1'],
      })),
    };

    // --- mock db adapter ---
    const mock_GamesDbAdapter: Partial<GamesDbAdapter> = {
      getGameUserTableAdapter: () => mock_GameUserTableAdapter as GameUserTableAdapter,
    };

    // --- create schema ---
    const schema = createGameUserSchema(mock_GamesDbAdapter as GamesDbAdapter);

    // --- create Apollo server ---
    const server = new ApolloServer({ schema });
    await server.start();

    // --- execute query ---
    const result = await server.executeOperation<GetPublicGameUserResultT>({
      query: getPublicGameUserQuery,
      variables: { },
    }, { contextValue: { gameUserId: 'USER1' }});

    // --- extract result ---
    assert(result.body.kind === 'single');
    const { data, errors } = result.body.singleResult;

    // --- assertions ---
    expect(errors).toBeUndefined();
    assert(data !== undefined);
    assert(data !== null);
    expect(data.publicGameUser.joinedGameConfigIds).toHaveLength(1);
    expect(data.publicGameUser.joinedGameConfigIds[0]).toEqual('GC1');

    // --- ensure logic path was called ---
    expect(mock_GameUserTableAdapter.getGameUser).toHaveBeenCalledOnce();
  });
});
