
import type { AccountIdT } from '@ig/app-engine-models';
import { renderHook } from '@testing-library/react-native';
import * as AuthRtkApi from '../../rtk/AuthRtkApi';
import { useAuthController } from './AuthController';

describe('AppConfigController', () => {
  describe('useAuthController', () => {
    it('calls guestLogin, fails', async () => {
      const useGuestLoginMutationSpy = jest.spyOn(AuthRtkApi, 'useGuestLoginMutation');
      const guestLoginMock = jest.fn().mockResolvedValue({ error: {} });

      useGuestLoginMutationSpy.mockReturnValue(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [guestLoginMock, jest.fn() as any]
      );

      const { result } = renderHook(() => useAuthController());

      await expect(result.current.onGuestLogin()).rejects.toThrow();

      expect(guestLoginMock).toHaveBeenCalledTimes(1);
      expect(guestLoginMock).toHaveBeenCalled();
    });

    it('calls guestLogin, succeeds', async () => {
      const useGuestLoginMutationSpy = jest.spyOn(AuthRtkApi, 'useGuestLoginMutation');
      const guestLoginMock = jest.fn().mockResolvedValue({ data: { guestLoginResult: { accountId: 'ACCOUNT1' }}});

      useGuestLoginMutationSpy.mockReturnValue(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [guestLoginMock, jest.fn() as any]
      );

      const { result } = renderHook(() => useAuthController());

      const accountId: AccountIdT = await result.current.onGuestLogin();

      expect(guestLoginMock).toHaveBeenCalledTimes(1);
      expect(guestLoginMock).toHaveBeenCalled();
      expect(accountId).toEqual('ACCOUNT1');
    });
  });
});
