
import { RnuiErrorBoundary, useRnuiSnackbar, type TestableComponentT } from '@ig/rnui';
import React, { createContext, useContext, useEffect, useState, type PropsWithChildren, type ReactNode } from 'react';
import { AppError, type AppErrorCodeT } from '../../types/AppErrorTypes';
import { useAppLocalization } from '../localization/AppLocalizationProvider';
import { AppErrorPage } from './AppErrorPage';

export const APP_ERROR_HANDLING_DEFAULT_SNACKBAR_DURATION_MS = 5000;
export const APP_ERROR_HANDLING_MAX_HISTORY = 5;

export interface AppErrorHandlingContextT {
  onAppError: (appErrCode: AppErrorCodeT) => void,
  onUnknownError: (error: unknown) => void,
}

export const AppErrorHandlingContext = createContext<AppErrorHandlingContextT | undefined>(undefined);

type AppErrorHandlingProviderPropsT = TestableComponentT & {
  errorDurationMs?: number,
  maxHistory?: number,
};

export const AppErrorHandlingProvider: React.FC<PropsWithChildren<AppErrorHandlingProviderPropsT>> = (props) => {
  const {
    errorDurationMs = APP_ERROR_HANDLING_DEFAULT_SNACKBAR_DURATION_MS,
    maxHistory = APP_ERROR_HANDLING_MAX_HISTORY,
    children
  } = props;
  const { onShowSnackbar } = useRnuiSnackbar();
  const { t } = useAppLocalization()
  // history
  const [requestedAppErrCodes, setRequestedAppErrCodes] = useState<AppErrorCodeT[]>([]);
  const [lastAppErrCodeInfos, setLastAppErrCodeInfos] = useState<{ appErrCode: AppErrorCodeT, ts: number }[]>([]);

  const shouldShowSnackbar = (appErrCode: AppErrorCodeT): boolean => {
    const mostRecentErrCodeInfo = lastAppErrCodeInfos.find(e => e.appErrCode === appErrCode);

    if (mostRecentErrCodeInfo === undefined) {
      // this error code is not in history, handle it
      return true;
    } else {
      // this error is in history, don't display it if it hasn't expired
      const expiryTs = mostRecentErrCodeInfo.ts + errorDurationMs;
      return expiryTs <= Date.now();
    }
  }

  const handleAppError = (appErrCode: AppErrorCodeT): void => {
    setRequestedAppErrCodes(prev => [appErrCode, ...prev]);
    return;
  }

  const handleUnknownError = (error: unknown): void => {
    const appErrCode: AppErrorCodeT = (error instanceof AppError) ? error.appErrCode : 'appError:unknown';
    setRequestedAppErrCodes(prev => [appErrCode, ...prev]);
  }

  useEffect(() => {
    if (requestedAppErrCodes.length) {
      const uniqueErrorCodes = Array.from(new Set(requestedAppErrCodes));
      for (const requestedAppErrCode of uniqueErrorCodes) {
        if (shouldShowSnackbar(requestedAppErrCode)) {
          setLastAppErrCodeInfos(prev => {
            // must push to the top, so that most recent error is first
            const newHistory = [{ appErrCode: requestedAppErrCode, ts: Date.now() }, ...prev].slice(0, maxHistory);
            return newHistory;
          });

          onShowSnackbar({
            message: t(requestedAppErrCode),
            level: 'err',
            durationMs: errorDurationMs,
            withCloseButton: true,
          });
        }
      }

      setRequestedAppErrCodes([]);
    }
  }, [requestedAppErrCodes, lastAppErrCodeInfos, onShowSnackbar]);

  const renderErrorNode = (): ReactNode => {
    return <AppErrorPage testID='AppErrorPage-tid' />;
  }

  const value: AppErrorHandlingContextT = {
    onAppError: handleAppError,
    onUnknownError: handleUnknownError,
  }

  return (
    <AppErrorHandlingContext.Provider value={value}>
      <RnuiErrorBoundary testID='RnuiErrorBoundary-tid' renderErrorNode={renderErrorNode}>
        {children}
      </RnuiErrorBoundary>
    </AppErrorHandlingContext.Provider>
  );
};

export const useAppErrorHandling = (): AppErrorHandlingContextT =>
  useContext(AppErrorHandlingContext) as AppErrorHandlingContextT;
