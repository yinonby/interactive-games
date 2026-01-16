
import type { MinimalGameConfigT } from "@ig/engine-models";
import type { ModelWithDataT, ModelWithoutDataT } from "../../../types/ModelTypes";
import { useGetAppConfigQuery } from "./AppRtkApi";

export type AppConfigModelT = ModelWithoutDataT | ModelWithDataT<{
  availableMinimalGameConfigs: MinimalGameConfigT[],
}>;

export const useAppConfigModel = (): AppConfigModelT => {
  const { isLoading, isError, data: appConfigResponse } = useGetAppConfigQuery();

  if (isLoading) {
    return {
      isLoading: true,
      isError: false,
    }
  } else if (isError) {
    return {
      isLoading: false,
      isError: true,
    }
  } else if (appConfigResponse === undefined) {
    return {
      isLoading: false,
      isError: true,
    }
  }

  return {
    isLoading: false,
    isError: false,
    data: appConfigResponse,
  }
}
