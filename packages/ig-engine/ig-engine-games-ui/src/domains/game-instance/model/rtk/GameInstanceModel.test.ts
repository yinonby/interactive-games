
import type {
  GameInstanceExposedInfoT, GetGameInstanceChatResponseT,
  GetGameInstanceResponseT
} from "@ig/engine-models";
import { renderHook } from '@testing-library/react-native';
import { useGameInstanceModel } from './GameInstanceModel';
import type { UseGetGameInstanceChatQueryResultT, UseGetGameInstanceQueryResultT } from "./GameInstanceRtkApi";
import * as GameInstanceRtkApi from './GameInstanceRtkApi';

jest.mock('./GameInstanceRtkApi');

describe('GameInstanceModel', () => {
  it('returns loading state when query is loading game-instance', () => {
    const useGetGameInstanceQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetGameInstanceQuery");
    const useGetGameInstanceChatQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetGameInstanceChatQuery");

    useGetGameInstanceQuerySpy.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    } as UseGetGameInstanceQueryResultT);
    useGetGameInstanceChatQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    } as UseGetGameInstanceChatQueryResultT);

    const { result } = renderHook(() => useGameInstanceModel("giid-1"));

    expect(result.current).toEqual({
      isLoading: true,
      isError: false,
      data: undefined,
    });
  });

  it('returns loading state when query is loading game-instance chat', () => {
    const useGetGameInstanceQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetGameInstanceQuery");
    const useGetGameInstanceChatQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetGameInstanceChatQuery");

    useGetGameInstanceQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    } as UseGetGameInstanceQueryResultT);
    useGetGameInstanceChatQuerySpy.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    } as UseGetGameInstanceChatQueryResultT);

    const { result } = renderHook(() => useGameInstanceModel("giid-1"));

    expect(result.current).toEqual({
      isLoading: true,
      isError: false,
      data: undefined,
    });
  });

  it('returns error state when query has error in game-instance', () => {
    const useGetGameInstanceQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetGameInstanceQuery");
    const useGetGameInstanceChatQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetGameInstanceChatQuery");

    useGetGameInstanceQuerySpy.mockReturnValue({
      isLoading: false,
      isError: true,
      error: { appErrCode: "apiError:server" },
      refetch: jest.fn(),
    } as UseGetGameInstanceQueryResultT);
    useGetGameInstanceChatQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    } as UseGetGameInstanceChatQueryResultT);

    const { result } = renderHook(() => useGameInstanceModel("giid-1"));

    expect(result.current).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: "apiError:server",
      data: undefined,
    });
  });

  it('returns error state when query has error in game-instance chat', () => {
    const useGetGameInstanceQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetGameInstanceQuery");
    const useGetGameInstanceChatQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetGameInstanceChatQuery");

    useGetGameInstanceQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    } as UseGetGameInstanceQueryResultT);
    useGetGameInstanceChatQuerySpy.mockReturnValue({
      isLoading: false,
      isError: true,
      error: { appErrCode: "apiError:server" },
      data: undefined,
      refetch: jest.fn(),
    } as UseGetGameInstanceChatQueryResultT);

    const { result } = renderHook(() => useGameInstanceModel("giid-1"));

    expect(result.current).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: "apiError:server",
      data: undefined,
    });
  });

  it('returns error state when game-instance data is undefined', () => {
    const useGetGameInstanceQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetGameInstanceQuery");
    const useGetGameInstanceChatQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetGameInstanceChatQuery");

    useGetGameInstanceQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    } as UseGetGameInstanceQueryResultT);
    useGetGameInstanceChatQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {},
      refetch: jest.fn(),
    } as UseGetGameInstanceChatQueryResultT);

    const { result } = renderHook(() => useGameInstanceModel("giid-1"));

    expect(result.current).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: "appError:invalidResponse",
    });
  });

  it('returns error state when game-instance chat data is undefined', () => {
    const useGetGameInstanceQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetGameInstanceQuery");
    const useGetGameInstanceChatQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetGameInstanceChatQuery");

    useGetGameInstanceQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {},
      refetch: jest.fn(),
    } as UseGetGameInstanceQueryResultT);
    useGetGameInstanceChatQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    } as UseGetGameInstanceChatQueryResultT);

    const { result } = renderHook(() => useGameInstanceModel("giid-1"));

    expect(result.current).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: "appError:invalidResponse",
    });
  });

  it('returns data', () => {
    const useGetGameInstanceQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetGameInstanceQuery");
    const useGetGameInstanceChatQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetGameInstanceChatQuery");

    const gameInstanceExposedInfo: GameInstanceExposedInfoT = {
      gameInstanceId: "giid-1",
    } as GameInstanceExposedInfoT;
    const gameInstanceResponse: GetGameInstanceResponseT = {
      gameInstanceExposedInfo: gameInstanceExposedInfo,
    }
    const gameInstanceChatResponse: GetGameInstanceChatResponseT = {
      chatMessages: [],
    }
    useGetGameInstanceQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: gameInstanceResponse,
      refetch: jest.fn(),
    } as UseGetGameInstanceQueryResultT);
    useGetGameInstanceChatQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: gameInstanceChatResponse,
      refetch: jest.fn(),
    } as UseGetGameInstanceChatQueryResultT);

    const { result } = renderHook(() => useGameInstanceModel("giid-1"));

    expect(result.current).toEqual({
      isLoading: false,
      isError: false,
      data: {
        gameInstanceExposedInfo: gameInstanceResponse.gameInstanceExposedInfo,
        gameInstanceChatMessages: gameInstanceChatResponse.chatMessages,
      },
    });
  });
});
