
import { type ModelT, extractAppErrorCodeFromUnknownObject } from "@ig/engine-app-ui";
import type { GamesUserConfigT } from "@ig/engine-models";
import { useGetGamesUserConfigQuery } from "./GamesUserConfigRtkApi";

export type GamesUserConfigModelT = ModelT<{ gamesUserConfig: GamesUserConfigT }>;

export const useGamesUserConfigModel = (): GamesUserConfigModelT => {
  const { isLoading, isError, error, data: userConfigResponse } = useGetGamesUserConfigQuery();

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
      gamesUserConfig: userConfigResponse.gamesUserConfig,
    },
  }
}
