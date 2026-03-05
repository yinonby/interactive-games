
import { extractAppErrorCodeFromUnknownObject, type ModelT } from '@ig/app-engine-ui';
import type { AuthIdT } from '@ig/auth-models';
import { useGetLoginInfoQuery } from './AuthRtkApi';

export type AuthLoginInfoModelDataT = {
  authId: AuthIdT | null,
};

export type AuthLoginInfoModelT = ModelT<AuthLoginInfoModelDataT>;

export const useAuthLoginInfoModel = (): AuthLoginInfoModelT => {
  const {
    isUninitialized: isUninitialized,
    isLoading: isLoading,
    isError: isError,
    error: error,
    data: data,
  } = useGetLoginInfoQuery();

  if (isUninitialized) {
    // unexpected, query only returns this when using { skip: true }
    return {
      isLoading: false,
      isError: true,
      appErrCode: "appError:unknown",
    }
  } else if (isLoading) {
    return {
      isLoading: true,
      isError: false,
    }
  } else if (isError) {
    return {
      isLoading: false,
      isError: true,
      appErrCode: extractAppErrorCodeFromUnknownObject(error),
    }
  }

  return {
    isLoading: false,
    isError: false,
    data: {
      authId: data.loginInfo.authId,
    }
  }
}
