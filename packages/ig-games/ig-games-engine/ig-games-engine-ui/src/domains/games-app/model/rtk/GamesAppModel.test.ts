
import type { GetMinimalGameInfosResultT } from '@ig/games-engine-models';
import { useGamesAppModel } from './GamesAppModel';
import * as GamesConfigRtkApi from './GamesAppRtkApi';

describe("useGamesAppModel", () => {
  const useGetMinimalGameInfosQuerySpy = jest.spyOn(GamesConfigRtkApi, 'useGetMinimalGameInfosQuery');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns loading state when query is loading", () => {
    useGetMinimalGameInfosQuerySpy.mockReturnValue({
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
    useGetMinimalGameInfosQuerySpy.mockReturnValue({
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

  it("returns error state when data is undefined (no payload)", () => {
    useGetMinimalGameInfosQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    expect(useGamesAppModel()).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: "appError:invalidResponse",
    });
  });

  it("returns data when query succeeds", () => {
    const mockedResult: GetMinimalGameInfosResultT = {
      minimalGameInfos: [],
    };
    useGetMinimalGameInfosQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockedResult,
      refetch: jest.fn(),
    });

    expect(useGamesAppModel()).toEqual({
      isLoading: false,
      isError: false,
      data: { minimalGameInfos: mockedResult.minimalGameInfos },
    });
  });
});