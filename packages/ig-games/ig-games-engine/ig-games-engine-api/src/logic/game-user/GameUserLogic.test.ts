
import type { GameUserTableAdapter } from '@ig/games-engine-be-models';
import type { AddGameConfigIdInputT, GameUserT } from '@ig/games-engine-models';
import { buildGameUserMock } from '@ig/games-engine-models/test-utils';
import { GameUserLogic } from './GameUserLogic';

describe('GameUserLogic', () => {
  let mockTableAdapter: GameUserTableAdapter;
  let logic: GameUserLogic;
  const mock_getGameUser = vi.fn();
  const mock_createGameUser = vi.fn();
  const mock_addGameConfigId = vi.fn();

  beforeEach(() => {
    // Create a fresh mock before each test
    mockTableAdapter = {
      getGameUser: mock_getGameUser,
      createGameUser: mock_createGameUser,
      addGameConfigId: mock_addGameConfigId,
    };

    logic = new GameUserLogic(mockTableAdapter);
  });

  it('getGameUser calls table adapter and returns data', async () => {
    const gameUser: GameUserT = buildGameUserMock({});

    mock_getGameUser.mockResolvedValue(gameUser);

    const result = await logic.getGameUser('USER1');

    expect(mock_getGameUser).toHaveBeenCalledWith('USER1');
    expect(result).toEqual(gameUser);
  });

  it('getPublicGameUser calls table adapter with correct argument', async () => {
    const gameUser: GameUserT = buildGameUserMock({});

    mock_getGameUser.mockResolvedValue(gameUser);

    const result = await logic.getPublicGameUser('USER1');

    expect(mock_getGameUser).toHaveBeenCalledWith('USER1');
    expect(result).toEqual(gameUser);
  });

  it('getPublicGameUser creates new user when not exist', async () => {
    mock_getGameUser.mockResolvedValue(null);

    const result = await logic.getPublicGameUser('USER1');

    expect(mock_getGameUser).toHaveBeenCalledWith('USER1');
    expect(mock_createGameUser).toHaveBeenCalledWith(expect.objectContaining({ gameUserId: 'USER1' }));
    expect(result).toEqual(expect.objectContaining({ gameUserId: 'USER1' }));
  });

  it('createGameUser calls table adapter with correct argument', async () => {
    await logic.createGameUser('USER1');

    expect(mock_createGameUser).toHaveBeenCalledWith(expect.objectContaining({ gameUserId: 'USER1' }));
  });

  it('addGameConfigId calls table adapter with correct argument', async () => {
    const input: AddGameConfigIdInputT = {
      gameConfigId: 'GC1',
    }

    const result = await logic.addGameConfigId('USER1', input);

    expect(mock_addGameConfigId).toHaveBeenCalledWith('USER1', 'GC1');
    expect(result).toEqual({ gameUserId: 'USER1' });
  });
});
