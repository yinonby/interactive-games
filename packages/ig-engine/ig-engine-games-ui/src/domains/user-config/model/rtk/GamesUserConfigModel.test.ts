
import type { GamesUserConfigT } from '@ig/engine-models';
import { renderHook } from '@testing-library/react-native';
import { useGamesUserConfigModel } from './GamesUserConfigModel';
import { useGetGamesUserConfigQuery, type UseGetGamesUserConfigQueryResultT } from './GamesUserConfigRtkApi';

jest.mock('./GamesUserConfigRtkApi');

const mockedUseGetUserConfigQuery =
  useGetGamesUserConfigQuery as jest.MockedFunction<typeof useGetGamesUserConfigQuery>;

describe('GamesUserConfigModel', () => {
  it('returns loading state when query is loading', () => {
    mockedUseGetUserConfigQuery.mockReturnValue({
      isLoading: true,
      isError: false,
      refetch: jest.fn(),
    } as UseGetGamesUserConfigQueryResultT);

    const { result } = renderHook(() => useGamesUserConfigModel());

    expect(result.current).toEqual({
      isLoading: true,
      isError: false,
    });
  });

  it('returns error state when query has error', () => {
    mockedUseGetUserConfigQuery.mockReturnValue({
      isLoading: false,
      isError: true,
      error: { appErrCode: "apiError:server" },
      refetch: jest.fn(),
    } as UseGetGamesUserConfigQueryResultT);

    const { result } = renderHook(() => useGamesUserConfigModel());

    expect(result.current).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: "apiError:server",
    });
  });

  it('returns error state when data is undefined', () => {
    mockedUseGetUserConfigQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    } as UseGetGamesUserConfigQueryResultT);

    const { result } = renderHook(() => useGamesUserConfigModel());

    expect(result.current).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: "appError:invalidResponse",
    });
  });

  it('returns data', () => {
    const gamesUserConfig: GamesUserConfigT = {
      minimalGameInstanceExposedInfos: [],
    }

    mockedUseGetUserConfigQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        gamesUserConfig: gamesUserConfig,
      },
      refetch: jest.fn(),
    } as UseGetGamesUserConfigQueryResultT);

    const { result } = renderHook(() => useGamesUserConfigModel());

    expect(result.current).toEqual({
      isLoading: false,
      isError: false,
      data: { gamesUserConfig },
    });
  });
});
