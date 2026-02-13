
import type { AccountIdT } from '@ig/app-engine-models';
import { RnuiActivityIndicator } from '@ig/rnui';
import type { LoggerAdapter } from '@ig/utils';
import React, { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { useAuthController } from '../model/controllers/user-actions/AuthController';
import { getLocalAccountId, setLocalAccountId } from './AuthUtils';

export interface AuthContextT {
  curAccountId: AccountIdT,
}

const AuthContext = createContext<AuthContextT | undefined>(undefined);

export type AuthProviderPropsT = {
  logger: LoggerAdapter,
  onUnknownError: (error: unknown) => void,
}

export const AuthProvider: React.FC<PropsWithChildren<AuthProviderPropsT>> = (props) => {
  const { logger, onUnknownError, children } = props;
  const { onGuestLogin } = useAuthController();
  const [curAccountId, setCurUserId] = useState("");

  useEffect(() => {
    if (curAccountId === "") {
      logger.info('Detecting curAccountId...');
      const updateCurUserId = async () => {
        const _curUserId: string | null = await getLocalAccountId();

        if (_curUserId !== null) {
          logger.info('Found curAccountId');
          setCurUserId(_curUserId);
        } else {
          logger.info('No curAccountId found, initiating guest login');
          try {
            const newUserId = await onGuestLogin();
            logger.info('Retrieved user id after a guest login');
            await setLocalAccountId(newUserId);
            setCurUserId(newUserId);
          } catch (error: unknown) {
            onUnknownError(error);
          }
        }
      }

      updateCurUserId();
    }
  }, [curAccountId]);

  const value: AuthContextT = {
    curAccountId: curAccountId,
  }

  if (curAccountId === '') return (
    <RnuiActivityIndicator testID='RnuiActivityIndicator-tid'/>
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextT => useContext(AuthContext) as AuthContextT;
