
import type { GameInstancesTableAdapter } from '@ig/games-engine-be-models';
import type { AddPlayerInputT, GameConfigT, PublicGameInstanceT, StartPlayingInputT, SubmitGuessInputT } from '@ig/games-engine-models';
import { buildGameConfigMock, buildPublicGameInstanceMock, buildTestPublicPlayerInfo } from '@ig/games-engine-models/test-utils';
import { GameInstanceLogic } from './GameInstanceLogic';

describe('GameInstanceLogic', () => {
  let logic: GameInstanceLogic;
  let mock_GameInstancesTableAdapter: GameInstancesTableAdapter;
  const mock_getGameConfigInstanceIds = vi.fn();
  const mock_getPublicGameInstance = vi.fn();
  const mock_addPlayer = vi.fn();
  const mock_startPlaying = vi.fn();
  const mock_submitGuess = vi.fn();

  beforeEach(() => {
    // Create a fresh mock before each test
    mock_GameInstancesTableAdapter = {
      getGameConfigInstanceIds: mock_getGameConfigInstanceIds,
      getPublicGameInstance: mock_getPublicGameInstance,
      addPlayer: mock_addPlayer,
      startPlaying: mock_startPlaying,
      submitGuess: mock_submitGuess,
    };

    logic = new GameInstanceLogic(mock_GameInstancesTableAdapter);
  });

  it('getGameConfigInstanceIds calls table adapter and returns data', async () => {
    const mockGameConfigs: GameConfigT[] = [
      buildGameConfigMock({}),
    ];

    mock_getGameConfigInstanceIds.mockResolvedValue(mockGameConfigs);

    const result = await logic.getGameConfigInstanceIds('GC1');

    expect(mock_getGameConfigInstanceIds).toHaveBeenCalledWith('GC1');
    expect(result).toEqual(mockGameConfigs);
  });

  it('getPublicGameInstance calls table adapter and returns data', async () => {
    const publicGameInstance: PublicGameInstanceT = buildPublicGameInstanceMock();

    mock_getPublicGameInstance.mockResolvedValue(publicGameInstance);

    const result = await logic.getPublicGameInstance('GI1');

    expect(mock_getPublicGameInstance).toHaveBeenCalledWith('GI1');
    expect(result).toEqual(publicGameInstance);
  });

  it('addPlayer calls table adapter and returns data', async () => {
    const mockGameConfigs: GameConfigT[] = [
      buildGameConfigMock({}),
    ];

    mock_addPlayer.mockResolvedValue(mockGameConfigs);
    const publicPlayerInfo = buildTestPublicPlayerInfo();

    const input: AddPlayerInputT = { gameInstanceId: 'GC1', publicPlayerInfo };
    const result = await logic.addPlayer(input);

    expect(mock_addPlayer).toHaveBeenCalledWith(input.gameInstanceId, input.publicPlayerInfo);
    expect(result).toEqual(mockGameConfigs);
  });

  it('startPlaying calls table adapter and returns data', async () => {
    const mockGameConfigs: GameConfigT[] = [
      buildGameConfigMock({}),
    ];

    mock_startPlaying.mockResolvedValue(mockGameConfigs);

    const input: StartPlayingInputT = { gameInstanceId: 'GC1' };
    const result = await logic.startPlaying(input);

    expect(mock_startPlaying).toHaveBeenCalledWith(input.gameInstanceId);
    expect(result).toEqual(mockGameConfigs);
  });

  it('submitGuess calls table adapter and returns data', async () => {
    const mockGameConfigs: GameConfigT[] = [
      buildGameConfigMock({}),
    ];

    mock_submitGuess.mockResolvedValue(mockGameConfigs);

    const input: SubmitGuessInputT = { gameInstanceId: 'GC1', levelIdx: 1, guess: 'World' };
    const result = await logic.submitGuess(input);

    expect(mock_submitGuess).toHaveBeenCalledWith(input.gameInstanceId, input.levelIdx, input.guess);
    expect(result).toEqual(mockGameConfigs);
  });
});
