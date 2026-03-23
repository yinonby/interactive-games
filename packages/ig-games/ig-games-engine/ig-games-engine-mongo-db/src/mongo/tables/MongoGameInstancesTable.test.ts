
import type { GameInstanceT } from '@ig/games-engine-models';
import { buildGameInstanceMock, buildGameStateMock, buildLevelStateMock, buildPublicGameConfigMock, buildTestPublicPlayerInfo } from '@ig/games-engine-models/test-utils';
import type { LoggerAdapter } from '@ig/utils';
import { MongoGameInstancesTable } from './MongoGameInstancesTable';

describe('MongoGameInstancesTable', () => {
  describe('constructor', () => {
    it('should create instance with defaults', () => {
      const instance = new MongoGameInstancesTable();
      expect(instance).toBeDefined();
    });

    it('should create instance without defaults', () => {
      const mockLogger: LoggerAdapter = { info: vi.fn() } as unknown as LoggerAdapter;
      const instance = new MongoGameInstancesTable(true, 'prefix_', mockLogger);
      expect(instance).toBeDefined();
    });
  });

  describe('getTableName', () => {
    it('should return GameInstances', () => {
      const instance = new MongoGameInstancesTable();
      expect(instance.getTableName()).toBe('GameInstances');
    });
  });

  describe('getGameInstances,createGameInstance', () => {
    it('should succeed', async () => {
      const gameInstance1: GameInstanceT = buildGameInstanceMock({ gameInstanceId: 'GI1' });
      const gameInstance2: GameInstanceT = buildGameInstanceMock({ gameInstanceId: 'GI2' });
      const instance = new MongoGameInstancesTable();

      const res1 = await instance.getGameInstances();
      expect(res1).toHaveLength(0);

      await instance.createGameInstance(gameInstance1);
      await instance.createGameInstance(gameInstance2);

      const res2 = await instance.getGameInstances();
      expect(res2).toHaveLength(2);
    });
  });

  describe('getGameInstanceIdsForGameConfig', () => {
    it('should succeed', async () => {
      const gameInstance1: GameInstanceT = buildGameInstanceMock({
        publicGameConfig: buildPublicGameConfigMock({
          gameConfigId: 'GC1',
        })
      });
      const instance = new MongoGameInstancesTable();

      const res1 = await instance.getGameInstances();
      expect(res1).toHaveLength(0);

      await instance.createGameInstance(gameInstance1);

      const res2 = await instance.getGameInstances();
      expect(res2).toHaveLength(1);

      const gameInstanceIds1 = await instance.getGameInstanceIdsForGameConfig('GC1');
      expect(gameInstanceIds1).toHaveLength(1);

      const gameInstanceIds2 = await instance.getGameInstanceIdsForGameConfig('GC2');
      expect(gameInstanceIds2).toHaveLength(0);
    });
  });

  describe('getGameInstance', () => {
    it('should succeed', async () => {
      const gameInstance1: GameInstanceT = buildGameInstanceMock({
        gameInstanceId: 'GI1',
      });
      const instance = new MongoGameInstancesTable();

      const res1 = await instance.getGameInstance('GI1');
      expect(res1).toEqual(null);

      await instance.createGameInstance(gameInstance1);

      const res2 = await instance.getGameInstance('GI1');
      expect(res2).toEqual(expect.objectContaining({ gameInstanceId: 'GI1' }));
    });
  });

  describe('getPublicGameInstance', () => {
    it('should succeed', async () => {
      const gameInstance1: GameInstanceT = buildGameInstanceMock({
        gameInstanceId: 'GI1',
      });
      const instance = new MongoGameInstancesTable();

      const res1 = await instance.getPublicGameInstance('GI1');
      expect(res1).toEqual(null);

      await instance.createGameInstance(gameInstance1);

      const res2 = await instance.getPublicGameInstance('GI1');
      expect(res2).toEqual(expect.objectContaining({ gameInstanceId: 'GI1' }));
    });
  });

  describe('getGameInstanceByInvitationCode', () => {
    it('should succeed', async () => {
      const gameInstance1: GameInstanceT = buildGameInstanceMock({
        invitationCode: 'INVT1',
      });
      const instance = new MongoGameInstancesTable();

      const res1 = await instance.getGameInstanceByInvitationCode('INVT1');
      expect(res1).toEqual(expect.objectContaining(null));

      await instance.createGameInstance(gameInstance1);

      const res2 = await instance.getGameInstanceByInvitationCode('INVT1');
      expect(res2).toEqual(expect.objectContaining({ invitationCode: 'INVT1' }));
    });
  });

  describe('addPlayer', () => {
    it('should succeed', async () => {
      const gameInstance1: GameInstanceT = buildGameInstanceMock({
        gameInstanceId: 'GI1',
      });
      const instance = new MongoGameInstancesTable();

      await instance.createGameInstance(gameInstance1);

      const res1 = await instance.getPublicGameInstance('GI1');
      expect(res1?.publicPlayerInfos).toHaveLength(0);

      await instance.addPlayer('GI1', buildTestPublicPlayerInfo());

      const res2 = await instance.getPublicGameInstance('GI1');
      expect(res2?.publicPlayerInfos).toHaveLength(1);
    });
  });

  describe('startPlaying', () => {
    it('should succeed', async () => {
      const gameInstance1: GameInstanceT = buildGameInstanceMock({
        gameInstanceId: 'GI1',
        gameState: buildGameStateMock({
          gameStatus: 'notStarted',
          levelStates: [buildLevelStateMock({
            levelStatus: 'notStarted',
          })],
        })
      });
      const instance = new MongoGameInstancesTable();

      await instance.createGameInstance(gameInstance1);

      const res1 = await instance.getPublicGameInstance('GI1');
      expect(res1?.gameState.gameStatus).toEqual('notStarted');

      await instance.startPlaying('GI1');

      const res2 = await instance.getPublicGameInstance('GI1');
      expect(res2?.gameState.gameStatus).toEqual('inProcess');
      expect(res2?.gameState.levelStates[0].levelStatus).toEqual('levelInProcess');
    });
  });

  describe('updateLevelState', () => {
    it('should succeed', async () => {
      const gameInstance1: GameInstanceT = buildGameInstanceMock({
        gameInstanceId: 'GI1',
        gameState: buildGameStateMock({
          gameStatus: 'notStarted',
          levelStates:[
            buildLevelStateMock({ levelStatus: 'notStarted' }),
            buildLevelStateMock({ levelStatus: 'notStarted' }),
          ]
        }),
      });
      const instance = new MongoGameInstancesTable();

      await instance.createGameInstance(gameInstance1);

      const res1 = await instance.getPublicGameInstance('GI1');
      expect(res1?.gameState.levelStates).toHaveLength(2);
      expect(res1?.gameState.levelStates[0].levelStatus).toEqual('notStarted');
      expect(res1?.gameState.levelStates[1].levelStatus).toEqual('notStarted');

      await instance.updateLevelState('GI1', 1, buildLevelStateMock({ levelStatus: 'failed' }));

      const res2 = await instance.getPublicGameInstance('GI1');
      expect(res2?.gameState.levelStates).toHaveLength(2);
      expect(res2?.gameState.levelStates[0].levelStatus).toEqual('notStarted');
      expect(res2?.gameState.levelStates[1].levelStatus).toEqual('failed');
    });
  });
});
