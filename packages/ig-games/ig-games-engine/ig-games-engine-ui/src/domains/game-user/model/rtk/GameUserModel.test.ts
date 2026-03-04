
import {
  type GetPublicGameUserResultT,
  type PublicGameUserT
} from '@ig/games-engine-models';
import { buildPublicGameUserMock } from '@ig/games-engine-models/test-utils';
import { renderHook } from '@testing-library/react-native';
import { useGameUserModel } from './GameUserModel';
import * as GameUserRtkApi from './GameUserRtkApi';

jest.mock('./GameUserRtkApi');

describe('GameUserModel', () => {
  const spy_useGetPublicGameUserQuery = jest.spyOn(GameUserRtkApi, 'useGetPublicGameUserQuery');

  it('calls hooks with correct args', () => {
    spy_useGetPublicGameUserQuery.mockReturnValue({
      isLoading: true,
      refetch: jest.fn(),
    });

    renderHook(() => useGameUserModel());

    // verify
    expect(spy_useGetPublicGameUserQuery).toHaveBeenCalled();
  });

  it("returns error when query returns uninitialized (unexpected)", () => {
    spy_useGetPublicGameUserQuery.mockReturnValue({
      isUninitialized: true,
      refetch: jest.fn(),
    });

    expect(useGameUserModel()).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: "appError:unknown",
    });
  });

  it('returns loading state when query is loading game-instance', () => {
    spy_useGetPublicGameUserQuery.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useGameUserModel());

    expect(result.current).toEqual({
      isLoading: true,
      isError: false,
      data: undefined,
    });
  });

  it('returns error state when query has error in game-instance', () => {
    spy_useGetPublicGameUserQuery.mockReturnValue({
      isLoading: false,
      isError: true,
      error: { appErrCode: 'apiError:server' },
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useGameUserModel());

    expect(result.current).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: 'apiError:server',
      data: undefined,
    });
  });

  it('returns data', () => {
    const publicGameUser: PublicGameUserT = buildPublicGameUserMock({
      gameUserId: 'USER1',
    });
    const apiResult: GetPublicGameUserResultT = {
      publicGameUser: publicGameUser,
    }
    spy_useGetPublicGameUserQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: apiResult,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useGameUserModel());

    expect(result.current).toEqual({
      isLoading: false,
      isError: false,
      data: {
        publicGameUser: apiResult.publicGameUser,
      },
    });
  });
});
