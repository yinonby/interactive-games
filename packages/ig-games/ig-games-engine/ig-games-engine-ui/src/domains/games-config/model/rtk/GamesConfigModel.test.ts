
import type { GetMinimalGameConfigsResultT } from '@ig/games-engine-models';
import { useGamesConfigModel } from './GamesConfigModel';
import * as GamesConfigRtkApi from './GamesConfigRtkApi';

describe("useGamesConfigModel", () => {
  const useGetMinimalGameConfigsQuerySpy = jest.spyOn(GamesConfigRtkApi, 'useGetMinimalGameConfigsQuery');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns loading state when query is loading", () => {
    useGetMinimalGameConfigsQuerySpy.mockReturnValue({
      isLoading: true,
      isError: false,
      refetch: jest.fn(),
    });

    expect(useGamesConfigModel()).toEqual({
      isLoading: true,
      isError: false,
    });
  });

  it("returns error state when query reports an error", () => {
    useGetMinimalGameConfigsQuerySpy.mockReturnValue({
      isLoading: false,
      isError: true,
      error: { appErrCode: "apiError:server" },
      refetch: jest.fn(),
    });

    expect(useGamesConfigModel()).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: "apiError:server",
    });
  });

  it("returns error state when data is undefined (no payload)", () => {
    useGetMinimalGameConfigsQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    expect(useGamesConfigModel()).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: "appError:invalidResponse",
    });
  });

  it("returns data when query succeeds", () => {
    const mockedResult: GetMinimalGameConfigsResultT = {
      minimalGameConfigs: [],
    };
    useGetMinimalGameConfigsQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockedResult,
      refetch: jest.fn(),
    });

    expect(useGamesConfigModel()).toEqual({
      isLoading: false,
      isError: false,
      data: { minimalGameConfigs: mockedResult.minimalGameConfigs },
    });
  });
});