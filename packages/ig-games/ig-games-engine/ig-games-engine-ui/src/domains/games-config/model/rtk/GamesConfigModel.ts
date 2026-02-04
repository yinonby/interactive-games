
import { extractAppErrorCodeFromUnknownObject, type ModelT } from '@ig/app-engine-ui';
import type { MinimalGameConfigT } from '@ig/games-engine-models';
import { useGetMinimalGameConfigsQuery } from './GamesConfigRtkApi';

export type GamesConfigModelT = ModelT<{ minimalGameConfigs: MinimalGameConfigT[] }>;

export const useGamesConfigModel = (): GamesConfigModelT => {
  const { isLoading, isError, error, data: getMinimalGameConfigsResponse } = useGetMinimalGameConfigsQuery();

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
  } else if (getMinimalGameConfigsResponse === undefined) {
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
      minimalGameConfigs: getMinimalGameConfigsResponse.minimalGameConfigs,
    }
  }
}
