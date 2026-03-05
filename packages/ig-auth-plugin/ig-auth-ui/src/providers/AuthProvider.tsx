
import type { AccountIdT } from '@ig/app-engine-models';
import { RnuiActivityIndicator } from '@ig/rnui';
import type { LoggerAdapter } from '@ig/utils';
import React, { createContext, useContext, useEffect, type PropsWithChildren } from 'react';
import { AuthLoginView } from '../components/AuthLoginView';
import { useAuthLoginInfoModel } from '../model/rtk/AuthLoginInfoModel';

export interface AuthContextT {
  curAuthId: AccountIdT,
}

const AuthContext = createContext<AuthContextT | undefined>(undefined);

export type AuthProviderPropsT = {
  logger: LoggerAdapter,
  onUnknownError: (error: unknown) => void,
}

export const AuthProvider: React.FC<PropsWithChildren<AuthProviderPropsT>> = (props) => {
  const { onUnknownError, children } = props;
  const { isLoading, isError, appErrCode, data } = useAuthLoginInfoModel();

  useEffect(() => {
    if (isError) {
      onUnknownError(appErrCode);
    }
  }, []);

  if (isLoading) {
    return <RnuiActivityIndicator testID="RnuiActivityIndicator-tid" size="large" />;
  } else if (isError) {
    return null;
  } else if (!data.authId) {
    return <AuthLoginView testID='AuthLoginView-tid' />;
  }

  const context: AuthContextT = {
    curAuthId: data.authId,
  }

  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextT => useContext(AuthContext) as AuthContextT;
