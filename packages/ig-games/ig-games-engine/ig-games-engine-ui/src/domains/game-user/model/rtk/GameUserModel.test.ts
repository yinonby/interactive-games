
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
  it('calls hooks with correct args', () => {
    const spy_useGetPublicGameUserQuery = jest.spyOn(GameUserRtkApi, 'useGetPublicGameUserQuery');

    spy_useGetPublicGameUserQuery.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    });

    renderHook(() => useGameUserModel());

    // verify
    expect(spy_useGetPublicGameUserQuery).toHaveBeenCalled();
  });

  it('returns loading state when query is loading game-instance', () => {
    const spy_useGetPublicGameUserQuery = jest.spyOn(GameUserRtkApi, 'useGetPublicGameUserQuery');

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
    const spy_useGetPublicGameUserQuery = jest.spyOn(GameUserRtkApi, 'useGetPublicGameUserQuery');

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

  it('returns error state when game-instance data is undefined', () => {
    const spy_useGetPublicGameUserQuery = jest.spyOn(GameUserRtkApi, 'useGetPublicGameUserQuery');

    spy_useGetPublicGameUserQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useGameUserModel());

    expect(result.current).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: 'appError:invalidResponse',
    });
  });

  it('returns data', () => {
    const spy_useGetPublicGameUserQuery = jest.spyOn(GameUserRtkApi, 'useGetPublicGameUserQuery');

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
