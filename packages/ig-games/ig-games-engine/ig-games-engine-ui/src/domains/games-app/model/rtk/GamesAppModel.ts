
import { extractAppErrorCodeFromUnknownObject, type ModelT } from '@ig/app-engine-ui';
import type { MinimalPublicGameConfigT } from '@ig/games-engine-models';
import { useGetMinimalPublicGameConfigsQuery } from './GamesAppRtkApi';

export type GamesAppModelT = ModelT<{ minimalPublicGameConfigs: MinimalPublicGameConfigT[] }>;

export const useGamesAppModel = (): GamesAppModelT => {
  const {
    isLoading,
    isError,
    error,
    data: getMinimalPublicGameConfigsResponse
  } = useGetMinimalPublicGameConfigsQuery();

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
  } else if (getMinimalPublicGameConfigsResponse === undefined) {
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
      minimalPublicGameConfigs: getMinimalPublicGameConfigsResponse.minimalPublicGameConfigs,
    }
  }
}
