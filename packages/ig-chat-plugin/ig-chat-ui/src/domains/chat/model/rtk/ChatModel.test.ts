
import type { GetMostRecentChatMessagesResponseT } from '@ig/chat-models';
import { renderHook } from '@testing-library/react-native';
import { MAX_INITIAL_CHAT_MESSAGES, useChatModel } from './ChatModel';
import type { UseGetChatQueryResultT } from './ChatRtkApi';
import * as ChatRtkApi from './ChatRtkApi';

jest.mock('./ChatRtkApi');

const conversationId1 = 'c1';

describe('ChatModel', () => {
  it('calls hooks with correct args', () => {
    const useGetChatQuerySpy = jest.spyOn(ChatRtkApi, "useGetChatQuery");

    useGetChatQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    } as UseGetChatQueryResultT);

    renderHook(() => useChatModel(conversationId1));

    // verify
    expect(useGetChatQuerySpy).toHaveBeenCalledWith({
      conversationId: conversationId1,
      limit: MAX_INITIAL_CHAT_MESSAGES,
    });
  });

  it('returns loading state when query is loading game-instance chat', () => {
    const useGetChatQuerySpy = jest.spyOn(ChatRtkApi, "useGetChatQuery");

    useGetChatQuerySpy.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    } as UseGetChatQueryResultT);

    const { result } = renderHook(() => useChatModel(conversationId1));

    expect(result.current).toEqual({
      isLoading: true,
      isError: false,
      data: undefined,
    });
  });

  it('returns error state when query has error in game-instance chat', () => {
    const useGetChatQuerySpy = jest.spyOn(ChatRtkApi, "useGetChatQuery");

    useGetChatQuerySpy.mockReturnValue({
      isLoading: false,
      isError: true,
      error: { appErrCode: "apiError:server" },
      data: undefined,
      refetch: jest.fn(),
    } as UseGetChatQueryResultT);

    const { result } = renderHook(() => useChatModel(conversationId1));

    expect(result.current).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: "apiError:server",
      data: undefined,
    });
  });

  it('returns error state when game-instance chat data is undefined', () => {
    const useGetChatQuerySpy = jest.spyOn(ChatRtkApi, "useGetChatQuery");

    useGetChatQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    } as UseGetChatQueryResultT);

    const { result } = renderHook(() => useChatModel(conversationId1));

    expect(result.current).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: "appError:invalidResponse",
    });
  });

  it('returns data', () => {
    const useGetChatQuerySpy = jest.spyOn(ChatRtkApi, "useGetChatQuery");

    const gameInstanceChatResponse: GetMostRecentChatMessagesResponseT = {
      data: {
        mostRecentChatMessages: [],
      }
    }

    useGetChatQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: gameInstanceChatResponse.data,
      refetch: jest.fn(),
    } as UseGetChatQueryResultT);

    const { result } = renderHook(() => useChatModel(conversationId1));

    expect(result.current).toEqual({
      isLoading: false,
      isError: false,
      data: {
        chatMessages: gameInstanceChatResponse.data.mostRecentChatMessages,
      },
    });
  });
});
