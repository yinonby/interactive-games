
import type { GameInstanceLogicAdapter } from '@ig/games-engine-be-models';
import type { AddPlayerInputT, StartPlayingInputT, SubmitGuessInputT } from '@ig/games-engine-models';
import { buildTestPublicPlayerInfo } from '@ig/games-engine-models/test-utils';
import { createGameInstanceResolvers } from './GameInstanceResolvers';

describe('GameConfigResolvers', () => {
  it('getGameConfigInstanceIds calls adapter and returns data', async () => {
    // Arrange: mock the adapter
    const mock_GameInstanceLogicAdapter: Partial<GameInstanceLogicAdapter> = {
      getGameConfigInstanceIds: vi.fn().mockResolvedValue(['GI1']),
    };

    const resolvers = createGameInstanceResolvers(mock_GameInstanceLogicAdapter as GameInstanceLogicAdapter);

    // Act
    const result = await resolvers.Query.getGameConfigInstanceIds('GC1');

    // Assert
    expect(mock_GameInstanceLogicAdapter.getGameConfigInstanceIds).toHaveBeenCalled();
    expect(result).toEqual(['GI1']);
  });

  it('getPublicGameInstance calls adapter and returns data', async () => {
    // Arrange: mock the adapter
    const mock_GameInstanceLogicAdapter: Partial<GameInstanceLogicAdapter> = {
      getPublicGameInstance: vi.fn().mockResolvedValue(null),
    };

    const resolvers = createGameInstanceResolvers(mock_GameInstanceLogicAdapter as GameInstanceLogicAdapter);

    // Act
    const result = await resolvers.Query.getPublicGameInstance('GI1');

    // Assert
    expect(mock_GameInstanceLogicAdapter.getPublicGameInstance).toHaveBeenCalled();
    expect(result).toEqual(null);
  });

  it('addPlayer calls adapter and returns data', async () => {
    // Arrange: mock the adapter
    const mock_GameInstanceLogicAdapter: Partial<GameInstanceLogicAdapter> = {
      addPlayer: vi.fn(),
    };

    const resolvers = createGameInstanceResolvers(mock_GameInstanceLogicAdapter as GameInstanceLogicAdapter);

    // Act
    const input: AddPlayerInputT = { gameInstanceId: 'GI1', publicPlayerInfo: buildTestPublicPlayerInfo() };
    const result = await resolvers.Mutation.addPlayer({}, { input: input});

    // Assert
    expect(mock_GameInstanceLogicAdapter.addPlayer).toHaveBeenCalledWith(input);
    expect(result).toEqual({ status: 'ok' });
  });

  it('startPlaying calls adapter and returns data', async () => {
    // Arrange: mock the adapter
    const mock_GameInstanceLogicAdapter: Partial<GameInstanceLogicAdapter> = {
      startPlaying: vi.fn(),
    };

    const resolvers = createGameInstanceResolvers(mock_GameInstanceLogicAdapter as GameInstanceLogicAdapter);

    // Act
    const input: StartPlayingInputT = { gameInstanceId: 'GI1' };
    const result = await resolvers.Mutation.startPlaying({}, { input: input});

    // Assert
    expect(mock_GameInstanceLogicAdapter.startPlaying).toHaveBeenCalledWith(input);
    expect(result).toEqual({ status: 'ok' });
  });

  it('submitGuess calls adapter and returns data', async () => {
    // Arrange: mock the adapter
    const mock_GameInstanceLogicAdapter: Partial<GameInstanceLogicAdapter> = {
      submitGuess: vi.fn().mockResolvedValue(true),
    };

    const resolvers = createGameInstanceResolvers(mock_GameInstanceLogicAdapter as GameInstanceLogicAdapter);

    // Act
    const input: SubmitGuessInputT = { gameInstanceId: 'GI1', levelIdx: 1, guess: 'World' };
    const result = await resolvers.Mutation.submitGuess({}, { input: input});

    // Assert
    expect(mock_GameInstanceLogicAdapter.submitGuess).toHaveBeenCalledWith(input);
    expect(result).toEqual({ isGuessCorrect: true });
  });
});
