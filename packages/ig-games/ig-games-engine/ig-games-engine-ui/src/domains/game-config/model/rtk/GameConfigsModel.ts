
import { extractAppErrorCodeFromUnknownObject, type ModelT } from '@ig/app-engine-ui';
import type { GameConfigIdT, PublicGameConfigT } from '@ig/games-engine-models';
import { useGetPublicGameConfigsQuery } from './GameConfigRtkApi';

export type GameConfigsModelDataT = {
  publicGameConfigs: PublicGameConfigT[],
};

export type GameConfigsModelT = ModelT<GameConfigsModelDataT>;

export const useGameConfigsModel = (gameConfigIds: GameConfigIdT[]): GameConfigsModelT => {
  const {
    isUninitialized,
    isLoading: getPublicGameConfigs_data_isLoading,
    isError: getPublicGameConfigs_isError,
    error: getPublicGameConfigs_error,
    data: getPublicGameConfigs_data,
  } = useGetPublicGameConfigsQuery(gameConfigIds);

  if (isUninitialized) {
    // unexpected, query only returns this when using { skip: true }
    return {
      isLoading: false,
      isError: true,
      appErrCode: "appError:unknown",
    }
  } else if (getPublicGameConfigs_data_isLoading) {
    return {
      isLoading: true,
      isError: false,
    }
  } else if (getPublicGameConfigs_isError) {
    return {
      isLoading: false,
      isError: true,
      appErrCode: extractAppErrorCodeFromUnknownObject(getPublicGameConfigs_error),
    }
  }

  return {
    isLoading: false,
    isError: false,
    data: {
      publicGameConfigs: getPublicGameConfigs_data.publicGameConfigs,
    }
  }
}
