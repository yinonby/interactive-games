
import type { GameInstanceIdT } from '@ig/engine-models';
import { act, renderHook } from '@testing-library/react-native';
import * as GamesUserConfigRtkApi from '../../model/rtk/GamesUserConfigRtkApi';
import { useGamesUserConfigController } from './GamesUserConfigController';

jest.mock('../../model/rtk/GamesUserConfigRtkApi');

describe('useGamesUserConfigController', () => {
  it('calls playGame with the provided gameConfigId, fails', async () => {
    const useGamesPlayGameMutationSpy = jest.spyOn(GamesUserConfigRtkApi, 'useGamesPlayGameMutation');
    const useGamesAcceptInviteMutationSpy = jest.spyOn(GamesUserConfigRtkApi, 'useGamesAcceptInviteMutation');
    const useAddGameInstanceMutationSpy = jest.spyOn(GamesUserConfigRtkApi, 'useAddGameInstanceMutation');
    const playGameMock = jest.fn().mockResolvedValue({ error: {} });

    useGamesPlayGameMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [playGameMock, jest.fn() as any]
    );
    useGamesAcceptInviteMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );
    useAddGameInstanceMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );

    const { result } = renderHook(() => useGamesUserConfigController());

    await expect(result.current.onPlayGame('GAME_CONFIG_11')).rejects.toThrow();

    expect(playGameMock).toHaveBeenCalledTimes(1);
    expect(playGameMock).toHaveBeenCalledWith('GAME_CONFIG_11');
  });

  it('calls playGame with the provided gameConfigId, succeeds', async () => {
    const useGamesPlayGameMutationSpy = jest.spyOn(GamesUserConfigRtkApi, 'useGamesPlayGameMutation');
    const useGamesAcceptInviteMutationSpy = jest.spyOn(GamesUserConfigRtkApi, 'useGamesAcceptInviteMutation');
    const useAddGameInstanceMutationSpy = jest.spyOn(GamesUserConfigRtkApi, 'useAddGameInstanceMutation');
    const playGameMock = jest.fn().mockResolvedValue({ data: { gameInstanceId: 'GIID-1' }});

    useGamesPlayGameMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [playGameMock, jest.fn() as any]
    );
    useGamesAcceptInviteMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );
    useAddGameInstanceMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );

    const { result } = renderHook(() => useGamesUserConfigController());

    await act(async () => {
      await result.current.onPlayGame('GAME_CONFIG_11');
    });

    expect(playGameMock).toHaveBeenCalledTimes(1);
    expect(playGameMock).toHaveBeenCalledWith('GAME_CONFIG_11');
  });

  it('calls acceptInvite with the provided gameConfigId, fails', async () => {
    const useGamesPlayGameMutationSpy = jest.spyOn(GamesUserConfigRtkApi, 'useGamesPlayGameMutation');
    const useGamesAcceptInviteMutationSpy = jest.spyOn(GamesUserConfigRtkApi, 'useGamesAcceptInviteMutation');
    const useAddGameInstanceMutationSpy = jest.spyOn(GamesUserConfigRtkApi, 'useAddGameInstanceMutation');
    const acceptInviteMock = jest.fn().mockResolvedValue({ error: {} });

    useGamesPlayGameMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );
    useGamesAcceptInviteMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [acceptInviteMock, jest.fn() as any]
    );
    useAddGameInstanceMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );

    const { result } = renderHook(() => useGamesUserConfigController());

    await expect(result.current.onAcceptInvite('INT_CODE_1')).rejects.toThrow();

    expect(acceptInviteMock).toHaveBeenCalledTimes(1);
    expect(acceptInviteMock).toHaveBeenCalledWith('INT_CODE_1');
  });

  it('calls acceptInvite with the provided gameConfigId, succeeds', async () => {
    const useGamesPlayGameMutationSpy = jest.spyOn(GamesUserConfigRtkApi, 'useGamesPlayGameMutation');
    const useGamesAcceptInviteMutationSpy = jest.spyOn(GamesUserConfigRtkApi, 'useGamesAcceptInviteMutation');
    const useAddGameInstanceMutationSpy = jest.spyOn(GamesUserConfigRtkApi, 'useAddGameInstanceMutation');
    const acceptInviteMock = jest.fn().mockResolvedValue({ data: { gameInstanceId: 'GIID-2' }});

    useGamesPlayGameMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );
    useGamesAcceptInviteMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [acceptInviteMock, jest.fn() as any]
    );
    useAddGameInstanceMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );

    const { result } = renderHook(() => useGamesUserConfigController());

    await act(async () => {
      const retVal: GameInstanceIdT | null = await result.current.onAcceptInvite('INT_CODE_1');
      expect(retVal).toBe('GIID-2');
    });

    expect(acceptInviteMock).toHaveBeenCalledTimes(1);
    expect(acceptInviteMock).toHaveBeenCalledWith('INT_CODE_1');
  });

  it('calls addGameInstanc with the provided gameConfigId, fails', async () => {
    const useGamesPlayGameMutationSpy = jest.spyOn(GamesUserConfigRtkApi, 'useGamesPlayGameMutation');
    const useGamesAcceptInviteMutationSpy = jest.spyOn(GamesUserConfigRtkApi, 'useGamesAcceptInviteMutation');
    const useAddGameInstanceMutationSpy = jest.spyOn(GamesUserConfigRtkApi, 'useAddGameInstanceMutation');
    const addGameInstancMock = jest.fn().mockResolvedValue({ error: {} });

    useGamesPlayGameMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );
    useGamesAcceptInviteMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );
    useAddGameInstanceMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [addGameInstancMock, jest.fn() as any]
    );

    const { result } = renderHook(() => useGamesUserConfigController());

    await expect(result.current.onAddGameInstance('GAME_CONFIG_11')).rejects.toThrow();

    expect(addGameInstancMock).toHaveBeenCalledTimes(1);
    expect(addGameInstancMock).toHaveBeenCalledWith('GAME_CONFIG_11');
  });

  it('calls addGameInstanc with the provided gameConfigId, succeeds', async () => {
    const useGamesPlayGameMutationSpy = jest.spyOn(GamesUserConfigRtkApi, 'useGamesPlayGameMutation');
    const useGamesAcceptInviteMutationSpy = jest.spyOn(GamesUserConfigRtkApi, 'useGamesAcceptInviteMutation');
    const useAddGameInstanceMutationSpy = jest.spyOn(GamesUserConfigRtkApi, 'useAddGameInstanceMutation');
    const addGameInstancMock = jest.fn().mockResolvedValue({ data: { gameInstanceId: 'GIID-1' }});

    useGamesPlayGameMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );
    useGamesAcceptInviteMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );
    useAddGameInstanceMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [addGameInstancMock, jest.fn() as any]
    );

    const { result } = renderHook(() => useGamesUserConfigController());

    await act(async () => {
      await result.current.onAddGameInstance('GAME_CONFIG_11');
    });

    expect(addGameInstancMock).toHaveBeenCalledTimes(1);
    expect(addGameInstancMock).toHaveBeenCalledWith('GAME_CONFIG_11');
  });
});
