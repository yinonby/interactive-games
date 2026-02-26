
import type { GameConfigsTableAdapter } from '@ig/games-engine-be-models';
import type { GameConfigNoIdT, GameConfigT, UpdateGameConfigInputT } from '@ig/games-engine-models';
import { buildGameConfigMock, buildGameConfigNoIdMock } from '@ig/games-engine-models/test-utils';
import { GameConfigLogic } from './GameConfigLogic';

describe('GameConfigLogic', () => {
  let mockTableAdapter: GameConfigsTableAdapter;
  let logic: GameConfigLogic;
  const getGameConfigsMock = vi.fn();
  const getGameConfigMock = vi.fn();
  const createGameConfigMock = vi.fn();
  const updateGameConfigMock = vi.fn();

  beforeEach(() => {
    // Create a fresh mock before each test
    mockTableAdapter = {
      getGameConfigs: getGameConfigsMock,
      getGameConfig: getGameConfigMock,
      createGameConfig: createGameConfigMock,
      updateGameConfig: updateGameConfigMock,
    };

    logic = new GameConfigLogic(mockTableAdapter);
  });

  it('getGameConfigs calls table adapter and returns data', async () => {
    const mockGameConfigs: GameConfigT[] = [
      buildGameConfigMock({}),
    ];

    getGameConfigsMock.mockResolvedValue(mockGameConfigs);

    const result = await logic.getGameConfigs();

    expect(mockTableAdapter.getGameConfigs).toHaveBeenCalled();
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

    getGameConfigMock.mockResolvedValue(mockGameConfig);

    const result = await logic.getGameConfig('GCID1');

    expect(mockTableAdapter.getGameConfig).toHaveBeenCalled();
    expect(result).toEqual(mockGameConfig);
  });

  it('getGameConfig returns null when there is no game config', async () => {
    getGameConfigMock.mockResolvedValue(null);

    const result = await logic.getGameConfig('GCID1');

    expect(mockTableAdapter.getGameConfig).toHaveBeenCalled();
    expect(result).toEqual(null);
  });

  it('createGameConfig calls table adapter with correct argument', async () => {
    const newGameConfigNoId: GameConfigNoIdT = buildGameConfigNoIdMock();

    await logic.createGameConfig('GCID1', newGameConfigNoId);

    expect(mockTableAdapter.createGameConfig).toHaveBeenCalledWith('GCID1', newGameConfigNoId);
  });

  it('updateGameConfig calls table adapter with correct argument', async () => {
    const partialGameConfigNoId: GameConfigNoIdT = buildGameConfigMock({});
    const input: UpdateGameConfigInputT = {
      gameConfigId: 'GCID1',
      partialGameConfigNoId,
    }

    const result = await logic.updateGameConfig(input);

    expect(mockTableAdapter.updateGameConfig).toHaveBeenCalledWith('GCID1', partialGameConfigNoId);
    expect(result).toEqual({ status: 'ok' });
  });
});
