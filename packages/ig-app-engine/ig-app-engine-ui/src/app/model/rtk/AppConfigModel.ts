
import { extractAppErrorCodeFromUnknownObject, useGetAppConfigQuery, type ModelT } from '@ig/app-engine-ui';
import type { AppConfigT } from '../../../../../ig-app-engine-models';

export type AppConfigModelT = ModelT<{ appConfig: AppConfigT }>;

export const useAppConfigModel = (): AppConfigModelT => {
  const { isUninitialized, isLoading, isError, error, data: appConfigResponse } = useGetAppConfigQuery();

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
      appConfig: appConfigResponse.appConfig,
    }
  }
}
