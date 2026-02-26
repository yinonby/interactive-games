
import { act, renderHook } from '@testing-library/react-native';
import * as ChatRtkApi from '../../model/rtk/ChatRtkApi';
import { useChatController } from './ChatController';

jest.mock('../../model/rtk/ChatRtkApi');

const conversationId1 = 'CID1';

describe('useChatController', () => {
  it('calls postChatMessage with the provided data', async () => {
    const usePostChatMessageMutationSpy = jest.spyOn(ChatRtkApi, 'usePostChatMessageMutation');
    const postChatMessageMock = jest.fn().mockResolvedValue({ data: {}});

    usePostChatMessageMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [postChatMessageMock, jest.fn() as any]
    );

    const { result } = renderHook(() => useChatController());

    await act(async () => {
      await result.current.onSendChatMessage(conversationId1, 'gameInstanceChat', 'user-1', 'name-1', 'Hello');
    });

    expect(postChatMessageMock).toHaveBeenCalledTimes(1);
    expect(postChatMessageMock).toHaveBeenCalledWith({
      conversationId: conversationId1,
      conversationKind: "gameInstanceChat",
      senderId: "user-1",
      senderDisplayName: 'name-1',
      msgContent: 'Hello',
      sentTs: Date.now(),
    });
  });

  it('handles error thrown by postChatMessage', async () => {
    const usePostChatMessageMutationSpy = jest.spyOn(ChatRtkApi, 'usePostChatMessageMutation');
    const postChatMessageMock = jest.fn().mockResolvedValue({ error: {}});

    usePostChatMessageMutationSpy.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [postChatMessageMock, jest.fn() as any]
    );

    const { result } = renderHook(() => useChatController());

    // verify throws
    await expect(result.current.onSendChatMessage(conversationId1, 'gameInstanceChat', 'user-1', 'name-1', 'Hello'))
      .rejects.toThrow();

    // verify calls
    expect(postChatMessageMock).toHaveBeenCalledTimes(1);
  });
});
