
import type { MinimalGameConfigT } from "@ig/engine-models";
import { extractAppErrorCodeFromAppRtkError } from "../../../app/model/rtk/AppRtkUtils";
import type { ModelT } from "../../../types/ModelTypes";
import { useGetAppConfigQuery } from "./AppRtkApi";

export type AppConfigModelT = ModelT<{
  availableMinimalGameConfigs: MinimalGameConfigT[],
}>;

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
      appErrCode: extractAppErrorCodeFromAppRtkError(error),
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
    data: appConfigResponse,
  }
}
