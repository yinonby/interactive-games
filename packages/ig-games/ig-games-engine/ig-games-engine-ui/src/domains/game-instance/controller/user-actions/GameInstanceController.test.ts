
import { act, renderHook } from '@testing-library/react-native';
import * as GameInstanceRtkApi from '../../model/rtk/GameInstanceRtkApi';
import { useGameInstanceController } from './GameInstanceController';

jest.mock('../../model/rtk/GameInstanceRtkApi');

describe('useGameInstanceController', () => {
  it('calls startGame', async () => {
    const useStartGameMutationSpy = jest.spyOn(GameInstanceRtkApi, 'useStartGameMutation');
    const usePostGameInstanceChatMessageMutationSpy =
      jest.spyOn(GameInstanceRtkApi, 'usePostGameInstanceChatMessageMutation');
    const useSubmitGuessMutationSpy = jest.spyOn(GameInstanceRtkApi, 'useSubmitGuessMutation');
    const startGameMock = jest.fn().mockResolvedValue({ data: {}});

    useStartGameMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [startGameMock, jest.fn() as any]
    );

    usePostGameInstanceChatMessageMutationSpy.mockReturnValue(
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
    const usePostGameInstanceChatMessageMutationSpy =
      jest.spyOn(GameInstanceRtkApi, 'usePostGameInstanceChatMessageMutation');
    const useSubmitGuessMutationSpy = jest.spyOn(GameInstanceRtkApi, 'useSubmitGuessMutation');
    const startGameMock = jest.fn().mockResolvedValue({ error: {}});

    useStartGameMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [startGameMock, jest.fn() as any]
    );

    usePostGameInstanceChatMessageMutationSpy.mockReturnValue(
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

  it('calls postGameInstanceChatMessage with the provided data', async () => {
    const useStartGameMutationSpy = jest.spyOn(GameInstanceRtkApi, 'useStartGameMutation');
    const usePostGameInstanceChatMessageMutationSpy =
      jest.spyOn(GameInstanceRtkApi, 'usePostGameInstanceChatMessageMutation');
    const useSubmitGuessMutationSpy = jest.spyOn(GameInstanceRtkApi, 'useSubmitGuessMutation');
    const postGameInstanceChatMessageMock = jest.fn().mockResolvedValue({ data: {}});

    useStartGameMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );

    usePostGameInstanceChatMessageMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [postGameInstanceChatMessageMock, jest.fn() as any]
    );

    useSubmitGuessMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );

    const { result } = renderHook(() => useGameInstanceController());

    await act(async () => {
      await result.current.onSendChatMessage('giid-1', 'user-1', 'Hello world');
    });

    expect(postGameInstanceChatMessageMock).toHaveBeenCalledTimes(1);
    expect(postGameInstanceChatMessageMock).toHaveBeenCalledWith({
      gameInstanceId: 'giid-1',
      chatMessage: 'Hello world',
      playerUserId: 'user-1'
    });
  });

  it('handles error thrown by postGameInstanceChatMessage', async () => {
    const useStartGameMutationSpy = jest.spyOn(GameInstanceRtkApi, 'useStartGameMutation');
    const usePostGameInstanceChatMessageMutationSpy =
      jest.spyOn(GameInstanceRtkApi, 'usePostGameInstanceChatMessageMutation');
    const useSubmitGuessMutationSpy = jest.spyOn(GameInstanceRtkApi, 'useSubmitGuessMutation');
    const postGameInstanceChatMessageMock = jest.fn().mockResolvedValue({ error: {}});

    useStartGameMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );

    usePostGameInstanceChatMessageMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [postGameInstanceChatMessageMock, jest.fn() as any]
    );

    useSubmitGuessMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );

    const { result } = renderHook(() => useGameInstanceController());

    // verify throws
    await expect(result.current.onSendChatMessage('giid-1', 'user-1', 'Hello world')).rejects.toThrow();

    // verify calls
    expect(postGameInstanceChatMessageMock).toHaveBeenCalledTimes(1);
  });

  it('calls submitGuess with the provided data', async () => {
    const useStartGameMutationSpy = jest.spyOn(GameInstanceRtkApi, 'useStartGameMutation');
    const usePostGameInstanceChatMessageMutationSpy =
      jest.spyOn(GameInstanceRtkApi, 'usePostGameInstanceChatMessageMutation');
    const useSubmitGuessMutationSpy = jest.spyOn(GameInstanceRtkApi, 'useSubmitGuessMutation');
    const submitGuessMock = jest.fn().mockResolvedValue({ data: {}});

    useStartGameMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );

    usePostGameInstanceChatMessageMutationSpy.mockReturnValue(
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

  it('handles error thrown by postGameInstanceChatMessage', async () => {
    const useStartGameMutationSpy = jest.spyOn(GameInstanceRtkApi, 'useStartGameMutation');
    const usePostGameInstanceChatMessageMutationSpy =
      jest.spyOn(GameInstanceRtkApi, 'usePostGameInstanceChatMessageMutation');
    const useSubmitGuessMutationSpy = jest.spyOn(GameInstanceRtkApi, 'useSubmitGuessMutation');
    const submitGuessMock = jest.fn().mockResolvedValue({ error: {}});

    useStartGameMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );

    usePostGameInstanceChatMessageMutationSpy.mockReturnValue(
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
