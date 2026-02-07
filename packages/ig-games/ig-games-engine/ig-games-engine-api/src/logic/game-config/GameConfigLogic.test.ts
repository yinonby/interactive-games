
import type { GameConfigsTableAdapter } from '@ig/games-engine-be-models';
import type { GameConfigT, GameInfoNoIdT, UpdateGameConfigInputT } from '@ig/games-engine-models';
import { buildFullTestGameConfig, buildFullTestGameInfoNoId, buildTestGameInfoNoId } from '@ig/games-engine-models/test-utils';
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
      buildFullTestGameConfig({}),
    ];

    getGameConfigsMock.mockResolvedValue(mockGameConfigs);

    const result = await logic.getGameConfigs();

    expect(mockTableAdapter.getGameConfigs).toHaveBeenCalled();
    expect(result).toEqual(mockGameConfigs);
  });

  it('getGameConfig calls table adapter and returns data', async () => {
    const gameInfoNoId = buildFullTestGameInfoNoId({
      gameName: 'g1',
    });
    const mockGameConfig: GameConfigT = buildFullTestGameConfig({
      gameConfigId: 'GCID1',
      gameInfoNoId: gameInfoNoId,
    });

    getGameConfigMock.mockResolvedValue(mockGameConfig);

    const result = await logic.getGameConfig('GCID1');

    expect(mockTableAdapter.getGameConfig).toHaveBeenCalled();
    expect(result).toEqual(mockGameConfig);
  });

  it('getGameInfos calls table adapter and returns data', async () => {
    const mockGameConfigs: GameConfigT[] = [
      buildFullTestGameConfig({}),
    ];

    getGameConfigsMock.mockResolvedValue(mockGameConfigs);

    const result = await logic.getGameInfos();

    expect(mockTableAdapter.getGameConfigs).toHaveBeenCalled();
    expect(result).toEqual(mockGameConfigs.map(e => ({
      gameConfigId: e.gameConfigId,
      ...e.gameInfoNoId,
    })));
  });

  it('getGameInfo calls table adapter and returns data', async () => {
    const gameInfoNoId = buildFullTestGameInfoNoId({
      gameName: 'g1',
    });
    const mockGameConfig: GameConfigT = buildFullTestGameConfig({
      gameConfigId: 'GCID1',
      gameInfoNoId: gameInfoNoId,
    });

    getGameConfigMock.mockResolvedValue(mockGameConfig);

    const result = await logic.getGameInfo('GCID1');

    expect(mockTableAdapter.getGameConfig).toHaveBeenCalled();
    expect(result).toEqual({
      gameConfigId: 'GCID1',
      ...gameInfoNoId,
    });
  });

  it('getGameInfo returns null when there is no game config', async () => {
    getGameConfigMock.mockResolvedValue(null);

    const result = await logic.getGameInfo('GCID1');

    expect(mockTableAdapter.getGameConfig).toHaveBeenCalled();
    expect(result).toEqual(null);
  });

  it('createGameConfig calls table adapter with correct argument', async () => {
    const newGameInfoNoId: GameInfoNoIdT = buildFullTestGameInfoNoId();

    await logic.createGameConfig('GCID1', newGameInfoNoId);

    expect(mockTableAdapter.createGameConfig).toHaveBeenCalledWith('GCID1', newGameInfoNoId);
  });

  it('updateGameConfig calls table adapter with correct argument', async () => {
    const partialGameInfoNoId: GameInfoNoIdT = buildTestGameInfoNoId({});
    const input: UpdateGameConfigInputT = {
      gameConfigId: 'GCID1',
      ...partialGameInfoNoId,
    }

    const result = await logic.updateGameConfig(input);

    expect(mockTableAdapter.updateGameConfig).toHaveBeenCalledWith('GCID1', partialGameInfoNoId);
    expect(result).toEqual({ status: 'ok' });
  });
});
