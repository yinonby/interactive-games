
import { renderHook } from '@testing-library/react-native';
import * as GameInstanceRtkApiModule from '../../../game-instance/model/rtk/GameInstanceRtkApi';
import { useGameConfigModel } from './GameConfigModel';
import * as GameConfigRtkApiModule from './GameConfigRtkApi';

jest.mock('../../../game-instance/model/rtk/GameInstanceRtkApi');

const gameConfigId1 = 'giid-1';

describe('GameConfigModel', () => {
  const spy_useGetPublicGameConfigQuery =
    jest.spyOn(GameConfigRtkApiModule, 'useGetPublicGameConfigQuery');
  const spy_useGetGameInstanceIdsForGameConfigQuery =
    jest.spyOn(GameInstanceRtkApiModule, 'useGetGameInstanceIdsForGameConfigQuery');

  beforeAll(() => {
    jest.clearAllMocks();
  });

  it('calls hooks with correct args', () => {
    spy_useGetPublicGameConfigQuery.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    });
    spy_useGetGameInstanceIdsForGameConfigQuery.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    });

    renderHook(() => useGameConfigModel(gameConfigId1));

    // verify
    expect(spy_useGetPublicGameConfigQuery).toHaveBeenCalledWith(gameConfigId1);
    expect(spy_useGetGameInstanceIdsForGameConfigQuery).toHaveBeenCalledWith(gameConfigId1);
  });

  it('returns loading state when query is loading game config', () => {
    spy_useGetPublicGameConfigQuery.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    });
    spy_useGetGameInstanceIdsForGameConfigQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useGameConfigModel(gameConfigId1));

    expect(result.current).toEqual({
      isLoading: true,
      isError: false,
      data: undefined,
    });
  });

  it('returns loading state when query is loading game instance ids', () => {
    spy_useGetPublicGameConfigQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    });
    spy_useGetGameInstanceIdsForGameConfigQuery.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useGameConfigModel(gameConfigId1));

    expect(result.current).toEqual({
      isLoading: true,
      isError: false,
      data: undefined,
    });
  });

  it('returns error state when query has error in game config', () => {
    spy_useGetPublicGameConfigQuery.mockReturnValue({
      isLoading: false,
      isError: true,
      error: { appErrCode: 'apiError:server' },
      refetch: jest.fn(),
    });
    spy_useGetGameInstanceIdsForGameConfigQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useGameConfigModel(gameConfigId1));

    expect(result.current).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: 'apiError:server',
      data: undefined,
    });
  });

  it('returns error state when query has error in game instance ids', () => {
    spy_useGetPublicGameConfigQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    });
    spy_useGetGameInstanceIdsForGameConfigQuery.mockReturnValue({
      isLoading: false,
      isError: true,
      error: { appErrCode: 'apiError:server' },
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useGameConfigModel(gameConfigId1));

    expect(result.current).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: 'apiError:server',
      data: undefined,
    });
  });

  it('returns error state when game config data is undefined', () => {
    spy_useGetPublicGameConfigQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    });
    spy_useGetGameInstanceIdsForGameConfigQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { gameInstanceIds: 'mock_gameInstanceIds' },
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useGameConfigModel(gameConfigId1));

    expect(result.current).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: 'appError:invalidResponse',
    });
  });

  it('returns error state when game instance ids data is undefined', () => {
    spy_useGetPublicGameConfigQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { publicGameConfig: 'mock_publicGameConfig' },
      refetch: jest.fn(),
    });
    spy_useGetGameInstanceIdsForGameConfigQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: undefined,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useGameConfigModel(gameConfigId1));

    expect(result.current).toEqual({
      isLoading: false,
      isError: true,
      appErrCode: 'appError:invalidResponse',
    });
  });

  it('returns data', () => {
    spy_useGetPublicGameConfigQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { publicGameConfig: 'mock_publicGameConfig' },
      refetch: jest.fn(),
    });
    spy_useGetGameInstanceIdsForGameConfigQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { gameInstanceIds: 'mock_gameInstanceIds' },
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useGameConfigModel(gameConfigId1));

    expect(result.current).toEqual({
      isLoading: false,
      isError: false,
      data: {
        publicGameConfig: 'mock_publicGameConfig',
        gameInstanceIds: 'mock_gameInstanceIds',
      },
    });
  });
});
