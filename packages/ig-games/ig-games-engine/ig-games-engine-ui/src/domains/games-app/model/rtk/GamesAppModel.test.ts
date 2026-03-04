
import type { GetMinimalPublicGameConfigsResultT } from '@ig/games-engine-models';
import { renderHook } from '@testing-library/react-native';
import { useGamesAppModel } from './GamesAppModel';
import * as GamesConfigRtkApi from './GamesAppRtkApi';

describe("useGamesAppModel", () => {
  const useGetMinimalPublicGameConfigsQuerySpy = jest.spyOn(GamesConfigRtkApi, 'useGetMinimalPublicGameConfigsQuery');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls hooks with correct args', () => {
    useGetMinimalPublicGameConfigsQuerySpy.mockReturnValue({
      isLoading: true,
      refetch: jest.fn(),
    });

    renderHook(() => useGamesAppModel());

    // verify
    expect(useGetMinimalPublicGameConfigsQuerySpy).toHaveBeenCalled();
  });

  it("returns error when query returns uninitialized (unexpected)", () => {
    useGetMinimalPublicGameConfigsQuerySpy.mockReturnValue({
      isUninitialized: true,
      refetch: jest.fn(),
    });

    expect(useGamesAppModel()).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: "appError:unknown",
    });
  });

  it("returns loading state when query is loading", () => {
    useGetMinimalPublicGameConfigsQuerySpy.mockReturnValue({
      isLoading: true,
      isError: false,
      refetch: jest.fn(),
    });

    expect(useGamesAppModel()).toEqual({
      isLoading: true,
      isError: false,
    });
  });

  it("returns error state when query reports an error", () => {
    useGetMinimalPublicGameConfigsQuerySpy.mockReturnValue({
      isLoading: false,
      isError: true,
      error: { appErrCode: "apiError:server" },
      refetch: jest.fn(),
    });

    expect(useGamesAppModel()).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: "apiError:server",
    });
  });

  it("returns data when query succeeds", () => {
    const apiResult: GetMinimalPublicGameConfigsResultT = {
      minimalPublicGameConfigs: [],
    };
    useGetMinimalPublicGameConfigsQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: apiResult,
      refetch: jest.fn(),
    });

    expect(useGamesAppModel()).toEqual({
      isLoading: false,
      isError: false,
      data: { minimalPublicGameConfigs: apiResult.minimalPublicGameConfigs },
    });
  });
});