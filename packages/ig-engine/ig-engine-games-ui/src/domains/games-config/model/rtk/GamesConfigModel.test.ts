
import type { GetGamesConfigResponseT } from '@ig/engine-models';
import { useGamesConfigModel } from "./GamesConfigModel";
import * as GamesConfigRtkApi from "./GamesConfigRtkApi";

describe("useGamesConfigModel", () => {
  const useGetGamesConfigQuerySpy = jest.spyOn(GamesConfigRtkApi, 'useGetGamesConfigQuery');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns loading state when query is loading", () => {
    useGetGamesConfigQuerySpy.mockReturnValue({
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
    useGetGamesConfigQuerySpy.mockReturnValue({
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
    useGetGamesConfigQuerySpy.mockReturnValue({
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
    const mockedResponse: GetGamesConfigResponseT = {
      gamesConfig: {
        availableMinimalGameConfigs: [],
      }
    };
    useGetGamesConfigQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockedResponse,
      refetch: jest.fn(),
    });

    expect(useGamesConfigModel()).toEqual({
      isLoading: false,
      isError: false,
      data: { gamesConfig: mockedResponse.gamesConfig },
    });
  });
});