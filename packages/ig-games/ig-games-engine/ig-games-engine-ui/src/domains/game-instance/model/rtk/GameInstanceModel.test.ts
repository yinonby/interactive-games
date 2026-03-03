
import {
  type GetGameInstanceResultT,
  type PublicGameInstanceT
} from '@ig/games-engine-models';
import { buildPublicGameInstanceMock } from '@ig/games-engine-models/test-utils';
import { renderHook } from '@testing-library/react-native';
import { useGameInstanceModel } from './GameInstanceModel';
import * as GameInstanceRtkApi from './GameInstanceRtkApi';

jest.mock('./GameInstanceRtkApi');

const gameInstanceId1 = 'giid-1';

describe('GameInstanceModel', () => {
  it('calls hooks with correct args', () => {
    const spy_useGetPublicGameInstanceQuery = jest.spyOn(GameInstanceRtkApi, 'useGetPublicGameInstanceQuery');

    spy_useGetPublicGameInstanceQuery.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    });

    renderHook(() => useGameInstanceModel(gameInstanceId1));

    // verify
    expect(spy_useGetPublicGameInstanceQuery).toHaveBeenCalledWith(gameInstanceId1);
  });

  it('returns loading state when query is loading game-instance', () => {
    const spy_useGetPublicGameInstanceQuery = jest.spyOn(GameInstanceRtkApi, 'useGetPublicGameInstanceQuery');

    spy_useGetPublicGameInstanceQuery.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useGameInstanceModel(gameInstanceId1));

    expect(result.current).toEqual({
      isLoading: true,
      isError: false,
      data: undefined,
    });
  });

  it('returns error state when query has error in game-instance', () => {
    const spy_useGetPublicGameInstanceQuery = jest.spyOn(GameInstanceRtkApi, 'useGetPublicGameInstanceQuery');

    spy_useGetPublicGameInstanceQuery.mockReturnValue({
      isLoading: false,
      isError: true,
      error: { appErrCode: 'apiError:server' },
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useGameInstanceModel(gameInstanceId1));

    expect(result.current).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: 'apiError:server',
      data: undefined,
    });
  });

  it('returns error state when game-instance data is undefined', () => {
    const spy_useGetPublicGameInstanceQuery = jest.spyOn(GameInstanceRtkApi, 'useGetPublicGameInstanceQuery');

    spy_useGetPublicGameInstanceQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useGameInstanceModel(gameInstanceId1));

    expect(result.current).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: 'appError:invalidResponse',
    });
  });

  it('returns data', () => {
    const spy_useGetPublicGameInstanceQuery = jest.spyOn(GameInstanceRtkApi, 'useGetPublicGameInstanceQuery');

    const publicGameInstance: PublicGameInstanceT = buildPublicGameInstanceMock({
      gameInstanceId: gameInstanceId1,
    });
    const apiResult: GetGameInstanceResultT = {
      publicGameInstance: publicGameInstance,
    }
    spy_useGetPublicGameInstanceQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: apiResult,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useGameInstanceModel(gameInstanceId1));

    expect(result.current).toEqual({
      isLoading: false,
      isError: false,
      data: {
        publicGameInstance: apiResult.publicGameInstance,
      },
    });
  });
});
