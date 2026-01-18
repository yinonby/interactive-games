
import type { MinimalGameInstanceExposedInfoT, UserIdT } from "@ig/engine-models";
import { extractAppErrorCodeFromAppRtkError } from "../../../../app/model/rtk/AppRtkUtils";
import type { ModelT } from "../../../../types/ModelTypes";
import { useGetUserConfigQuery } from "./UserConfigRtkApi";

export type UserConfigModelT = ModelT<{
  userId: UserIdT,
  username: string,
  minimalGameInstanceExposedInfos: MinimalGameInstanceExposedInfoT[]
}>;

export const useUserConfigModel = (): UserConfigModelT => {
  const { isLoading, isError, error, data: userConfigResponse } = useGetUserConfigQuery();

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
  } else if (userConfigResponse === undefined) {
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
      userId: userConfigResponse.userConfig.userId,
      username: userConfigResponse.userConfig.username,
      minimalGameInstanceExposedInfos: userConfigResponse.userConfig.minimalGameInstanceExposedInfos,
    },
  }
}
