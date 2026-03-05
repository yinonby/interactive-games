
import { AppError, extractAppErrorCodeFromUnknownObject } from '@ig/app-engine-ui';
import type { AuthIdT } from '@ig/auth-models';
import { useGuestLoginMutation } from '../../rtk/AuthRtkApi';

export type AuthControllerT = {
  onGuestLogin: (nickname: string) => Promise<AuthIdT>,
}

export function useAuthController(): AuthControllerT {
  const [
    guestLogin,
  ] = useGuestLoginMutation();

  const handleGuestLogin = async (nickname: string): Promise<AuthIdT> => {
    const { error, data } = await guestLogin({ nickname });
    if (error !== undefined) {
      throw new AppError(extractAppErrorCodeFromUnknownObject(error));
    }
    return data.guestLoginResult.authId;
  };

  return {
    onGuestLogin: handleGuestLogin,
  }
}
