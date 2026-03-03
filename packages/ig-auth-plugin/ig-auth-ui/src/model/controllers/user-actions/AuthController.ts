
import type { AccountIdT } from '@ig/app-engine-models';
import { AppError, extractAppErrorCodeFromUnknownObject } from '@ig/app-engine-ui';
import { useGuestLoginMutation } from '../../rtk/AuthRtkApi';

export type AuthControllerT = {
  onGuestLogin: (nickname: string) => Promise<AccountIdT>,
}

export function useAuthController(): AuthControllerT {
  const [
    guestLogin,
  ] = useGuestLoginMutation();

  const handleGuestLogin = async (nickname: string): Promise<AccountIdT> => {
    const { error, data } = await guestLogin({ nickname });
    if (error !== undefined) {
      throw new AppError(extractAppErrorCodeFromUnknownObject(error));
    }
    return data.guestLoginResult.authId as AccountIdT;
  };

  return {
    onGuestLogin: handleGuestLogin,
  }
}
