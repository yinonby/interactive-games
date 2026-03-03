
import { renderHook } from '@testing-library/react-native';
import * as GameConfigRtkApiModule from './GameConfigRtkApi';
import { useGameConfigsModel } from './GameConfigsModel';

jest.mock('../../../game-instance/model/rtk/GameInstanceRtkApi');

const gameConfigIds = ['GC1'];

describe('GameConfigsModel', () => {
  const spy_useGetPublicGameConfigsQuery = jest.spyOn(GameConfigRtkApiModule, 'useGetPublicGameConfigsQuery');

  beforeAll(() => {
    jest.clearAllMocks();
  });

  it('calls hooks with correct args', () => {
    spy_useGetPublicGameConfigsQuery.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    });

    renderHook(() => useGameConfigsModel(gameConfigIds));

    // verify
    expect(spy_useGetPublicGameConfigsQuery).toHaveBeenCalledWith(gameConfigIds);
  });

  it('returns loading state when query is loading game configs', () => {
    spy_useGetPublicGameConfigsQuery.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useGameConfigsModel(gameConfigIds));

    expect(result.current).toEqual({
      isLoading: true,
      isError: false,
      data: undefined,
    });
  });

  it('returns error state when query has error in game configs', () => {
    spy_useGetPublicGameConfigsQuery.mockReturnValue({
      isLoading: false,
      isError: true,
      error: { appErrCode: 'apiError:server' },
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useGameConfigsModel(gameConfigIds));

    expect(result.current).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: 'apiError:server',
      data: undefined,
    });
  });

  it('returns error state when game configs data is undefined', () => {
    spy_useGetPublicGameConfigsQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useGameConfigsModel(gameConfigIds));

    expect(result.current).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: 'appError:invalidResponse',
    });
  });

  it('returns data', () => {
    spy_useGetPublicGameConfigsQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { publicGameConfigs: 'mock_publicGameConfigs' },
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useGameConfigsModel(gameConfigIds));

    expect(result.current).toEqual({
      isLoading: false,
      isError: false,
      data: {
        publicGameConfigs: 'mock_publicGameConfigs',
      },
    });
  });
});
