
import type { GameConfigLogicAdapter } from '@ig/games-engine-be-models';
import type { GameConfigT, UpdateGameConfigInputT } from '@ig/games-engine-models';
import { buildFullTestGameConfig } from '@ig/games-engine-models/test-utils';
import { createGameConfigResolvers } from './GameConfigResolvers';

describe('GameConfigResolvers', () => {
  it('getGameConfigs calls adapter and returns data', async () => {
    // Arrange: mock the adapter
    const mockConfig: GameConfigT = buildFullTestGameConfig({});
    const mockData: GameConfigT[] = [mockConfig];

    const mockAdapter: Partial<GameConfigLogicAdapter> = {
      getGameConfigs: vi.fn().mockResolvedValue(mockData),
    };

    const resolvers = createGameConfigResolvers(mockAdapter as GameConfigLogicAdapter);

    // Act
    const result = await resolvers.Query.getGameConfigs();

    // Assert
    expect(mockAdapter.getGameConfigs).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  it('updateGameConfig calls adapter and returns data', async () => {
    // Arrange: mock the adapter
    const mockConfig: GameConfigT = buildFullTestGameConfig({});
    const mockData: GameConfigT[] = [mockConfig];

    const mockAdapter: Partial<GameConfigLogicAdapter> = {
      updateGameConfig: vi.fn().mockResolvedValue(mockData),
    };

    const resolvers = createGameConfigResolvers(mockAdapter as GameConfigLogicAdapter);

    // Act
    const input: UpdateGameConfigInputT = { gameConfigId: 'gcid1' };
    const result = await resolvers.Mutation.updateGameConfig({}, { input: input});

    // Assert
    expect(mockAdapter.updateGameConfig).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockData);
  });
});
