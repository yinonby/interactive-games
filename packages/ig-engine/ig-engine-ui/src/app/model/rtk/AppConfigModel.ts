
import type { AppConfigT } from '@ig/engine-models';
import { extractAppErrorCodeFromUnknownObject, useGetAppConfigQuery, type ModelT } from "@ig/engine-ui";

export type AppConfigModelT = ModelT<{ appConfig: AppConfigT }>;

export const useAppConfigModel = (): AppConfigModelT => {
  const { isLoading, isError, error, data: appConfigResponse } = useGetAppConfigQuery();

  if (isLoading) {
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
  } else if (appConfigResponse === undefined) {
    return {
      isLoading: false,
      isError: true,
      appErrCode: "appError:invalidResponse",
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
