
import { extractAppErrorCodeFromUnknownObject, type ModelT } from '@ig/app-engine-ui';
import type { MinimalGameInfoT } from '@ig/games-engine-models';
import { useGetMinimalGameInfosQuery } from './GamesAppRtkApi';

export type GamesAppModelT = ModelT<{ minimalGameInfos: MinimalGameInfoT[] }>;

export const useGamesAppModel = (): GamesAppModelT => {
  const { isLoading, isError, error, data: getMinimalGameInfosResponse } = useGetMinimalGameInfosQuery();

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
  } else if (getMinimalGameInfosResponse === undefined) {
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
      minimalGameInfos: getMinimalGameInfosResponse.minimalGameInfos,
    }
  }
}
