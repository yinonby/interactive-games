
import type { GetMinimalPublicGameConfigsResultT } from '@ig/games-engine-models';
import { useGamesAppModel } from './GamesAppModel';
import * as GamesConfigRtkApi from './GamesAppRtkApi';

describe("useGamesAppModel", () => {
  const useGetMinimalPublicGameConfigsQuerySpy = jest.spyOn(GamesConfigRtkApi, 'useGetMinimalPublicGameConfigsQuery');

  beforeEach(() => {
    jest.clearAllMocks();
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

  it("returns error state when data is undefined (no payload)", () => {
    useGetMinimalPublicGameConfigsQuerySpy.mockReturnValue({
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
    const mockedResult: GetMinimalPublicGameConfigsResultT = {
      minimalPublicGameConfigs: [],
    };
    useGetMinimalPublicGameConfigsQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockedResult,
      refetch: jest.fn(),
    });

    expect(useGamesAppModel()).toEqual({
      isLoading: false,
      isError: false,
      data: { minimalPublicGameConfigs: mockedResult.minimalPublicGameConfigs },
    });
  });
});