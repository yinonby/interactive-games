
import type { MinimalGameConfigT } from "@ig/engine-models";
import { extractAppErrorCodeFromAppRtkError } from "../../../../app/model/rtk/AppRtkUtils";
import type { ModelT } from "../../../../types/ModelTypes";
import { useGetGamesConfigQuery } from "./GamesConfigRtkApi";

export type GamesConfigModelT = ModelT<{
  availableMinimalGameConfigs: MinimalGameConfigT[],
}>;

export const useGamesConfigModel = (): GamesConfigModelT => {
  const { isLoading, isError, error, data: gamesConfigResponse } = useGetGamesConfigQuery();

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
  } else if (gamesConfigResponse === undefined) {
    return {
      isLoading: false,
      isError: true,
      appErrCode: "appError:invalidResponse",
    }
  }

  return {
    isLoading: false,
    isError: false,
    data: gamesConfigResponse,
  }
}
