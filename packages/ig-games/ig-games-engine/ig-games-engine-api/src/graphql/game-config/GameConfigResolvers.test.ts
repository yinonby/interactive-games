
import type { GameConfigLogicAdapter } from '@ig/games-engine-be-models';
import type { GameConfigT, GameInfoT, UpdateGameConfigInputT } from '@ig/games-engine-models';
import { buildFullTestGameConfig, buildFullTestGameInfo } from '@ig/games-engine-models/test-utils';
import { createGameConfigResolvers } from './GameConfigResolvers';

describe('GameConfigResolvers', () => {
  it('getGameConfigs calls adapter and returns data', async () => {
    // Arrange: mock the adapter
    const mockGameConfig: GameConfigT = buildFullTestGameConfig();
    const mockGameConfigs: GameConfigT[] = [mockGameConfig];

    const mockAdapter: Partial<GameConfigLogicAdapter> = {
      getGameConfigs: vi.fn().mockResolvedValue(mockGameConfigs),
    };

    const resolvers = createGameConfigResolvers(mockAdapter as GameConfigLogicAdapter);

    // Act
    const result = await resolvers.Query.getGameConfigs();

    // Assert
    expect(mockAdapter.getGameConfigs).toHaveBeenCalled();
    expect(result).toEqual(mockGameConfigs);
  });

  it('getGameInfos calls adapter and returns data', async () => {
    // Arrange: mock the adapter
    const mockGameInfo: GameInfoT = buildFullTestGameInfo({});
    const mockGameInfos: GameInfoT[] = [mockGameInfo];

    const mockAdapter: Partial<GameConfigLogicAdapter> = {
      getGameInfos: vi.fn().mockResolvedValue(mockGameInfos),
    };

    const resolvers = createGameConfigResolvers(mockAdapter as GameConfigLogicAdapter);

    // Act
    const result = await resolvers.Query.getGameInfos();

    // Assert
    expect(mockAdapter.getGameInfos).toHaveBeenCalled();
    expect(result).toEqual(mockGameInfos);
  });

  it('updateGameConfig calls adapter and returns data', async () => {
    // Arrange: mock the adapter
    const mockGameInfo: GameInfoT = buildFullTestGameInfo({});
    const mockGameInfos: GameInfoT[] = [mockGameInfo];

    const mockAdapter: Partial<GameConfigLogicAdapter> = {
      updateGameConfig: vi.fn().mockResolvedValue(mockGameInfos),
    };

    const resolvers = createGameConfigResolvers(mockAdapter as GameConfigLogicAdapter);

    // Act
    const input: UpdateGameConfigInputT = { gameConfigId: 'gcid1' };
    const result = await resolvers.Mutation.updateGameConfig({}, { input: input});

    // Assert
    expect(mockAdapter.updateGameConfig).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockGameInfos);
  });
});
