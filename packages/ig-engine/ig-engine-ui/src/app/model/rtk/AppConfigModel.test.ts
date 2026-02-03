
import type { AppConfigT, GetAppConfigResponseT } from '@ig/engine-models';
import { useAppConfigModel } from "./AppConfigModel";
import * as AppRtkApi from "./AppRtkApi";

describe("useAppConfigModel", () => {
  const useGetAppConfigQuerySpy = jest.spyOn(AppRtkApi, 'useGetAppConfigQuery');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns loading state when query is loading", () => {
    useGetAppConfigQuerySpy.mockReturnValue({
      isLoading: true,
      isError: false,
      refetch: jest.fn(),
    });

    expect(useAppConfigModel()).toEqual({
      isLoading: true,
      isError: false,
    });
  });

  it("returns error state when query reports an error", () => {
    useGetAppConfigQuerySpy.mockReturnValue({
      isLoading: false,
      isError: true,
      error: { appErrCode: "apiError:server" },
      refetch: jest.fn(),
    });

    expect(useAppConfigModel()).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: "apiError:server",
    });
  });

  it("returns error state when data is undefined (no payload)", () => {
    useGetAppConfigQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    expect(useAppConfigModel()).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: "appError:invalidResponse",
    });
  });

  it("returns data when query succeeds", () => {
    const mockedResult: GetAppConfigResponseT = {
      appConfig: {} as AppConfigT,
    };
    useGetAppConfigQuerySpy.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockedResult,
      refetch: jest.fn(),
    });

    expect(useAppConfigModel()).toEqual({
      isLoading: false,
      isError: false,
      data: { appConfig: mockedResult.appConfig },
    });
  });
});