
import type { GameInstanceIdT } from "@ig/engine-models";
import { act, renderHook } from '@testing-library/react-native';
import * as UserConfigRtkApi from '../../model/rtk/UserConfigRtkApi';
import { useUserConfigController } from "./UserConfigController";

jest.mock('../../model/rtk/UserConfigRtkApi');

describe('useUserConfigController', () => {
  it('calls addGameConfig with the provided gameCode', async () => {
    const useAddGameConfigMutationSpy = jest.spyOn(UserConfigRtkApi, "useAddGameConfigMutation");
    const usePlayGameMutationSpy = jest.spyOn(UserConfigRtkApi, "usePlayGameMutation");
    const useAcceptInviteMutationSpy = jest.spyOn(UserConfigRtkApi, "useAcceptInviteMutation");
    const addGameConfigMock = jest.fn().mockResolvedValue(undefined);

    (useAddGameConfigMutationSpy as jest.Mock).mockReturnValue(
      [addGameConfigMock]
    );
    (usePlayGameMutationSpy as jest.Mock).mockReturnValue(
      []
    );
    (useAcceptInviteMutationSpy as jest.Mock).mockReturnValue(
      []
    );

    const { result } = renderHook(() => useUserConfigController());

    await act(async () => {
      await result.current.onAddGame('GAME_123');
    });

    expect(addGameConfigMock).toHaveBeenCalledTimes(1);
    expect(addGameConfigMock).toHaveBeenCalledWith('GAME_123');
  });

  it('calls playGame with the provided gameConfigId, fails', async () => {
    const useAddGameConfigMutationSpy = jest.spyOn(UserConfigRtkApi, "useAddGameConfigMutation");
    const usePlayGameMutationSpy = jest.spyOn(UserConfigRtkApi, "usePlayGameMutation");
    const useAcceptInviteMutationSpy = jest.spyOn(UserConfigRtkApi, "useAcceptInviteMutation");
    const playGameMock = jest.fn().mockResolvedValue({});

    (useAddGameConfigMutationSpy as jest.Mock).mockReturnValue(
      []
    );
    (usePlayGameMutationSpy as jest.Mock).mockReturnValue(
      [playGameMock]
    );
    (useAcceptInviteMutationSpy as jest.Mock).mockReturnValue(
      []
    );

    const { result } = renderHook(() => useUserConfigController());

    await act(async () => {
      const retVal: GameInstanceIdT | null = await result.current.onPlayGame('GAME_CONFIG_11');
      expect(retVal).toBe(null);
    });

    expect(playGameMock).toHaveBeenCalledTimes(1);
    expect(playGameMock).toHaveBeenCalledWith('GAME_CONFIG_11');
  });

  it('calls playGame with the provided gameConfigId, succeeds', async () => {
    const useAddGameConfigMutationSpy = jest.spyOn(UserConfigRtkApi, "useAddGameConfigMutation");
    const usePlayGameMutationSpy = jest.spyOn(UserConfigRtkApi, "usePlayGameMutation");
    const useAcceptInviteMutationSpy = jest.spyOn(UserConfigRtkApi, "useAcceptInviteMutation");
    const playGameMock = jest.fn().mockResolvedValue({ data: { gameInstanceId: "GIID-1" }});

    (useAddGameConfigMutationSpy as jest.Mock).mockReturnValue(
      []
    );
    (usePlayGameMutationSpy as jest.Mock).mockReturnValue(
      [playGameMock]
    );
    (useAcceptInviteMutationSpy as jest.Mock).mockReturnValue(
      []
    );

    const { result } = renderHook(() => useUserConfigController());

    await act(async () => {
      const retVal: GameInstanceIdT | null = await result.current.onPlayGame('GAME_CONFIG_11');
      expect(retVal).toBe("GIID-1");
    });

    expect(playGameMock).toHaveBeenCalledTimes(1);
    expect(playGameMock).toHaveBeenCalledWith('GAME_CONFIG_11');
  });

  it('calls acceptInvite with the provided gameConfigId, fails', async () => {
    const useAddGameConfigMutationSpy = jest.spyOn(UserConfigRtkApi, "useAddGameConfigMutation");
    const usePlayGameMutationSpy = jest.spyOn(UserConfigRtkApi, "usePlayGameMutation");
    const useAcceptInviteMutationSpy = jest.spyOn(UserConfigRtkApi, "useAcceptInviteMutation");
    const acceptInviteMock = jest.fn().mockResolvedValue({});

    (useAddGameConfigMutationSpy as jest.Mock).mockReturnValue(
      []
    );
    (usePlayGameMutationSpy as jest.Mock).mockReturnValue(
      []
    );
    (useAcceptInviteMutationSpy as jest.Mock).mockReturnValue(
      [acceptInviteMock]
    );

    const { result } = renderHook(() => useUserConfigController());

    await act(async () => {
      const retVal: GameInstanceIdT | null = await result.current.onAcceptInvite('INT_CODE_1');
      expect(retVal).toBe(null);
    });

    expect(acceptInviteMock).toHaveBeenCalledTimes(1);
    expect(acceptInviteMock).toHaveBeenCalledWith('INT_CODE_1');
  });

  it('calls acceptInvite with the provided gameConfigId, succeeds', async () => {
    const useAddGameConfigMutationSpy = jest.spyOn(UserConfigRtkApi, "useAddGameConfigMutation");
    const usePlayGameMutationSpy = jest.spyOn(UserConfigRtkApi, "usePlayGameMutation");
    const useAcceptInviteMutationSpy = jest.spyOn(UserConfigRtkApi, "useAcceptInviteMutation");
    const acceptInviteMock = jest.fn().mockResolvedValue({ data: { gameInstanceId: "GIID-2" }});

    (useAddGameConfigMutationSpy as jest.Mock).mockReturnValue(
      []
    );
    (usePlayGameMutationSpy as jest.Mock).mockReturnValue(
      []
    );
    (useAcceptInviteMutationSpy as jest.Mock).mockReturnValue(
      [acceptInviteMock]
    );

    const { result } = renderHook(() => useUserConfigController());

    await act(async () => {
      const retVal: GameInstanceIdT | null = await result.current.onAcceptInvite('INT_CODE_1');
      expect(retVal).toBe("GIID-2");
    });

    expect(acceptInviteMock).toHaveBeenCalledTimes(1);
    expect(acceptInviteMock).toHaveBeenCalledWith('INT_CODE_1');
  });
});
