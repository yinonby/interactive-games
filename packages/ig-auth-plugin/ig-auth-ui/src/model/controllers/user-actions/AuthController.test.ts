
import type { AccountIdT } from '@ig/app-engine-models';
import { renderHook } from '@testing-library/react-native';
import * as AuthRtkApi from '../../rtk/AuthRtkApi';
import { useAuthController } from './AuthController';

describe('AuthController', () => {
  describe('useAuthController', () => {
    it('calls guestLogin, fails', async () => {
      const useGuestLoginMutationSpy = jest.spyOn(AuthRtkApi, 'useGuestLoginMutation');
      const guestLoginMock = jest.fn().mockResolvedValue({ error: {} });

      useGuestLoginMutationSpy.mockReturnValue(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [guestLoginMock, jest.fn() as any]
      );

      const { result } = renderHook(() => useAuthController());

      const nickname = 'Jim Carrey';
      await expect(result.current.onGuestLogin(nickname)).rejects.toThrow();

      expect(guestLoginMock).toHaveBeenCalledWith({ nickname });
    });

    it('calls guestLogin, succeeds', async () => {
      const useGuestLoginMutationSpy = jest.spyOn(AuthRtkApi, 'useGuestLoginMutation');
      const guestLoginMock = jest.fn().mockResolvedValue({ data: { guestLoginResult: { authId: 'ACCOUNT1' }}});

      useGuestLoginMutationSpy.mockReturnValue(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [guestLoginMock, jest.fn() as any]
      );

      const { result } = renderHook(() => useAuthController());

      const nickname = 'Jim Carrey';
      const accountId: AccountIdT = await result.current.onGuestLogin(nickname);

      expect(guestLoginMock).toHaveBeenCalledWith({ nickname });
      expect(accountId).toEqual('ACCOUNT1');
    });
  });
});
