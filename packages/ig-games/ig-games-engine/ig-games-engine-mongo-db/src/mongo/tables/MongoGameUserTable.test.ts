
import type { GameUserT } from '@ig/games-engine-models';
import {
  buildGameUserMock
} from '@ig/games-engine-models/test-utils';
import type { LoggerAdapter } from '@ig/utils';
import { MongoGameUserTable } from './MongoGameUserTable';

describe('MongoGameUserTable', () => {
  describe('constructor', () => {
    it('should create instance with defaults', () => {
      const instance = new MongoGameUserTable();
      expect(instance).toBeDefined();
    });

    it('should create instance without defaults', () => {
      const mockLogger: LoggerAdapter = { info: vi.fn() } as unknown as LoggerAdapter;
      const instance = new MongoGameUserTable(true, 'prefix_', mockLogger);
      expect(instance).toBeDefined();
    });
  });

  describe('getTableName', () => {
    it('should return GameUsers', () => {
      const instance = new MongoGameUserTable();
      expect(instance.getTableName()).toBe('GameUsers');
    });
  });

  describe('getGameUsers,createGameUser', () => {
    it('should succeed', async () => {
      const gameUser1: GameUserT = buildGameUserMock({ gameUserId: 'USER1' });
      const gameUser2: GameUserT = buildGameUserMock({ gameUserId: 'USER2' });
      const instance = new MongoGameUserTable();

      const res1 = await instance.getGameUsers();
      expect(res1).toHaveLength(0);

      await instance.createGameUser(gameUser1);
      await instance.createGameUser(gameUser2);

      const res2 = await instance.getGameUsers();
      expect(res2).toHaveLength(2);
    });
  });

  describe('getGameUser', () => {
    it('should succeed', async () => {
      const gameUser1: GameUserT = buildGameUserMock({
        gameUserId: 'USER1',
      });
      const instance = new MongoGameUserTable();

      const res1 = await instance.getGameUser('USER1');
      expect(res1).toEqual(null);

      await instance.createGameUser(gameUser1);

      const res2 = await instance.getGameUser('USER1');
      expect(res2).toEqual(expect.objectContaining({ gameUserId: 'USER1' }));
    });
  });

  describe('addGameConfigId', () => {
    it('should succeed', async () => {
      const gameUser1: GameUserT = buildGameUserMock({
        gameUserId: 'USER1',
      });
      const instance = new MongoGameUserTable();

      await instance.createGameUser(gameUser1);

      const res1 = await instance.getGameUser('USER1');
      expect(res1?.joinedGameConfigIds).toHaveLength(0);

      await instance.addGameConfigId('USER1', 'GC1');

      const res2 = await instance.getGameUser('USER1');
      expect(res2?.joinedGameConfigIds).toHaveLength(1);
    });
  });
});
