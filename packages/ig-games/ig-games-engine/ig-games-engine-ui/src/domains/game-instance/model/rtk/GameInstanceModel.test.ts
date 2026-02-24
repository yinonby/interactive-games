
import {
  getGameInstanceConversationId,
  type ConversationIdT,
  type GameInstanceExposedInfoT, type GetChatResponseT,
  type GetGameInstanceResponseT
} from '@ig/games-engine-models';
import { renderHook } from '@testing-library/react-native';
import { useGameInstanceModel } from './GameInstanceModel';
import type { UseGetChatQueryResultT, UseGetGameInstanceQueryResultT } from './GameInstanceRtkApi';
import * as GameInstanceRtkApi from './GameInstanceRtkApi';

jest.mock('./GameInstanceRtkApi');

const gameInstanceId1 = 'giid-1';

describe('GameInstanceModel', () => {
  it('calls hooks with correct args', () => {
    const useGetGameInstanceQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetGameInstanceQuery");
    const useGetChatQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetChatQuery");

    useGetGameInstanceQuerySpy.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    } as UseGetGameInstanceQueryResultT);

    useGetChatQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    } as UseGetChatQueryResultT);

    renderHook(() => useGameInstanceModel(gameInstanceId1));

    // verify
    const expectedConversationId: ConversationIdT = getGameInstanceConversationId(gameInstanceId1);
    expect(useGetGameInstanceQuerySpy).toHaveBeenCalledWith(gameInstanceId1);
    expect(useGetChatQuerySpy).toHaveBeenCalledWith(expectedConversationId);
  });

  it('returns loading state when query is loading game-instance', () => {
    const useGetGameInstanceQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetGameInstanceQuery");
    const useGetChatQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetChatQuery");

    useGetGameInstanceQuerySpy.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    } as UseGetGameInstanceQueryResultT);

    useGetChatQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    } as UseGetChatQueryResultT);

    const { result } = renderHook(() => useGameInstanceModel(gameInstanceId1));

    expect(result.current).toEqual({
      isLoading: true,
      isError: false,
      data: undefined,
    });
  });

  it('returns loading state when query is loading game-instance chat', () => {
    const useGetGameInstanceQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetGameInstanceQuery");
    const useGetChatQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetChatQuery");

    useGetGameInstanceQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    } as UseGetGameInstanceQueryResultT);

    useGetChatQuerySpy.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    } as UseGetChatQueryResultT);

    const { result } = renderHook(() => useGameInstanceModel(gameInstanceId1));

    expect(result.current).toEqual({
      isLoading: true,
      isError: false,
      data: undefined,
    });
  });

  it('returns error state when query has error in game-instance', () => {
    const useGetGameInstanceQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetGameInstanceQuery");
    const useGetChatQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetChatQuery");

    useGetGameInstanceQuerySpy.mockReturnValue({
      isLoading: false,
      isError: true,
      error: { appErrCode: "apiError:server" },
      refetch: jest.fn(),
    } as UseGetGameInstanceQueryResultT);

    useGetChatQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    } as UseGetChatQueryResultT);

    const { result } = renderHook(() => useGameInstanceModel(gameInstanceId1));

    expect(result.current).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: "apiError:server",
      data: undefined,
    });
  });

  it('returns error state when query has error in game-instance chat', () => {
    const useGetGameInstanceQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetGameInstanceQuery");
    const useGetChatQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetChatQuery");

    useGetGameInstanceQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    } as UseGetGameInstanceQueryResultT);

    useGetChatQuerySpy.mockReturnValue({
      isLoading: false,
      isError: true,
      error: { appErrCode: "apiError:server" },
      data: undefined,
      refetch: jest.fn(),
    } as UseGetChatQueryResultT);

    const { result } = renderHook(() => useGameInstanceModel(gameInstanceId1));

    expect(result.current).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: "apiError:server",
      data: undefined,
    });
  });

  it('returns error state when game-instance data is undefined', () => {
    const useGetGameInstanceQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetGameInstanceQuery");
    const useGetChatQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetChatQuery");

    useGetGameInstanceQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    } as UseGetGameInstanceQueryResultT);

    useGetChatQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {},
      refetch: jest.fn(),
    } as UseGetChatQueryResultT);

    const { result } = renderHook(() => useGameInstanceModel(gameInstanceId1));

    expect(result.current).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: "appError:invalidResponse",
    });
  });

  it('returns error state when game-instance chat data is undefined', () => {
    const useGetGameInstanceQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetGameInstanceQuery");
    const useGetChatQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetChatQuery");

    useGetGameInstanceQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {},
      refetch: jest.fn(),
    } as UseGetGameInstanceQueryResultT);

    useGetChatQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    } as UseGetChatQueryResultT);

    const { result } = renderHook(() => useGameInstanceModel(gameInstanceId1));

    expect(result.current).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: "appError:invalidResponse",
    });
  });

  it('returns data', () => {
    const useGetGameInstanceQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetGameInstanceQuery");
    const useGetChatQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetChatQuery");

    const gameInstanceExposedInfo: GameInstanceExposedInfoT = {
      gameInstanceId: gameInstanceId1,
    } as GameInstanceExposedInfoT;
    const gameInstanceResponse: GetGameInstanceResponseT = {
      gameInstanceExposedInfo: gameInstanceExposedInfo,
    }
    const gameInstanceChatResponse: GetChatResponseT = {
      chatMessages: [],
    }
    useGetGameInstanceQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: gameInstanceResponse,
      refetch: jest.fn(),
    } as UseGetGameInstanceQueryResultT);

    useGetChatQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: gameInstanceChatResponse,
      refetch: jest.fn(),
    } as UseGetChatQueryResultT);

    const { result } = renderHook(() => useGameInstanceModel(gameInstanceId1));

    expect(result.current).toEqual({
      isLoading: false,
      isError: false,
      data: {
        gameInstanceExposedInfo: gameInstanceResponse.gameInstanceExposedInfo,
        chatMessages: gameInstanceChatResponse.chatMessages,
      },
    });
  });
});
