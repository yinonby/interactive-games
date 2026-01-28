
import type { GameConfigT } from '@ig/games-models';
import { buildFullTestGameConfig } from '@ig/games-models/test-utils';
import type { LoggerAdapter } from '@ig/lib';
import { MongoGameConfigsTable } from './MongoGameConfigsTable';

describe('MongoGameConfigsTable', () => {
  describe('constructor', () => {
    it('should create instance with defaults', () => {
      const instance = new MongoGameConfigsTable();
      expect(instance).toBeDefined();
    });

    it('should create instance without defaults', () => {
      const mockLogger: LoggerAdapter = { log: vi.fn() } as unknown as LoggerAdapter;
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
      const mockConfig1: GameConfigT = buildFullTestGameConfig({
        gameConfigId: 'gcid1',
        gameName: 'g1',
      });
      const mockConfig2: GameConfigT = buildFullTestGameConfig({
        gameConfigId: 'gcid2',
        gameName: 'g2',
      });
      const instance = new MongoGameConfigsTable();

      const res1 = await instance.getGameConfigs();
      expect(res1).toHaveLength(0);

      await instance.createGameConfig(mockConfig1);
      await instance.createGameConfig(mockConfig2);

      const res2 = await instance.getGameConfigs();
      expect(res2).toHaveLength(2);
    });
  });

  describe('getGameConfig', () => {
    it('should return array of game configs', async () => {
      const mockConfig1: GameConfigT = buildFullTestGameConfig({
        gameConfigId: 'gcid1',
        gameName: 'g1',
      });
      const instance = new MongoGameConfigsTable();

      const res1 = await instance.getGameConfig('gcid1');
      expect(res1).toBeNull();

      await instance.createGameConfig(mockConfig1);

      const res2 = await instance.getGameConfig('gcid1');
      expect(res2).not.toBeNull();
    });
  });

  describe('createGameConfig', () => {
    it('should insert game config', async () => {
      const mockConfig: GameConfigT = buildFullTestGameConfig({});
      const instance = new MongoGameConfigsTable();

      const res1 = await instance.getGameConfigs();
      expect(res1).toHaveLength(0);

      await instance.createGameConfig(mockConfig);

      const res2 = await instance.getGameConfigs();
      expect(res2).toHaveLength(1);
    });

    it('should fail to insert game config with an existing unique key', async () => {
      const mockConfig: GameConfigT = buildFullTestGameConfig({});
      const instance = new MongoGameConfigsTable();

      const res1 = await instance.getGameConfigs();
      expect(res1).toHaveLength(0);

      await instance.createGameConfig(mockConfig);
      await expect(instance.createGameConfig(mockConfig)).rejects.toThrow();

      const res2 = await instance.getGameConfigs();
      expect(res2).toHaveLength(1);
    });
  });

  describe('updateGameConfig', () => {
    it('should update game config', async () => {
      const mockConfig1: GameConfigT = buildFullTestGameConfig({
        gameConfigId: 'gcid1',
        gameName: 'g1',
      });
      const instance = new MongoGameConfigsTable();

      await instance.createGameConfig(mockConfig1);

      const res1 = await instance.getGameConfig('gcid1');
      assert(res1 !== null);
      expect(res1.gameName).toEqual('g1');

      await instance.updateGameConfig({
        gameConfigId: 'gcid1',
        gameName: 'g1-updated',
      });

      const res2 = await instance.getGameConfig('gcid1');
      assert(res2 !== null);
      expect(res2.gameName).toEqual('g1-updated');
    });

    it('should fail to update game config when it does not exist', async () => {
      const instance = new MongoGameConfigsTable();

      await expect(instance.updateGameConfig({ gameConfigId: 'gcid1' })).rejects.toThrow();
    });
  });
});
