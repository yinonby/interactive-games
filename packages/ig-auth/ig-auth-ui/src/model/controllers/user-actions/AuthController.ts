
import type { AccountIdT } from '@ig/app-engine-models';
import { AppError, extractAppErrorCodeFromUnknownObject } from '@ig/app-engine-ui';
import { useGuestLoginMutation } from '../../rtk/AuthRtkApi';

export type AuthControllerT = {
  onGuestLogin: () => Promise<AccountIdT>,
}

export function useAuthController(): AuthControllerT {
  const [
    guestLogin,
  ] = useGuestLoginMutation();

  const handleGuestLogin = async (): Promise<AccountIdT> => {
    const { error, data } = await guestLogin();
    if (error !== undefined) {
      throw new AppError(extractAppErrorCodeFromUnknownObject(error));
    }
    return data.guestLoginResult.accountId;
  };

  return {
    onGuestLogin: handleGuestLogin,
  }
}
