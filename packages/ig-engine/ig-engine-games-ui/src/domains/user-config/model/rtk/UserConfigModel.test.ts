
import type { UserConfigT } from "@ig/engine-models";
import { renderHook } from '@testing-library/react-native';
import { useUserConfigModel } from './UserConfigModel';
import { useGetUserConfigQuery, type UseGetUserConfigQueryResultT } from './UserConfigRtkApi';

jest.mock('./UserConfigRtkApi');

const mockedUseGetUserConfigQuery =
  useGetUserConfigQuery as jest.MockedFunction<typeof useGetUserConfigQuery>;

describe('UserConfigModel', () => {
  it('returns loading state when query is loading', () => {
    mockedUseGetUserConfigQuery.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    } as UseGetUserConfigQueryResultT);

    const { result } = renderHook(() => useUserConfigModel());

    expect(result.current).toEqual({
      isLoading: true,
      isError: false,
      data: undefined,
    });
  });

  it('returns error state when query has error', () => {
    mockedUseGetUserConfigQuery.mockReturnValue({
      isLoading: false,
      isError: true,
      error: { appErrCode: "apiError:server" },
      refetch: jest.fn(),
    } as UseGetUserConfigQueryResultT);

    const { result } = renderHook(() => useUserConfigModel());

    expect(result.current).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: "apiError:server",
      data: undefined,
    });
  });

  it('returns error state when data is undefined', () => {
    mockedUseGetUserConfigQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    } as UseGetUserConfigQueryResultT);

    const { result } = renderHook(() => useUserConfigModel());

    expect(result.current).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: "appError:invalidResponse",
    });
  });

  it('returns data', () => {
    const userConfig: UserConfigT = {
      userId: "user-1",
      username: "user a",
      minimalGameInstanceExposedInfos: [],
    }

    mockedUseGetUserConfigQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        userConfig: userConfig,
      },
      refetch: jest.fn(),
    } as UseGetUserConfigQueryResultT);

    const { result } = renderHook(() => useUserConfigModel());

    expect(result.current).toEqual({
      isLoading: false,
      isError: false,
      data: userConfig,
    });
  });
});
