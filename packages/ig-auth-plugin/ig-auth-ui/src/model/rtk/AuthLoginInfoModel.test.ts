
import { renderHook } from '@testing-library/react-native';
import { useAuthLoginInfoModel } from './AuthLoginInfoModel';
import * as AuthRtkApiModule from './AuthRtkApi';

describe('GameConfigModel', () => {
  const spy_useGetLoginInfoQuery =
    jest.spyOn(AuthRtkApiModule, 'useGetLoginInfoQuery');

  beforeAll(() => {
    jest.clearAllMocks();
  });

  it('calls hooks with correct args', () => {
    spy_useGetLoginInfoQuery.mockReturnValue({
      isLoading: true,
      refetch: jest.fn(),
    });

    renderHook(() => useAuthLoginInfoModel());

    // verify
    expect(spy_useGetLoginInfoQuery).toHaveBeenCalledWith();
  });

  it("returns error when query returns uninitialized (unexpected)", () => {
    spy_useGetLoginInfoQuery.mockReturnValue({
      isUninitialized: true,
      refetch: jest.fn(),
    });

    expect(useAuthLoginInfoModel()).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: "appError:unknown",
    });
  });

  it('returns loading state when query is loading', () => {
    spy_useGetLoginInfoQuery.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useAuthLoginInfoModel());

    expect(result.current).toEqual({
      isLoading: true,
      isError: false,
      data: undefined,
    });
  });

  it('returns error state when query has error', () => {
    spy_useGetLoginInfoQuery.mockReturnValue({
      isLoading: false,
      isError: true,
      error: { appErrCode: 'apiError:server' },
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useAuthLoginInfoModel());

    expect(result.current).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: 'apiError:server',
      data: undefined,
    });
  });

  it('returns data', () => {
    spy_useGetLoginInfoQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { loginInfo: { authId: 'USER1' }},
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useAuthLoginInfoModel());

    expect(result.current).toEqual({
      isLoading: false,
      isError: false,
      data: {
        authId: 'USER1',
      },
    });
  });
});
