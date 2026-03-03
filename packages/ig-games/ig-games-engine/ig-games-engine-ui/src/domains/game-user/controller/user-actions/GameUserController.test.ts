
import { act, renderHook } from '@testing-library/react-native';
import * as GameUserRtkApi from '../../model/rtk/GameUserRtkApi';
import { useGameUserController } from './GameUserController';

jest.mock('../../model/rtk/GameUserRtkApi');

describe('useGameUserController', () => {
  const spy_useAddGameConfigIdMutation = jest.spyOn(GameUserRtkApi, 'useAddGameConfigIdMutation');

  beforeAll(() => {
    jest.clearAllMocks();

    spy_useAddGameConfigIdMutation.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [jest.fn(), jest.fn() as any]
    );
  });

  describe('addGameConfigId', () => {
    it('calls addGameConfigId with the provided data', async () => {
      const mock_addGameConfigId = jest.fn().mockResolvedValue({ data: {
        addGameConfigIdResult: {
          gameUserId: 'USER1'
        }
     }});

      spy_useAddGameConfigIdMutation.mockReturnValue(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [mock_addGameConfigId, jest.fn() as any]
      );

      const { result } = renderHook(() => useGameUserController());

      await act(async () => {
        await result.current.onAddGameConfigId('GC1');
      });

      expect(mock_addGameConfigId).toHaveBeenCalledTimes(1);
      expect(mock_addGameConfigId).toHaveBeenCalledWith({
        gameConfigId: 'GC1',
      });
    });

    it('handles error thrown by addGameConfigId', async () => {
      const mock_addGameConfigId = jest.fn().mockResolvedValue({ error: {} });

      spy_useAddGameConfigIdMutation.mockReturnValue(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [mock_addGameConfigId, jest.fn() as any]
      );

      const { result } = renderHook(() => useGameUserController());

      // verify throws
      await expect(result.current.onAddGameConfigId('GC1')).rejects.toThrow();

      // verify calls
      expect(mock_addGameConfigId).toHaveBeenCalledTimes(1);
    });
  });
});
