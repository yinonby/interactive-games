
import type { GameConfigLogicAdapter } from '@ig/games-engine-be-models';
import type { GameConfigT, PublicGameConfigT, UpdateGameConfigInputT } from '@ig/games-engine-models';
import { buildGameConfigMock, buildPublicGameConfigMock } from '@ig/games-engine-models/test-utils';
import { createGameConfigResolvers } from './GameConfigResolvers';

describe('GameConfigResolvers', () => {
  it('getGameConfigs calls adapter and returns data', async () => {
    // Arrange: mock the adapter
    const mockGameConfig: GameConfigT = buildGameConfigMock();
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

  it('getPublicGameConfigs calls adapter and returns data', async () => {
    // Arrange: mock the adapter
    const mockPublicGameConfig: PublicGameConfigT = buildPublicGameConfigMock();
    const mockPublicGameConfigs: PublicGameConfigT[] = [mockPublicGameConfig];

    const mockAdapter: Partial<GameConfigLogicAdapter> = {
      getPublicGameConfigs: vi.fn().mockResolvedValue(mockPublicGameConfigs),
    };

    const resolvers = createGameConfigResolvers(mockAdapter as GameConfigLogicAdapter);

    // Act
    const result = await resolvers.Query.getPublicGameConfigs({}, {});

    // Assert
    expect(mockAdapter.getPublicGameConfigs).toHaveBeenCalled();
    expect(result).toEqual(mockPublicGameConfigs);
  });

  it('getMinimalPublicGameConfigs calls adapter and returns data', async () => {
    // Arrange: mock the adapter
    const mockPublicGameConfig: PublicGameConfigT = buildPublicGameConfigMock();
    const mockPublicGameConfigs: PublicGameConfigT[] = [mockPublicGameConfig];

    const mockAdapter: Partial<GameConfigLogicAdapter> = {
      getPublicGameConfigs: vi.fn().mockResolvedValue(mockPublicGameConfigs),
    };

    const resolvers = createGameConfigResolvers(mockAdapter as GameConfigLogicAdapter);

    // Act
    const result = await resolvers.Query.getMinimalPublicGameConfigs();

    // Assert
    expect(mockAdapter.getPublicGameConfigs).toHaveBeenCalled();
    expect(result).toEqual(mockPublicGameConfigs);
  });

  it('getPublicGameConfig calls adapter and returns data', async () => {
    // Arrange: mock the adapter
    const mockPublicGameConfig: PublicGameConfigT = buildPublicGameConfigMock();
    const mockPublicGameConfigs: PublicGameConfigT[] = [mockPublicGameConfig];

    const mockAdapter: Partial<GameConfigLogicAdapter> = {
      getPublicGameConfig: vi.fn().mockResolvedValue(mockPublicGameConfigs),
    };

    const resolvers = createGameConfigResolvers(mockAdapter as GameConfigLogicAdapter);

    // Act
    const result = await resolvers.Query.getPublicGameConfig({}, { gameConfigId: 'GC1' });

    // Assert
    expect(mockAdapter.getPublicGameConfig).toHaveBeenCalled();
    expect(result).toEqual(mockPublicGameConfigs);
  });

  it('updateGameConfig calls adapter and returns data', async () => {
    // Arrange: mock the adapter
    const mockPublicGameConfig: PublicGameConfigT = buildPublicGameConfigMock({});
    const mockPublicGameConfigs: PublicGameConfigT[] = [mockPublicGameConfig];

    const mockAdapter: Partial<GameConfigLogicAdapter> = {
      updateGameConfig: vi.fn().mockResolvedValue(mockPublicGameConfigs),
    };

    const resolvers = createGameConfigResolvers(mockAdapter as GameConfigLogicAdapter);

    // Act
    const input: UpdateGameConfigInputT = { gameConfigId: 'gcid1', partialGameConfigNoId: {} };
    const result = await resolvers.Mutation.updateGameConfig({}, { input: input});

    // Assert
    expect(mockAdapter.updateGameConfig).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockPublicGameConfigs);
  });
});
