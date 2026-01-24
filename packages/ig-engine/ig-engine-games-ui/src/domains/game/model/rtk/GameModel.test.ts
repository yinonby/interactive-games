
import type {
  GetGameInstancesResponseT
} from '@ig/engine-models';
import { renderHook } from '@testing-library/react-native';
import { useGameModel } from './GameModel';
import type { UseGetGameInstancesQueryResultT } from './GameRtkApi';
import * as GameRtkApi from './GameRtkApi';

jest.mock('./GameRtkApi');

describe('GameInstanceModel', () => {
  it('returns loading state when query is loading game-instances', () => {
    const useGetGameInstancesQuerySpy = jest.spyOn(GameRtkApi, 'useGetGameInstancesQuery');

    useGetGameInstancesQuerySpy.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    } as UseGetGameInstancesQueryResultT);

    const { result } = renderHook(() => useGameModel('giid-1'));

    expect(result.current).toEqual({
      isLoading: true,
      isError: false,
      data: undefined,
    });
  });

  it('returns error state when query has error in game-instances', () => {
    const useGetGameInstancesQuerySpy = jest.spyOn(GameRtkApi, 'useGetGameInstancesQuery');

    useGetGameInstancesQuerySpy.mockReturnValue({
      isLoading: false,
      isError: true,
      error: { appErrCode: 'apiError:server' },
      refetch: jest.fn(),
    } as UseGetGameInstancesQueryResultT);

    const { result } = renderHook(() => useGameModel('giid-1'));

    expect(result.current).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: 'apiError:server',
      data: undefined,
    });
  });

  it('returns error state when game-instances data is undefined', () => {
    const useGetGameInstancesQuerySpy = jest.spyOn(GameRtkApi, 'useGetGameInstancesQuery');

    useGetGameInstancesQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    } as UseGetGameInstancesQueryResultT);

    const { result } = renderHook(() => useGameModel('giid-1'));

    expect(result.current).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: 'appError:invalidResponse',
    });
  });

  it('returns data', () => {
    const useGetGameInstancesQuerySpy = jest.spyOn(GameRtkApi, 'useGetGameInstancesQuery');

    const gameInstanceResponse: GetGameInstancesResponseT = {
      gameInstanceIds: ['giid-1'],
    }
    useGetGameInstancesQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: gameInstanceResponse,
      refetch: jest.fn(),
    } as UseGetGameInstancesQueryResultT);

    const { result } = renderHook(() => useGameModel('giid-1'));

    expect(result.current).toEqual({
      isLoading: false,
      isError: false,
      data: {
        gameInstanceIds: ['giid-1'],
      },
    });
  });
});
