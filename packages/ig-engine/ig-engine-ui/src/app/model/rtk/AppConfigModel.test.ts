
import { useAppConfigModel } from "./AppConfigModel";
import { useGetAppConfigQuery } from "./AppRtkApi";

jest.mock("./AppRtkApi", () => ({ useGetAppConfigQuery: jest.fn() }));

const mockedUseGetAppConfigQuery = useGetAppConfigQuery as unknown as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("useAppConfigModel", () => {
  it("returns loading state when query is loading", () => {
    mockedUseGetAppConfigQuery.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
    });

    expect(useAppConfigModel()).toEqual({
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

    expect(useAppConfigModel()).toEqual({
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

    expect(useAppConfigModel()).toEqual({
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

    expect(useAppConfigModel()).toEqual({
      isLoading: false,
      isError: false,
      data: fakeData,
    });
  });
});