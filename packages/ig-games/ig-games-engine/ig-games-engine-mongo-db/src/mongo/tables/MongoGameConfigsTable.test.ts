
import type { GameInfoT } from '@ig/games-engine-models';
import { buildFullTestGameInfo } from '@ig/games-engine-models/test-utils';
import type { LoggerAdapter } from '@ig/utils';
import { MongoGameConfigsTable } from './MongoGameConfigsTable';

describe('MongoGameConfigsTable', () => {
  describe('constructor', () => {
    it('should create instance with defaults', () => {
      const instance = new MongoGameConfigsTable();
      expect(instance).toBeDefined();
    });

    it('should create instance without defaults', () => {
      const mockLogger: LoggerAdapter = { info: vi.fn() } as unknown as LoggerAdapter;
      const instance = new MongoGameConfigsTable(true, 'prefix_', mockLogger);
      expect(instance).toBeDefined();
    });
  });

  describe('getTableName', () => {
    it('should return GameConfigs', () => {
      const instance = new MongoGameConfigsTable();
      expect(instance.getTableName()).toBe('GameConfigs');
    });
  });

  describe('getGameConfigs', () => {
    it('should return array of game configs', async () => {
      const mockGameInfo1: GameInfoT = buildFullTestGameInfo({
        gameName: 'g1',
      });
      const mockGameInfo2: GameInfoT = buildFullTestGameInfo({
        gameName: 'g2',
      });
      const instance = new MongoGameConfigsTable();

      const res1 = await instance.getGameConfigs();
      expect(res1).toHaveLength(0);

      await instance.createGameConfig('GCID1', mockGameInfo1);
      await instance.createGameConfig('GCID2', mockGameInfo2);

      const res2 = await instance.getGameConfigs();
      expect(res2).toHaveLength(2);
    });
  });

  describe('getGameConfig', () => {
    it('should return array of game configs', async () => {
      const mockGameInfo1: GameInfoT = buildFullTestGameInfo({
        gameName: 'g1',
      });
      const instance = new MongoGameConfigsTable();

      const res1 = await instance.getGameConfig('GCID1');
      expect(res1).toBeNull();

      await instance.createGameConfig('GCID1', mockGameInfo1);

      const res2 = await instance.getGameConfig('GCID1');
      expect(res2).not.toBeNull();
    });
  });

  describe('createGameConfig', () => {
    it('should insert game config', async () => {
      const mockGameInfo1: GameInfoT = buildFullTestGameInfo();
      const instance = new MongoGameConfigsTable();

      const res1 = await instance.getGameConfigs();
      expect(res1).toHaveLength(0);

      await instance.createGameConfig('GCID1', mockGameInfo1);

      const res2 = await instance.getGameConfigs();
      expect(res2).toHaveLength(1);
    });

    it('should fail to insert game config with an existing unique key', async () => {
      const mockGameInfo1: GameInfoT = buildFullTestGameInfo();
      const instance = new MongoGameConfigsTable();

      const res1 = await instance.getGameConfigs();
      expect(res1).toHaveLength(0);

      await instance.createGameConfig('GCID1', mockGameInfo1);
      await expect(instance.createGameConfig('GCID1', mockGameInfo1)).rejects.toThrow();

      const res2 = await instance.getGameConfigs();
      expect(res2).toHaveLength(1);
    });
  });

  describe('updateGameConfig', () => {
    it('should update game config', async () => {
      const mockGameInfo1: GameInfoT = buildFullTestGameInfo({
        gameName: 'g1',
      });
      const instance = new MongoGameConfigsTable();

      await instance.createGameConfig('GCID1', mockGameInfo1);

      const res1 = await instance.getGameConfig('GCID1');
      assert(res1 !== null);
      expect(res1.gameInfoNoId.gameName).toEqual('g1');

      await instance.updateGameConfig('GCID1', {
        gameName: 'g1-updated',
      });

      const res2 = await instance.getGameConfig('GCID1');
      assert(res2 !== null);
      expect(res2.gameInfoNoId.gameName).toEqual('g1-updated');
    });

    it('should fail to update game config when it does not exist', async () => {
      const instance = new MongoGameConfigsTable();

      await expect(instance.updateGameConfig('GCID1', {})).rejects.toThrow();
    });
  });
});
