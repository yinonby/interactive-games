
import type { UserConfigT } from "@/types/ApiRequestTypes";
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
      refetch: jest.fn(),
    } as UseGetUserConfigQueryResultT);

    const { result } = renderHook(() => useUserConfigModel());

    expect(result.current).toEqual({
      isLoading: false,
      isError: true,
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
