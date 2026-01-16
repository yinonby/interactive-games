
import type { MinimalGameInstanceExposedInfoT, UserIdT } from "@ig/engine-models";
import type { ModelWithDataT, ModelWithoutDataT } from "../../../../types/ModelTypes";
import { useGetUserConfigQuery } from "./UserConfigRtkApi";

export type UserConfigModelT = ModelWithoutDataT | ModelWithDataT<{
  userId: UserIdT,
  username: string,
  minimalGameInstanceExposedInfos: MinimalGameInstanceExposedInfoT[]
}>;

export const useUserConfigModel = (): UserConfigModelT => {
  const { isLoading, isError, data: userConfigResponse } = useGetUserConfigQuery();

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
  } else if (userConfigResponse === undefined) {
    return {
      isLoading: false,
      isError: true,
    }
  }

  return {
    isLoading: false,
    isError: false,
    data: {
      userId: userConfigResponse.userConfig.userId,
      username: userConfigResponse.userConfig.username,
      minimalGameInstanceExposedInfos: userConfigResponse.userConfig.minimalGameInstanceExposedInfos,
    },
  }
}
