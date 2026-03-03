
import type { GameConfigsTableAdapter } from '@ig/games-engine-be-models';
import type { GameConfigNoIdT, GameConfigT, UpdateGameConfigInputT } from '@ig/games-engine-models';
import { buildGameConfigMock, buildGameConfigNoIdMock } from '@ig/games-engine-models/test-utils';
import { GameConfigLogic } from './GameConfigLogic';

describe('GameConfigLogic', () => {
  let mockTableAdapter: GameConfigsTableAdapter;
  let logic: GameConfigLogic;
  const mock_getGameConfigs = vi.fn();
  const mock_getGameConfig = vi.fn();
  const mock_createGameConfig = vi.fn();
  const mock_updateGameConfig = vi.fn();

  beforeEach(() => {
    // Create a fresh mock before each test
    mockTableAdapter = {
      getGameConfigs: mock_getGameConfigs,
      getGameConfig: mock_getGameConfig,
      createGameConfig: mock_createGameConfig,
      updateGameConfig: mock_updateGameConfig,
    };

    logic = new GameConfigLogic(mockTableAdapter);
  });

  it('getGameConfigs calls table adapter and returns data', async () => {
    const mockGameConfigs: GameConfigT[] = [
      buildGameConfigMock({}),
    ];

    mock_getGameConfigs.mockResolvedValue(mockGameConfigs);

    const result = await logic.getGameConfigs();

    expect(mock_getGameConfigs).toHaveBeenCalled();
    expect(result).toEqual(mockGameConfigs);
  });

  it('getPublicGameConfigs calls table adapter and returns data', async () => {
    const mockGameConfigs: GameConfigT[] = [
      buildGameConfigMock({}),
    ];

    mock_getGameConfigs.mockResolvedValue(mockGameConfigs);

    const result = await logic.getPublicGameConfigs();

    expect(mock_getGameConfigs).toHaveBeenCalled();
    expect(result).toEqual(mockGameConfigs);
  });

  it('getGameConfig calls table adapter and returns data', async () => {
    const gameConfigNoId = buildGameConfigNoIdMock({
      gameName: 'g1',
    });
    const mockGameConfig: GameConfigT = buildGameConfigMock({
      gameConfigId: 'GCID1',
      ...gameConfigNoId,
    });

    mock_getGameConfig.mockResolvedValue(mockGameConfig);

    const result = await logic.getGameConfig('GCID1');

    expect(mock_getGameConfig).toHaveBeenCalled();
    expect(result).toEqual(mockGameConfig);
  });

  it('getGameConfig returns throws when there is no game config', async () => {
    mock_getGameConfig.mockResolvedValue(null);

    await expect(logic.getGameConfig('GCID1')).rejects.toThrow();

    expect(mock_getGameConfig).toHaveBeenCalled();
  });

  it('getPublicGameConfig calls table adapter and returns data', async () => {
    const gameConfigNoId = buildGameConfigNoIdMock({
      gameName: 'g1',
    });
    const mockGameConfig: GameConfigT = buildGameConfigMock({
      gameConfigId: 'GCID1',
      ...gameConfigNoId,
    });

    mock_getGameConfig.mockResolvedValue(mockGameConfig);

    const result = await logic.getPublicGameConfig('GCID1');

    expect(mock_getGameConfig).toHaveBeenCalled();
    expect(result).toEqual(mockGameConfig);
  });

  it('getPublicGameConfig returns throws when there is no game config', async () => {
    mock_getGameConfig.mockResolvedValue(null);

    await expect(logic.getPublicGameConfig('GCID1')).rejects.toThrow();

    expect(mock_getGameConfig).toHaveBeenCalled();
  });

  it('createGameConfig calls table adapter with correct argument', async () => {
    const newGameConfigNoId: GameConfigNoIdT = buildGameConfigNoIdMock();

    await logic.createGameConfig('GCID1', newGameConfigNoId);

    expect(mock_createGameConfig).toHaveBeenCalledWith('GCID1', newGameConfigNoId);
  });

  it('updateGameConfig calls table adapter with correct argument', async () => {
    const partialGameConfigNoId: GameConfigNoIdT = buildGameConfigMock({});
    const input: UpdateGameConfigInputT = {
      gameConfigId: 'GCID1',
      partialGameConfigNoId,
    }

    const result = await logic.updateGameConfig(input);

    expect(mock_updateGameConfig).toHaveBeenCalledWith('GCID1', partialGameConfigNoId);
    expect(result).toEqual({ status: 'ok' });
  });
});
