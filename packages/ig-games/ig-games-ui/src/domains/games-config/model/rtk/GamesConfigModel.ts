
import { extractAppErrorCodeFromUnknownObject, type ModelT } from "@ig/engine-ui";
import type { GamesConfigT } from '@ig/games-models';
import { useGetGamesConfigQuery } from "./GamesConfigRtkApi";

export type GamesConfigModelT = ModelT<{ gamesConfig: GamesConfigT }>;

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
      appErrCode: extractAppErrorCodeFromUnknownObject(error),
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
    data: {
      gamesConfig: gamesConfigResponse.gamesConfig,
    }
  }
}
