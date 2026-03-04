
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
  const spy_useGetPublicGameInstanceQuery = jest.spyOn(GameInstanceRtkApi, 'useGetPublicGameInstanceQuery');

  it('calls hooks with correct args', () => {
    spy_useGetPublicGameInstanceQuery.mockReturnValue({
      isLoading: true,
      refetch: jest.fn(),
    });

    renderHook(() => useGameInstanceModel(gameInstanceId1));

    // verify
    expect(spy_useGetPublicGameInstanceQuery).toHaveBeenCalledWith(gameInstanceId1);
  });

  it("returns error when query returns uninitialized (unexpected)", () => {
    spy_useGetPublicGameInstanceQuery.mockReturnValue({
      isUninitialized: true,
      refetch: jest.fn(),
    });

    expect(useGameInstanceModel(gameInstanceId1)).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: "appError:unknown",
    });
  });

  it('returns loading state when query is loading game-instance', () => {
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

  it('returns data', () => {
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
