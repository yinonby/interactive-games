
import { useAppErrorHandling, type AppErrorCodeT } from '@ig/app-engine-ui';
import { RnuiActivityIndicator, type TestableComponentT } from '@ig/rnui';
import React, { useEffect, type FC } from 'react';

export type ModelLoadingViewPropsT = TestableComponentT & ({
  isLoading: boolean,
  appErrCode: AppErrorCodeT | null,
});

export const ModelLoadingView: FC<ModelLoadingViewPropsT> = (props) => {
  const {
    isLoading,
    appErrCode,
  } = props;
  const { onAppError } = useAppErrorHandling();

  useEffect(() => {
    if (appErrCode) {
      onAppError(appErrCode);
    }
  }, [onAppError, appErrCode]);

  if (isLoading) {
    return <RnuiActivityIndicator testID="RnuiActivityIndicator-tid" size="large"/>;
  }
  return null;
};
