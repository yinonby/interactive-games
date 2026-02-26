
import {
  type GetGameInstanceResponseT,
  type PublicGameInstanceT
} from '@ig/games-engine-models';
import { renderHook } from '@testing-library/react-native';
import { useGameInstanceModel } from './GameInstanceModel';
import type { UseGetGameInstanceQueryResultT } from './GameInstanceRtkApi';
import * as GameInstanceRtkApi from './GameInstanceRtkApi';

jest.mock('./GameInstanceRtkApi');

const gameInstanceId1 = 'giid-1';

describe('GameInstanceModel', () => {
  it('calls hooks with correct args', () => {
    const useGetGameInstanceQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetGameInstanceQuery");

    useGetGameInstanceQuerySpy.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    } as UseGetGameInstanceQueryResultT);

    renderHook(() => useGameInstanceModel(gameInstanceId1));

    // verify
    expect(useGetGameInstanceQuerySpy).toHaveBeenCalledWith(gameInstanceId1);
  });

  it('returns loading state when query is loading game-instance', () => {
    const useGetGameInstanceQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetGameInstanceQuery");

    useGetGameInstanceQuerySpy.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    } as UseGetGameInstanceQueryResultT);

    const { result } = renderHook(() => useGameInstanceModel(gameInstanceId1));

    expect(result.current).toEqual({
      isLoading: true,
      isError: false,
      data: undefined,
    });
  });

  it('returns error state when query has error in game-instance', () => {
    const useGetGameInstanceQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetGameInstanceQuery");

    useGetGameInstanceQuerySpy.mockReturnValue({
      isLoading: false,
      isError: true,
      error: { appErrCode: "apiError:server" },
      refetch: jest.fn(),
    } as UseGetGameInstanceQueryResultT);

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

    useGetGameInstanceQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    } as UseGetGameInstanceQueryResultT);

    const { result } = renderHook(() => useGameInstanceModel(gameInstanceId1));

    expect(result.current).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: "appError:invalidResponse",
    });
  });

  it('returns data', () => {
    const useGetGameInstanceQuerySpy = jest.spyOn(GameInstanceRtkApi, "useGetGameInstanceQuery");

    const publicGameInstance: PublicGameInstanceT = {
      gameInstanceId: gameInstanceId1,
    } as PublicGameInstanceT;
    const gameInstanceResponse: GetGameInstanceResponseT = {
      publicGameInstance: publicGameInstance,
    }
    useGetGameInstanceQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: gameInstanceResponse,
      refetch: jest.fn(),
    } as UseGetGameInstanceQueryResultT);

    const { result } = renderHook(() => useGameInstanceModel(gameInstanceId1));

    expect(result.current).toEqual({
      isLoading: false,
      isError: false,
      data: {
        publicGameInstance: gameInstanceResponse.publicGameInstance,
      },
    });
  });
});
