
import { extractAppErrorCodeFromUnknownObject, type ModelT } from '@ig/app-engine-ui';
import type { MinimalPublicGameConfigT } from '@ig/games-engine-models';
import { useGetMinimalPublicGameConfigsQuery } from './GamesAppRtkApi';

export type GamesAppModelT = ModelT<{ minimalPublicGameConfigs: MinimalPublicGameConfigT[] }>;

export const useGamesAppModel = (): GamesAppModelT => {
  const {
    isUninitialized,
    isLoading,
    isError,
    error,
    data: getMinimalPublicGameConfigsResponse
  } = useGetMinimalPublicGameConfigsQuery();

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
      minimalPublicGameConfigs: getMinimalPublicGameConfigsResponse.minimalPublicGameConfigs,
    }
  }
}
