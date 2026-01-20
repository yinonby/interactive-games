
import type { GameInstanceIdT } from "@ig/engine-models";
import { act, renderHook } from '@testing-library/react-native';
import * as GamesUserConfigRtkApi from '../../model/rtk/GamesUserConfigRtkApi';
import { useGamesUserConfigController } from "./GamesUserConfigController";

jest.mock('../../model/rtk/GamesUserConfigRtkApi');

describe('useGamesUserConfigController', () => {
  it('calls playGame with the provided gameConfigId, fails', async () => {
    const useGamesPlayGameMutationSpy = jest.spyOn(GamesUserConfigRtkApi, "useGamesPlayGameMutation");
    const useGamesAcceptInviteMutationSpy = jest.spyOn(GamesUserConfigRtkApi, "useGamesAcceptInviteMutation");
    const playGameMock = jest.fn().mockResolvedValue({ error: {} });

    (useGamesPlayGameMutationSpy as jest.Mock).mockReturnValue(
      [playGameMock]
    );
    (useGamesAcceptInviteMutationSpy as jest.Mock).mockReturnValue(
      []
    );

    const { result } = renderHook(() => useGamesUserConfigController());

    await expect(result.current.onPlayGame('GAME_CONFIG_11')).rejects.toThrow();

    expect(playGameMock).toHaveBeenCalledTimes(1);
    expect(playGameMock).toHaveBeenCalledWith('GAME_CONFIG_11');
  });

  it('calls playGame with the provided gameConfigId, succeeds', async () => {
    const useGamesPlayGameMutationSpy = jest.spyOn(GamesUserConfigRtkApi, "useGamesPlayGameMutation");
    const useGamesAcceptInviteMutationSpy = jest.spyOn(GamesUserConfigRtkApi, "useGamesAcceptInviteMutation");
    const playGameMock = jest.fn().mockResolvedValue({ data: { gameInstanceId: "GIID-1" }});

    (useGamesPlayGameMutationSpy as jest.Mock).mockReturnValue(
      [playGameMock]
    );
    (useGamesAcceptInviteMutationSpy as jest.Mock).mockReturnValue(
      []
    );

    const { result } = renderHook(() => useGamesUserConfigController());

    await act(async () => {
      const retVal: GameInstanceIdT | null = await result.current.onPlayGame('GAME_CONFIG_11');
      expect(retVal).toBe("GIID-1");
    });

    expect(playGameMock).toHaveBeenCalledTimes(1);
    expect(playGameMock).toHaveBeenCalledWith('GAME_CONFIG_11');
  });

  it('calls acceptInvite with the provided gameConfigId, fails', async () => {
    const useGamesPlayGameMutationSpy = jest.spyOn(GamesUserConfigRtkApi, "useGamesPlayGameMutation");
    const useGamesAcceptInviteMutationSpy = jest.spyOn(GamesUserConfigRtkApi, "useGamesAcceptInviteMutation");
    const acceptInviteMock = jest.fn().mockResolvedValue({ error: {} });

    (useGamesPlayGameMutationSpy as jest.Mock).mockReturnValue(
      []
    );
    (useGamesAcceptInviteMutationSpy as jest.Mock).mockReturnValue(
      [acceptInviteMock]
    );

    const { result } = renderHook(() => useGamesUserConfigController());

    await expect(result.current.onAcceptInvite('INT_CODE_1')).rejects.toThrow();

    expect(acceptInviteMock).toHaveBeenCalledTimes(1);
    expect(acceptInviteMock).toHaveBeenCalledWith('INT_CODE_1');
  });

  it('calls acceptInvite with the provided gameConfigId, succeeds', async () => {
    const useGamesPlayGameMutationSpy = jest.spyOn(GamesUserConfigRtkApi, "useGamesPlayGameMutation");
    const useGamesAcceptInviteMutationSpy = jest.spyOn(GamesUserConfigRtkApi, "useGamesAcceptInviteMutation");
    const acceptInviteMock = jest.fn().mockResolvedValue({ data: { gameInstanceId: "GIID-2" }});

    (useGamesPlayGameMutationSpy as jest.Mock).mockReturnValue(
      []
    );
    (useGamesAcceptInviteMutationSpy as jest.Mock).mockReturnValue(
      [acceptInviteMock]
    );

    const { result } = renderHook(() => useGamesUserConfigController());

    await act(async () => {
      const retVal: GameInstanceIdT | null = await result.current.onAcceptInvite('INT_CODE_1');
      expect(retVal).toBe("GIID-2");
    });

    expect(acceptInviteMock).toHaveBeenCalledTimes(1);
    expect(acceptInviteMock).toHaveBeenCalledWith('INT_CODE_1');
  });
});
