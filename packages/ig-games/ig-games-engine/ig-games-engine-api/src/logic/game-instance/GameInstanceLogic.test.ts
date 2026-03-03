
import type {
  GameConfigsTableAdapter, GameInstancesTableAdapter,
  GamesUserAdapter
} from '@ig/games-engine-be-models';
import type {
  CreateGameInstanceInputT,
  JoinGameByInviteInputT,
  PublicGameInstanceT, StartPlayingInputT, SubmitGuessInputT
} from '@ig/games-engine-models';
import {
  buildCodeLevelStateMock, buildGameConfigMock, buildGameStateMock,
  buildLevelStateMock, buildPublicGameInstanceMock, buildPublicLevelConfig, buildWordleLevelStateMock
} from '@ig/games-engine-models/test-utils';
import * as GamesWordleBeLogic from '@ig/games-wordle-be-logic';
import type { WordleAdapter } from '@ig/games-wordle-be-models';
import * as CodePuzzleLogicModule from './CodePuzzleLogic';
import { GameInstanceLogic } from './GameInstanceLogic';

describe('GameInstanceLogic', () => {
  let logic: GameInstanceLogic;

  let mock_GameInstancesTableAdapter: GameInstancesTableAdapter;
  const mock_getGameInstanceIdsForGameConfig = vi.fn();
  const mock_getGameInstance = vi.fn();
  const mock_getPublicGameInstance = vi.fn();
  const mock_getGameInstanceByInvitationCode = vi.fn();
  const mock_createGameInstance = vi.fn();
  const mock_addPlayer = vi.fn();
  const mock_startPlaying = vi.fn();
  const mock_updateLevelState = vi.fn();

  let mock_GameConfigsTableAdapter: GameConfigsTableAdapter;
  const mock_getGameConfig = vi.fn();

  let mock_gamesPlayerInfoAdapter: GamesUserAdapter;
  const mock_retrievePlayerInfo = vi.fn();

  const spy_analyzeCodePuzzleGuess = vi.spyOn(CodePuzzleLogicModule, 'analyzeCodePuzzleGuess');
  const spy_analyzeWordleGuess = vi.spyOn(GamesWordleBeLogic, 'analyzeWordleGuess');

  const mock_generateWordleSolution = vi.fn();
  const mock_wordleAdapter: WordleAdapter = {
    generateWordleSolution: mock_generateWordleSolution,
  }

  beforeEach(() => {
    // Create a fresh mock before each test
    mock_GameInstancesTableAdapter = {
      getGameInstanceIdsForGameConfig: mock_getGameInstanceIdsForGameConfig,
      getGameInstance: mock_getGameInstance,
      getPublicGameInstance: mock_getPublicGameInstance,
      getGameInstanceByInvitationCode: mock_getGameInstanceByInvitationCode,
      createGameInstance: mock_createGameInstance,
      addPlayer: mock_addPlayer,
      startPlaying: mock_startPlaying,
      updateLevelState: mock_updateLevelState,
    };

    mock_GameConfigsTableAdapter = {
      getGameConfig: mock_getGameConfig,
    } as unknown as GameConfigsTableAdapter;

    mock_gamesPlayerInfoAdapter = {
      retrieveGameUserInfo: mock_retrievePlayerInfo,
    }

    logic = new GameInstanceLogic(mock_GameInstancesTableAdapter, mock_GameConfigsTableAdapter,
      mock_gamesPlayerInfoAdapter, mock_wordleAdapter);
  });

  describe('getGameInstanceIdsForGameConfig', () => {
    it('succeeds', async () => {
      mock_getGameInstanceIdsForGameConfig.mockResolvedValue(['GI1']);

      const result = await logic.getGameInstanceIdsForGameConfig('PLAYER1', { gameConfigId: 'GC1' });

      expect(mock_getGameInstanceIdsForGameConfig).toHaveBeenCalledWith('GC1');
      expect(result).toEqual(['GI1']);
    });
  });

  describe('getPublicGameInstance', () => {
    it('throws when game instance not found', async () => {
      mock_getPublicGameInstance.mockResolvedValue(null);

      await expect(logic.getPublicGameInstance('PLAYER1', { gameInstanceId: 'GI1' })).rejects.toThrow();

      expect(mock_getPublicGameInstance).toHaveBeenCalledWith('GI1');
    });

    it('succeeds', async () => {
      const publicGameInstance: PublicGameInstanceT = buildPublicGameInstanceMock();

      mock_getPublicGameInstance.mockResolvedValue(publicGameInstance);

      const result = await logic.getPublicGameInstance('PLAYER1', { gameInstanceId: 'GI1' });

      expect(mock_getPublicGameInstance).toHaveBeenCalledWith('GI1');
      expect(result).toEqual(publicGameInstance);
    });
  });

  describe('createGameInstance', () => {
    it('throws when game config not found', async () => {
      mock_getGameConfig.mockResolvedValue(null);

      const input: CreateGameInstanceInputT = { gameConfigId: 'GC1' };
      await expect(logic.createGameInstance('PLAYER1', input)).rejects.toThrow();

      expect(mock_getGameConfig).toHaveBeenCalledWith('GC1');
      expect(mock_retrievePlayerInfo).not.toHaveBeenCalled();
      expect(mock_createGameInstance).not.toHaveBeenCalled();
    });

    it('throws when cannot retrieve player nickname', async () => {
      mock_getGameConfig.mockResolvedValue(buildGameConfigMock());
      mock_retrievePlayerInfo.mockResolvedValue({ playerNickname: null });

      const input: CreateGameInstanceInputT = { gameConfigId: 'GC1' };
      await expect(logic.createGameInstance('PLAYER1', input)).rejects.toThrow();

      expect(mock_getGameConfig).toHaveBeenCalledWith('GC1');
      expect(mock_retrievePlayerInfo).toHaveBeenCalledWith('PLAYER1');
      expect(mock_createGameInstance).not.toHaveBeenCalled();
    });

    it('succeeds', async () => {
      mock_getGameConfig.mockResolvedValue(buildGameConfigMock({
        publicLevelConfigs: [buildPublicLevelConfig()]
      }));
      mock_retrievePlayerInfo.mockResolvedValue({ playerNickname: 'NICK1' });

      const input: CreateGameInstanceInputT = { gameConfigId: 'GC1' };
      await logic.createGameInstance('PLAYER1', input);

      expect(mock_getGameConfig).toHaveBeenCalledWith('GC1');
      expect(mock_retrievePlayerInfo).toHaveBeenCalledWith('PLAYER1');
      expect(mock_createGameInstance).toHaveBeenCalled();
    });
  });

  describe('joinGameByInvite', () => {
    it('throws when game instance not found', async () => {
      mock_getGameInstanceByInvitationCode.mockResolvedValue(null);
      mock_retrievePlayerInfo.mockResolvedValue({ playerNickname: 'NICK1' });

      const input: JoinGameByInviteInputT = { invitationCode: 'INVT1' };
      await expect(logic.joinGameByInvite('PLAYER1', input)).rejects.toThrow();

      expect(mock_getGameInstanceByInvitationCode).toHaveBeenCalledWith('INVT1');
      expect(mock_retrievePlayerInfo).not.toHaveBeenCalled();
      expect(mock_addPlayer).not.toHaveBeenCalled();
    });

    it('throws when cannot retrieve player nickname', async () => {
      mock_getGameInstanceByInvitationCode.mockResolvedValue(buildPublicGameInstanceMock());
      mock_retrievePlayerInfo.mockResolvedValue({ playerNickname: null });

      const input: JoinGameByInviteInputT = { invitationCode: 'INVT1' };
      await expect(logic.joinGameByInvite('PLAYER1', input)).rejects.toThrow();

      expect(mock_getGameInstanceByInvitationCode).toHaveBeenCalledWith('INVT1');
      expect(mock_retrievePlayerInfo).toHaveBeenCalledWith('PLAYER1');
      expect(mock_addPlayer).not.toHaveBeenCalled();
    });

    it('succeeds', async () => {
      mock_getGameInstanceByInvitationCode.mockResolvedValue(buildPublicGameInstanceMock({
        gameInstanceId: 'GI1',
      }));
      mock_retrievePlayerInfo.mockResolvedValue({ playerNickname: 'NICK1' });

      const input: JoinGameByInviteInputT = { invitationCode: 'INVT1' };
      await logic.joinGameByInvite('PLAYER1', input);

      expect(mock_getGameInstanceByInvitationCode).toHaveBeenCalledWith('INVT1');
      expect(mock_retrievePlayerInfo).toHaveBeenCalledWith('PLAYER1');
      expect(mock_addPlayer).toHaveBeenCalledWith('GI1', {
        playerId: 'PLAYER1',
        playerNickname: 'NICK1',
        playerRole: 'player',
        playerStatus: 'active',
      });
    });
  });

  describe('startPlaying', () => {
    it('succeeds', async () => {
      const input: StartPlayingInputT = { gameInstanceId: 'GI1' };
      await logic.startPlaying('PLAYER1', input);
    });
  });

  describe('submitGuess', () => {
    it('throws when game instance is not found', async () => {
      mock_getGameInstance.mockResolvedValue(null);
      mock_updateLevelState.mockResolvedValue({ isCorrectGuess: true });

      const input: SubmitGuessInputT = { gameInstanceId: 'GI1', levelIdx: 0, guess: 'World' };
      await expect(logic.submitGuess('PLAYER1', input)).rejects.toThrow();

      // verify calls
      expect(mock_getGameInstance).toHaveBeenCalledWith('GI1');
      expect(mock_updateLevelState).not.toHaveBeenCalled();
    });

    it('throws when levelIdx is invalid', async () => {
      mock_getGameInstance.mockResolvedValue(buildPublicGameInstanceMock({
        gameInstanceId: 'GI1',
      }));
      mock_updateLevelState.mockResolvedValue({ isCorrectGuess: true });

      const input: SubmitGuessInputT = { gameInstanceId: 'GI1', levelIdx: 0, guess: 'World' };
      await expect(logic.submitGuess('PLAYER1', input)).rejects.toThrow();

      // verify calls
      expect(mock_getGameInstance).toHaveBeenCalledWith('GI1');
      expect(mock_updateLevelState).not.toHaveBeenCalled();
    });

    it('succeeds, code, correct guess', async () => {
      mock_getGameInstance.mockResolvedValue(buildPublicGameInstanceMock({
        gameInstanceId: 'GI1',
        gameState: buildGameStateMock({
          levelStates: [
            buildLevelStateMock({
              levelStatus: 'levelInProcess',
              pluginState: buildCodeLevelStateMock(),
            }),
          ]
        }),
      }));
      spy_analyzeCodePuzzleGuess.mockReturnValue({ isCorrectGuess: true });

      const input: SubmitGuessInputT = { gameInstanceId: 'GI1', levelIdx: 0, guess: 'World' };
      const result = await logic.submitGuess('PLAYER1', input);

      expect(mock_updateLevelState).toHaveBeenCalled();
      expect(result).toEqual(true);
    });

    it('succeeds, code, incorrect guess', async () => {
      mock_getGameInstance.mockResolvedValue(buildPublicGameInstanceMock({
        gameInstanceId: 'GI1',
        gameState: buildGameStateMock({
          levelStates: [
            buildLevelStateMock({
              levelStatus: 'levelInProcess',
              pluginState: buildCodeLevelStateMock(),
            }),
          ]
        }),
      }));
      spy_analyzeCodePuzzleGuess.mockReturnValue({ isCorrectGuess: false });

      const input: SubmitGuessInputT = { gameInstanceId: 'GI1', levelIdx: 0, guess: 'World' };
      const result = await logic.submitGuess('PLAYER1', input);

      expect(mock_updateLevelState).toHaveBeenCalled();
      expect(result).toEqual(false);
    });

    it('succeeds, wordle, correct guess, level not failed', async () => {
      mock_getGameInstance.mockResolvedValue(buildPublicGameInstanceMock({
        gameInstanceId: 'GI1',
        gameState: buildGameStateMock({
          levelStates: [
            buildLevelStateMock({
              levelStatus: 'levelInProcess',
              pluginState: buildWordleLevelStateMock(),
            }),
          ]
        }),
      }));
      spy_analyzeWordleGuess.mockReturnValue({
        isCorrectGuess: true,
        isWordleFailed: false,
        newPublicWordleState: {
          guessDatas: [],
        },
      });

      const input: SubmitGuessInputT = { gameInstanceId: 'GI1', levelIdx: 0, guess: 'World' };
      const result = await logic.submitGuess('PLAYER1', input);

      expect(mock_updateLevelState).toHaveBeenCalled();
      expect(result).toEqual(true);
    });

    it('succeeds, wordle, incorrect guess, level not failed', async () => {
      mock_getGameInstance.mockResolvedValue(buildPublicGameInstanceMock({
        gameInstanceId: 'GI1',
        gameState: buildGameStateMock({
          levelStates: [
            buildLevelStateMock({
              levelStatus: 'levelInProcess',
              pluginState: buildWordleLevelStateMock(),
            }),
          ]
        }),
      }));
      spy_analyzeWordleGuess.mockReturnValue({
        isCorrectGuess: false,
        isWordleFailed: false,
        newPublicWordleState: {
          guessDatas: [],
        },
      });

      const input: SubmitGuessInputT = { gameInstanceId: 'GI1', levelIdx: 0, guess: 'World' };
      const result = await logic.submitGuess('PLAYER1', input);

      expect(mock_updateLevelState).toHaveBeenCalled();
      expect(result).toEqual(false);
    });

    it('succeeds, wordle, incorrect guess, level failed', async () => {
      mock_getGameInstance.mockResolvedValue(buildPublicGameInstanceMock({
        gameInstanceId: 'GI1',
        gameState: buildGameStateMock({
          levelStates: [
            buildLevelStateMock({
              levelStatus: 'levelInProcess',
              pluginState: buildWordleLevelStateMock(),
            }),
          ]
        }),
      }));
      spy_analyzeWordleGuess.mockReturnValue({
        isCorrectGuess: false,
        isWordleFailed: true,
        newPublicWordleState: {
          guessDatas: [],
        },
      });

      const input: SubmitGuessInputT = { gameInstanceId: 'GI1', levelIdx: 0, guess: 'World' };
      const result = await logic.submitGuess('PLAYER1', input);

      expect(mock_updateLevelState).toHaveBeenCalled();
      expect(result).toEqual(false);
    });
  });
});
