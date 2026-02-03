
import type { UserIdT } from '@ig/engine-models';
import type { LoggerAdapter } from '@ig/lib';
import {
  RnuiActivityIndicator
} from "@ig/rnui";
import React, { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { useAuthController } from '../model/controllers/user-actions/AuthController';
import { getLocalUserId, setLocalUserId } from './AuthUtils';

export interface AuthContextT {
  curUserId: UserIdT,
}

const AuthContext = createContext<AuthContextT | undefined>(undefined);

export type AuthProviderPropsT = {
  logger: LoggerAdapter,
  onUnknownError: (error: unknown) => void,
}

export const AuthProvider: React.FC<PropsWithChildren<AuthProviderPropsT>> = (props) => {
  const { logger, onUnknownError, children } = props;
  const { onGuestLogin } = useAuthController();
  const [curUserId, setCurUserId] = useState("");

  useEffect(() => {
    if (curUserId === "") {
      logger.info('Detecting curUserId...');
      const updateCurUserId = async () => {
        const _curUserId: string | null = await getLocalUserId();

        if (_curUserId !== null) {
          logger.info('Found curUserId');
          setCurUserId(_curUserId);
        } else {
          logger.info('No curUserId found, initiating guest login');
          try {
            const newUserId = await onGuestLogin();
            logger.info('Retrieved user id after a guest login');
            await setLocalUserId(newUserId);
            setCurUserId(newUserId);
          } catch (error: unknown) {
            onUnknownError(error);
          }
        }
      }

      updateCurUserId();
    }
  }, [curUserId]);

  const value: AuthContextT = {
    curUserId: curUserId,
  }

  if (curUserId === '') return (
    <RnuiActivityIndicator testID='RnuiActivityIndicator-tid'/>
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextT => useContext(AuthContext) as AuthContextT;
