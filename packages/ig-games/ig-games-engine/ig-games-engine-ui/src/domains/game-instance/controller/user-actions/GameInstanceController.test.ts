
import { act, renderHook } from '@testing-library/react-native';
import * as GameInstanceRtkApi from '../../model/rtk/GameInstanceRtkApi';
import { useGameInstanceController } from './GameInstanceController';

jest.mock('../../model/rtk/GameInstanceRtkApi');

const conversationId1 = 'CID1';

describe('useGameInstanceController', () => {
  it('calls startGame', async () => {
    const useStartGameMutationSpy = jest.spyOn(GameInstanceRtkApi, 'useStartGameMutation');
    const usePostChatMessageMutationSpy = jest.spyOn(GameInstanceRtkApi, 'usePostChatMessageMutation');
    const useSubmitGuessMutationSpy = jest.spyOn(GameInstanceRtkApi, 'useSubmitGuessMutation');
    const startGameMock = jest.fn().mockResolvedValue({ data: {}});

    useStartGameMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [startGameMock, jest.fn() as any]
    );

    usePostChatMessageMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );

    useSubmitGuessMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );

    const { result } = renderHook(() => useGameInstanceController());

    await act(async () => {
      await result.current.onStartGame('giid-1');
    });

    expect(startGameMock).toHaveBeenCalledTimes(1);
    expect(startGameMock).toHaveBeenCalledWith('giid-1');
  });

  it('calls startGame and handles error', async () => {
    const useStartGameMutationSpy = jest.spyOn(GameInstanceRtkApi, 'useStartGameMutation');
    const usePostChatMessageMutationSpy = jest.spyOn(GameInstanceRtkApi, 'usePostChatMessageMutation');
    const useSubmitGuessMutationSpy = jest.spyOn(GameInstanceRtkApi, 'useSubmitGuessMutation');
    const startGameMock = jest.fn().mockResolvedValue({ error: {}});

    useStartGameMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [startGameMock, jest.fn() as any]
    );

    usePostChatMessageMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );

    useSubmitGuessMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );

    const { result } = renderHook(() => useGameInstanceController());

    // verify throws
    await expect(result.current.onStartGame('giid-1')).rejects.toThrow();


    // verify calls
    expect(startGameMock).toHaveBeenCalledTimes(1);
  });

  it('calls postChatMessage with the provided data', async () => {
    const useStartGameMutationSpy = jest.spyOn(GameInstanceRtkApi, 'useStartGameMutation');
    const usePostChatMessageMutationSpy = jest.spyOn(GameInstanceRtkApi, 'usePostChatMessageMutation');
    const useSubmitGuessMutationSpy = jest.spyOn(GameInstanceRtkApi, 'useSubmitGuessMutation');
    const postChatMessageMock = jest.fn().mockResolvedValue({ data: {}});

    useStartGameMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );

    usePostChatMessageMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [postChatMessageMock, jest.fn() as any]
    );

    useSubmitGuessMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );

    const { result } = renderHook(() => useGameInstanceController());

    await act(async () => {
      await result.current.onSendChatMessage('gameInstanceChat', conversationId1, 'user-1', 'Hello world');
    });

    expect(postChatMessageMock).toHaveBeenCalledTimes(1);
    expect(postChatMessageMock).toHaveBeenCalledWith({
      conversationKind: "gameInstanceChat",
      conversationId: conversationId1,
      senderAccountId: "user-1",
      chatMessage: 'Hello world',
    });
  });

  it('handles error thrown by postChatMessage', async () => {
    const useStartGameMutationSpy = jest.spyOn(GameInstanceRtkApi, 'useStartGameMutation');
    const usePostChatMessageMutationSpy = jest.spyOn(GameInstanceRtkApi, 'usePostChatMessageMutation');
    const useSubmitGuessMutationSpy = jest.spyOn(GameInstanceRtkApi, 'useSubmitGuessMutation');
    const postChatMessageMock = jest.fn().mockResolvedValue({ error: {}});

    useStartGameMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );

    usePostChatMessageMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [postChatMessageMock, jest.fn() as any]
    );

    useSubmitGuessMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );

    const { result } = renderHook(() => useGameInstanceController());

    // verify throws
    await expect(result.current.onSendChatMessage('gameInstanceChat', conversationId1, 'user-1', 'Hello world'))
      .rejects.toThrow();

    // verify calls
    expect(postChatMessageMock).toHaveBeenCalledTimes(1);
  });

  it('calls submitGuess with the provided data', async () => {
    const useStartGameMutationSpy = jest.spyOn(GameInstanceRtkApi, 'useStartGameMutation');
    const usePostChatMessageMutationSpy = jest.spyOn(GameInstanceRtkApi, 'usePostChatMessageMutation');
    const useSubmitGuessMutationSpy = jest.spyOn(GameInstanceRtkApi, 'useSubmitGuessMutation');
    const submitGuessMock = jest.fn().mockResolvedValue({ data: {}});

    useStartGameMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );

    usePostChatMessageMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );

    useSubmitGuessMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [submitGuessMock, jest.fn() as any]
    );

    const { result } = renderHook(() => useGameInstanceController());

    await act(async () => {
      await result.current.onSubmitGuess('giid-1', 0, 'Hello');
    });

    expect(submitGuessMock).toHaveBeenCalledTimes(1);
    expect(submitGuessMock).toHaveBeenCalledWith({
      gameInstanceId: 'giid-1',
      levelIdx: 0,
      guess: 'Hello',
    });
  });

  it('handles error thrown by postChatMessage', async () => {
    const useStartGameMutationSpy = jest.spyOn(GameInstanceRtkApi, 'useStartGameMutation');
    const usePostChatMessageMutationSpy = jest.spyOn(GameInstanceRtkApi, 'usePostChatMessageMutation');
    const useSubmitGuessMutationSpy = jest.spyOn(GameInstanceRtkApi, 'useSubmitGuessMutation');
    const submitGuessMock = jest.fn().mockResolvedValue({ error: {}});

    useStartGameMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );

    usePostChatMessageMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );

    useSubmitGuessMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [submitGuessMock, jest.fn() as any]
    );

    const { result } = renderHook(() => useGameInstanceController());

    // verify throws
    await expect(result.current.onSubmitGuess('giid-1', 0, 'Hello')).rejects.toThrow();


    // verify calls
    expect(submitGuessMock).toHaveBeenCalledTimes(1);
  });
});
