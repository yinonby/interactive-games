
import { renderHook } from '@testing-library/react-native';
import type { AppConfigT, GetAppConfigResponseT } from '../../../../../ig-app-engine-models';
import { useAppConfigModel } from './AppConfigModel';
import * as AppRtkApi from './AppRtkApi';

describe("useAppConfigModel", () => {
  const spy_useGetAppConfigQuery = jest.spyOn(AppRtkApi, 'useGetAppConfigQuery');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls hooks with correct args', () => {
    spy_useGetAppConfigQuery.mockReturnValue({
      isLoading: true,
      refetch: jest.fn(),
    });

    renderHook(() => useAppConfigModel());

    // verify
    expect(spy_useGetAppConfigQuery).toHaveBeenCalled();
  });

  it("returns error when query returns uninitialized (unexpected)", () => {
    spy_useGetAppConfigQuery.mockReturnValue({
      isUninitialized: true,
      refetch: jest.fn(),
    });

    expect(useAppConfigModel()).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: "appError:unknown",
    });
  });

  it("returns loading state when query is loading", () => {
    spy_useGetAppConfigQuery.mockReturnValue({
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
    spy_useGetAppConfigQuery.mockReturnValue({
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

  it("returns data when query succeeds", () => {
    const mockedResult: GetAppConfigResponseT = {
      appConfig: {} as AppConfigT,
    };
    spy_useGetAppConfigQuery.mockReturnValue({
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