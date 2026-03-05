
import type { AccountIdT } from '@ig/app-engine-models';
import type { AuthIdT } from '@ig/auth-models';
import { RnuiActivityIndicator } from '@ig/rnui';
import type { LoggerAdapter } from '@ig/utils';
import React, { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { useAuthController } from '../model/controllers/user-actions/AuthController';
import { getLocalAccountId, setLocalAccountId } from './AuthUtils';

export interface AuthContextT {
  curAuthId: AccountIdT,
}

const AuthContext = createContext<AuthContextT | undefined>(undefined);

export type AuthProviderPropsT = {
  logger: LoggerAdapter,
  onUnknownError: (error: unknown) => void,
}

export const AuthProvider: React.FC<PropsWithChildren<AuthProviderPropsT>> = (props) => {
  const { logger, onUnknownError, children } = props;
  const { onGuestLogin } = useAuthController();
  const [curAuthId, setCurUserId] = useState("");

  useEffect(() => {
    if (curAuthId === "") {
      logger.info('Detecting curAuthId...');
      const updateCurUserId = async () => {
        const _curUserId: string | null = await getLocalAccountId();

        if (_curUserId !== null) {
          logger.info('Found curAuthId');
          setCurUserId(_curUserId);
        } else {
          logger.info('No curAuthId found, initiating guest login');
          try {
            const nickname = 'Jim Carrey'; // TODO fix this with user input
            const newAuthId: AuthIdT = await onGuestLogin(nickname);
            logger.info('Retrieved user id after a guest login');
            await setLocalAccountId(newAuthId);
            setCurUserId(newAuthId);
          } catch (error: unknown) {
            onUnknownError(error);
          }
        }
      }

      updateCurUserId();
    }
  }, [curAuthId]);

  const value: AuthContextT = {
    curAuthId: curAuthId,
  }

  if (curAuthId === '') return (
    <RnuiActivityIndicator testID='RnuiActivityIndicator-tid'/>
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextT => useContext(AuthContext) as AuthContextT;
