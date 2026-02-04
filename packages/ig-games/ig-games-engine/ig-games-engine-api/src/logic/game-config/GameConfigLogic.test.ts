
import type { GameConfigsTableAdapter } from '@ig/games-engine-be-models';
import type { GameConfigT } from '@ig/games-engine-models';
import { buildFullTestGameConfig } from '@ig/games-engine-models/test-utils';
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
    const mockData: GameConfigT[] = [
      buildFullTestGameConfig({}),
    ];

    getGameConfigsMock.mockResolvedValue(mockData);

    const result = await logic.getGameConfigs();

    expect(mockTableAdapter.getGameConfigs).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  it('getGameConfig calls table adapter and returns data', async () => {
    const mockData: GameConfigT[] = [
      buildFullTestGameConfig({
        gameConfigId: 'gcid1'
      }),
    ];

    getGameConfigMock.mockResolvedValue(mockData);

    const result = await logic.getGameConfig('gcid1');

    expect(mockTableAdapter.getGameConfig).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  it('createGameConfig calls table adapter with correct argument', async () => {
    const newConfig: GameConfigT = buildFullTestGameConfig({});

    await logic.createGameConfig(newConfig);

    expect(mockTableAdapter.createGameConfig).toHaveBeenCalledWith(newConfig);
  });

  it('updateGameConfig calls table adapter with correct argument', async () => {
    const gameConfig: GameConfigT = buildFullTestGameConfig({});

    const result = await logic.updateGameConfig(gameConfig);

    expect(mockTableAdapter.updateGameConfig).toHaveBeenCalledWith(gameConfig);
    expect(result).toEqual({ status: 'ok' });
  });
});
