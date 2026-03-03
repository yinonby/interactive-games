
import type { GameInstanceLogicAdapter } from '@ig/games-engine-be-models';
import type {
  CreateGameInstanceInputT, JoinGameByInviteInputT, StartPlayingInputT,
  SubmitGuessInputT
} from '@ig/games-engine-models';
import { createGameInstanceResolvers } from './GameInstanceResolvers';

describe('GameConfigResolvers', () => {
  it('getGameInstanceIdsForGameConfig calls adapter and returns data', async () => {
    // Arrange: mock the adapter
    const mock_GameInstanceLogicAdapter: Partial<GameInstanceLogicAdapter> = {
      getGameInstanceIdsForGameConfig: vi.fn().mockResolvedValue(['GI1']),
    };

    const resolvers = createGameInstanceResolvers(mock_GameInstanceLogicAdapter as GameInstanceLogicAdapter);

    // Act
    const result = await resolvers.Query.getGameInstanceIdsForGameConfig(
      {},
      { gameConfigId: 'GC1' },
      { gameUserId: 'USER1', headers: {} },
    );

    // Assert
    expect(mock_GameInstanceLogicAdapter.getGameInstanceIdsForGameConfig).toHaveBeenCalledWith(
      'USER1',
      { gameConfigId: 'GC1' },
    );
    expect(result).toEqual(['GI1']);
  });

  it('getPublicGameInstance calls adapter and returns data', async () => {
    // Arrange: mock the adapter
    const mock_GameInstanceLogicAdapter: Partial<GameInstanceLogicAdapter> = {
      getPublicGameInstance: vi.fn().mockResolvedValue(null),
    };

    const resolvers = createGameInstanceResolvers(mock_GameInstanceLogicAdapter as GameInstanceLogicAdapter);

    // Act
    const result = await resolvers.Query.getPublicGameInstance(
      {},
      { gameInstanceId: 'GI1' },
      { gameUserId: 'USER1', headers: {} }
    );

    // Assert
    expect(mock_GameInstanceLogicAdapter.getPublicGameInstance).toHaveBeenCalledWith(
      'USER1',
      { gameInstanceId: 'GI1' }
    );
    expect(result).toEqual(null);
  });

  it('createGameInstance calls adapter and returns data', async () => {
    // Arrange: mock the adapter
    const mock_GameInstanceLogicAdapter: Partial<GameInstanceLogicAdapter> = {
      createGameInstance: vi.fn().mockResolvedValue('GI1'),
    };

    const resolvers = createGameInstanceResolvers(mock_GameInstanceLogicAdapter as GameInstanceLogicAdapter);

    // Act
    const input: CreateGameInstanceInputT = { gameConfigId: 'GC1' };
    const result = await resolvers.Mutation.createGameInstance({}, { input }, { gameUserId: 'USER1', headers: {} });

    // Assert
    expect(mock_GameInstanceLogicAdapter.createGameInstance).toHaveBeenCalledWith('USER1', input);
    expect(result).toEqual({ gameInstanceId: 'GI1' });
  });

  it('joinGameByInvite calls adapter and returns data', async () => {
    // Arrange: mock the adapter
    const mock_GameInstanceLogicAdapter: Partial<GameInstanceLogicAdapter> = {
      joinGameByInvite: vi.fn().mockResolvedValue('GI1'),
    };

    const resolvers = createGameInstanceResolvers(mock_GameInstanceLogicAdapter as GameInstanceLogicAdapter);

    // Act
    const input: JoinGameByInviteInputT = { invitationCode: 'GI1' };
    const result = await resolvers.Mutation.joinGameByInvite({}, { input }, { gameUserId: 'USER1', headers: {} });

    // Assert
    expect(mock_GameInstanceLogicAdapter.joinGameByInvite).toHaveBeenCalledWith('USER1', input);
    expect(result).toEqual({ gameInstanceId: 'GI1' });
  });

  it('startPlaying calls adapter and returns data', async () => {
    // Arrange: mock the adapter
    const mock_GameInstanceLogicAdapter: Partial<GameInstanceLogicAdapter> = {
      startPlaying: vi.fn(),
    };

    const resolvers = createGameInstanceResolvers(mock_GameInstanceLogicAdapter as GameInstanceLogicAdapter);

    // Act
    const input: StartPlayingInputT = { gameInstanceId: 'GI1' };
    const result = await resolvers.Mutation.startPlaying({}, { input }, { gameUserId: 'USER1', headers: {} });

    // Assert
    expect(mock_GameInstanceLogicAdapter.startPlaying).toHaveBeenCalledWith('USER1', input);
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
    const result = await resolvers.Mutation.submitGuess({}, { input }, { gameUserId: 'USER1', headers: {} });

    // Assert
    expect(mock_GameInstanceLogicAdapter.submitGuess).toHaveBeenCalledWith('USER1', input);
    expect(result).toEqual({ isGuessCorrect: true });
  });
});
