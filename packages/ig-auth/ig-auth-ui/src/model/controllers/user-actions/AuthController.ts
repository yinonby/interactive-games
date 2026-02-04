
import type { UserIdT } from '@ig/app-engine-models';
import { AppError, extractAppErrorCodeFromUnknownObject } from '@ig/app-engine-ui';
import { useGuestLoginMutation } from '../../rtk/AuthRtkApi';

export type AuthControllerT = {
  onGuestLogin: () => Promise<UserIdT>,
}

export function useAuthController(): AuthControllerT {
  const [
    guestLogin,
  ] = useGuestLoginMutation();

  const handleGuestLogin = async (): Promise<UserIdT> => {
    const { error, data } = await guestLogin();
    if (error !== undefined) {
      throw new AppError(extractAppErrorCodeFromUnknownObject(error));
    }
    return data.guestLoginResult.userId;
  };

  return {
    onGuestLogin: handleGuestLogin,
  }
}
