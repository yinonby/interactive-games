
import { act, renderHook } from '@testing-library/react-native';
import * as GameInstanceRtkApi from '../../model/rtk/GameInstanceRtkApi';
import { useGameInstanceController } from './GameInstanceController';

jest.mock('../../model/rtk/GameInstanceRtkApi');

describe('useGameInstanceController', () => {
  const spy_useCreateGameInstaceMutation = jest.spyOn(GameInstanceRtkApi, 'useCreateGameInstaceMutation');
  const spy_useJoinGameByInviteMutation = jest.spyOn(GameInstanceRtkApi, 'useJoinGameByInviteMutation');
  const spy_useStartPlayingMutation = jest.spyOn(GameInstanceRtkApi, 'useStartPlayingMutation');
  const spy_useSubmitGuessMutation = jest.spyOn(GameInstanceRtkApi, 'useSubmitGuessMutation');

  beforeAll(() => {
    jest.clearAllMocks();

    spy_useCreateGameInstaceMutation.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );
    spy_useJoinGameByInviteMutation.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );
    spy_useStartPlayingMutation.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );
    spy_useSubmitGuessMutation.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );
  });

  describe('createGameInstance', () => {
    it('calls createGameInstance with the provided data', async () => {
      const mock_createGameInstance = jest.fn().mockResolvedValue({ data: {
        createGameInstanceResult: {
          gameInstanceId: 'GI1'
        }
     }});

      spy_useCreateGameInstaceMutation.mockReturnValue(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [mock_createGameInstance, jest.fn() as any]
      );

      const { result } = renderHook(() => useGameInstanceController());

      await act(async () => {
        await result.current.onCreateGameInstance('GC1');
      });

      expect(mock_createGameInstance).toHaveBeenCalledTimes(1);
      expect(mock_createGameInstance).toHaveBeenCalledWith({
        gameConfigId: 'GC1',
      });
    });

    it('handles error thrown by createGameInstance', async () => {
      const mock_createGameInstance = jest.fn().mockResolvedValue({ error: {} });

      spy_useCreateGameInstaceMutation.mockReturnValue(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [mock_createGameInstance, jest.fn() as any]
      );

      const { result } = renderHook(() => useGameInstanceController());

      // verify throws
      await expect(result.current.onCreateGameInstance('GC1')).rejects.toThrow();

      // verify calls
      expect(mock_createGameInstance).toHaveBeenCalledTimes(1);
    });
  });

  describe('joinGameByInvite', () => {
    it('calls joinGameByInvite with the provided data', async () => {
      const mock_joinGameByInvite = jest.fn().mockResolvedValue({ data: {
        joinGameByInviteResult: {
          gameInstanceId: 'GI1'
        }
      }});

      spy_useJoinGameByInviteMutation.mockReturnValue(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [mock_joinGameByInvite, jest.fn() as any]
      );

      const { result } = renderHook(() => useGameInstanceController());

      await act(async () => {
        await result.current.onJoinGameByInvite('INVT1');
      });

      expect(mock_joinGameByInvite).toHaveBeenCalledTimes(1);
      expect(mock_joinGameByInvite).toHaveBeenCalledWith({
        invitationCode: 'INVT1',
      });
    });

    it('handles error thrown by joinGameByInvite', async () => {
      const mock_joinGameByInvite = jest.fn().mockResolvedValue({ error: {} });

      spy_useJoinGameByInviteMutation.mockReturnValue(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [mock_joinGameByInvite, jest.fn() as any]
      );

      const { result } = renderHook(() => useGameInstanceController());

      // verify throws
      await expect(result.current.onJoinGameByInvite('INVT1')).rejects.toThrow();

      // verify calls
      expect(mock_joinGameByInvite).toHaveBeenCalledTimes(1);
    });
  });

  describe('startPlaying', () => {
    it('calls startPlaying', async () => {
      const mock_startPlaying = jest.fn().mockResolvedValue({ data: {} });

      spy_useStartPlayingMutation.mockReturnValue(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [mock_startPlaying, jest.fn() as any]
      );

      const { result } = renderHook(() => useGameInstanceController());

      await act(async () => {
        await result.current.onStartPlaying('GI1');
      });

      expect(mock_startPlaying).toHaveBeenCalledTimes(1);
      expect(mock_startPlaying).toHaveBeenCalledWith({
        gameInstanceId: 'GI1'
      });
    });

    it('calls startPlaying and handles error', async () => {
      const mock_startPlaying = jest.fn().mockResolvedValue({ error: {} });

      spy_useStartPlayingMutation.mockReturnValue(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [mock_startPlaying, jest.fn() as any]
      );

      const { result } = renderHook(() => useGameInstanceController());

      // verify throws
      await expect(result.current.onStartPlaying('GI1')).rejects.toThrow();


      // verify calls
      expect(mock_startPlaying).toHaveBeenCalledTimes(1);
    });
  });

  describe('submitGuess', () => {
    it('calls submitGuess with the provided data', async () => {
      const mock_submitGuess = jest.fn().mockResolvedValue({ data: { submitGuessResult: { isGuessCorrect: true }}});

      spy_useSubmitGuessMutation.mockReturnValue(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [mock_submitGuess, jest.fn() as any]
      );

      const { result } = renderHook(() => useGameInstanceController());

      await act(async () => {
        await result.current.onSubmitGuess('GI1', 0, 'Hello');
      });

      expect(mock_submitGuess).toHaveBeenCalledTimes(1);
      expect(mock_submitGuess).toHaveBeenCalledWith({
        gameInstanceId: 'GI1',
        levelIdx: 0,
        guess: 'Hello',
      });
    });

    it('handles error thrown by submitGuess', async () => {
      const mock_submitGuess = jest.fn().mockResolvedValue({ error: {} });

      spy_useSubmitGuessMutation.mockReturnValue(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [mock_submitGuess, jest.fn() as any]
      );

      const { result } = renderHook(() => useGameInstanceController());

      // verify throws
      await expect(result.current.onSubmitGuess('GI1', 0, 'Hello')).rejects.toThrow();


      // verify calls
      expect(mock_submitGuess).toHaveBeenCalledTimes(1);
    });
  });
});
