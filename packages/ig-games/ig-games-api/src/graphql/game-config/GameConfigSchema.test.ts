
import { ApolloServer } from '@apollo/server';
import type { GameConfigsTableAdapter, GamesDbAdapter } from '@ig/games-be-models';
import { buildFullTestGameConfig } from '@ig/games-models/test-utils';
import { createGameConfigSchema } from './GameConfigSchema';

describe('createGameConfigSchema', () => {
  it('creates a working schema and resolves getGameConfigs', async () => {
    // --- mock table adapter ---
    const mockTableAdapter: Partial<GameConfigsTableAdapter> = {
      getGameConfigs: vi.fn().mockResolvedValue([
        buildFullTestGameConfig({
          gameConfigId: 'gc-1',
          kind: 'jointGame',
          gameName: 'Test Game',
          maxDurationInfo: { kind: 'limited', durationMs: 60000 },
          maxParticipants: 4,
        }),
      ]),
      createGameConfig: vi.fn(),
      updateGameConfig: vi.fn(),
    };

    // --- mock db adapter ---
    const mockDbAdapter: GamesDbAdapter = {
      getGameConfigsTableAdapter: () => mockTableAdapter,
    } as GamesDbAdapter;

    // --- create schema ---
    const schema = createGameConfigSchema(mockDbAdapter);

    // --- create Apollo server ---
    const server = new ApolloServer({ schema });
    await server.start();

    type GetGameConfigsResult = {
      getGameConfigs: {
        gameConfigId: string;
        gameName: string;
        maxParticipants: number;
      }[];
    };

    // --- execute query ---
    const result = await server.executeOperation<GetGameConfigsResult>({
      query: `
        query {
          getGameConfigs {
            gameConfigId
            gameName
            maxParticipants
          }
        }
      `,
    });

    // --- extract result ---
    assert(result.body.kind === 'single');
    const { data, errors } = result.body.singleResult;

    // --- assertions ---
    expect(errors).toBeUndefined();
    assert(data !== undefined);
    assert(data !== null);
    expect(data.getGameConfigs).toHaveLength(1);
    expect(data.getGameConfigs[0]).toEqual({
      gameConfigId: 'gc-1',
      gameName: 'Test Game',
      maxParticipants: 4,
    });

    // --- ensure logic path was called ---
    expect(mockTableAdapter.getGameConfigs).toHaveBeenCalledOnce();
  });
});
