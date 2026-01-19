
import { useGamesConfigModel } from "./GamesConfigModel";
import { useGetGamesConfigQuery } from "./GamesConfigRtkApi";

jest.mock("./GamesConfigRtkApi", () => ({ useGetGamesConfigQuery: jest.fn() }));

const mockedUseGetAppConfigQuery = useGetGamesConfigQuery as unknown as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("useGamesConfigModel", () => {
  it("returns loading state when query is loading", () => {
    mockedUseGetAppConfigQuery.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
    });

    expect(useGamesConfigModel()).toEqual({
      isLoading: true,
      isError: false,
    });
  });

  it("returns error state when query reports an error", () => {
    mockedUseGetAppConfigQuery.mockReturnValue({
      isLoading: false,
      isError: true,
      error: { appErrCode: "apiError:server" },
      data: undefined,
    });

    expect(useGamesConfigModel()).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: "apiError:server",
    });
  });

  it("returns error state when data is undefined (no payload)", () => {
    mockedUseGetAppConfigQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: undefined,
    });

    expect(useGamesConfigModel()).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: "appError:invalidResponse",
    });
  });

  it("returns data when query succeeds", () => {
    const fakeData = {
      availableMinimalGameConfigs: [{ id: "g1" }, { id: "g2" }],
    };
    mockedUseGetAppConfigQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: fakeData,
    });

    expect(useGamesConfigModel()).toEqual({
      isLoading: false,
      isError: false,
      data: fakeData,
    });
  });
});