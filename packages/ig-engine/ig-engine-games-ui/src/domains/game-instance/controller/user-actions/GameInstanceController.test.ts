
import { act, renderHook } from '@testing-library/react-native';
import * as GameInstanceRtkApi from '../../model/rtk/GameInstanceRtkApi';
import { useGameInstanceController } from "./GameInstanceController";

jest.mock('../../model/rtk/GameInstanceRtkApi');

describe('useGameInstanceController', () => {
  it('calls postGameInstanceChatMessage with the provided data', async () => {
    const usePostGameInstanceChatMessageMutationSpy = jest.spyOn(GameInstanceRtkApi, "usePostGameInstanceChatMessageMutation");
    const postGameInstanceChatMessageMock = jest.fn().mockResolvedValue(undefined);

    (usePostGameInstanceChatMessageMutationSpy as jest.Mock).mockReturnValue(
      [postGameInstanceChatMessageMock]
    );

    const { result } = renderHook(() => useGameInstanceController());

    await act(async () => {
      await result.current.onSendChatMessage('giid-1', "user-1", "Hello world");
    });

    expect(postGameInstanceChatMessageMock).toHaveBeenCalledTimes(1);
    expect(postGameInstanceChatMessageMock).toHaveBeenCalledWith({
      gameInstanceId: 'giid-1',
      chatMessage: "Hello world",
      playerUserId: "user-1"
    });
  });
});
