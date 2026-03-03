
import type { GameUserLogicAdapter } from '@ig/games-engine-be-models';
import type {
  AddGameConfigIdInputT
} from '@ig/games-engine-models';
import { createGameUserResolvers } from './GameUserResolvers';

describe('GameConfigResolvers', () => {
  it('getPublicGameUser calls adapter and returns data', async () => {
    // Arrange: mock the adapter
    const mock_GameUserLogicAdapter: Partial<GameUserLogicAdapter> = {
      getPublicGameUser: vi.fn().mockResolvedValue(null),
    };

    const resolvers = createGameUserResolvers(mock_GameUserLogicAdapter as GameUserLogicAdapter);

    // Act
    const result = await resolvers.Query.getPublicGameUser(
      { },
      { },
      { gameUserId: 'USER1', headers: {} }
    );

    // Assert
    expect(mock_GameUserLogicAdapter.getPublicGameUser).toHaveBeenCalledWith(
      'USER1',
    );
    expect(result).toEqual(null);
  });

  it('addGameConfigId calls adapter and returns data', async () => {
    // Arrange: mock the adapter
    const mock_GameUserLogicAdapter: Partial<GameUserLogicAdapter> = {
      addGameConfigId: vi.fn().mockResolvedValue('RES'),
    };

    const resolvers = createGameUserResolvers(mock_GameUserLogicAdapter as GameUserLogicAdapter);

    // Act
    const input: AddGameConfigIdInputT = { gameConfigId: 'GC1' };
    const result = await resolvers.Mutation.addGameConfigId({}, { input }, { gameUserId: 'USER1', headers: {} });

    // Assert
    expect(mock_GameUserLogicAdapter.addGameConfigId).toHaveBeenCalledWith('USER1', input);
    expect(result).toEqual('RES');
  });
});
