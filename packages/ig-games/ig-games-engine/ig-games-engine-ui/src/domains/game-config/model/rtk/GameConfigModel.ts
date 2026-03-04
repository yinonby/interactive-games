
import { extractAppErrorCodeFromUnknownObject, type ModelT } from '@ig/app-engine-ui';
import type { GameConfigIdT, GameInstanceIdT, PublicGameConfigT } from '@ig/games-engine-models';
import { useGetGameInstanceIdsForGameConfigQuery } from '../../../game-instance/model/rtk/GameInstanceRtkApi';
import { useGetPublicGameConfigQuery } from './GameConfigRtkApi';

export type GameConfigModelDataT = {
  publicGameConfig: PublicGameConfigT,
  gameInstanceIds: GameInstanceIdT[],
};

export type GameConfigModelT = ModelT<GameConfigModelDataT>;

export const useGameConfigModel = (gameConfigId: GameConfigIdT): GameConfigModelT => {
  const {
    isUninitialized: getPublicGameConfig_isUninitialized,
    isLoading: getPublicGameConfig_data_isLoading,
    isError: getPublicGameConfig_isError,
    error: getPublicGameConfig_error,
    data: getPublicGameConfig_data,
  } = useGetPublicGameConfigQuery(gameConfigId);
  const {
    isUninitialized: getGameInstanceIds_isUninitialized,
    isLoading: getGameInstanceIds_isLoading,
    isError: getGameInstanceIds_isError,
    error: getGameInstanceIds_error,
    data: getGameInstanceIds_data,
  } = useGetGameInstanceIdsForGameConfigQuery(gameConfigId);

  if (getPublicGameConfig_isUninitialized || getGameInstanceIds_isUninitialized) {
    // unexpected, query only returns this when using { skip: true }
    return {
      isLoading: false,
      isError: true,
      appErrCode: "appError:unknown",
    }
  } else if (getPublicGameConfig_data_isLoading || getGameInstanceIds_isLoading) {
    return {
      isLoading: true,
      isError: false,
    }
  } else if (getPublicGameConfig_isError) {
    return {
      isLoading: false,
      isError: true,
      appErrCode: extractAppErrorCodeFromUnknownObject(getPublicGameConfig_error),
    }
  } else if (getGameInstanceIds_isError) {
    return {
      isLoading: false,
      isError: true,
      appErrCode: extractAppErrorCodeFromUnknownObject(getGameInstanceIds_error),
    }
  }

  return {
    isLoading: false,
    isError: false,
    data: {
      publicGameConfig: getPublicGameConfig_data.publicGameConfig,
      gameInstanceIds: getGameInstanceIds_data.gameInstanceIds,
    }
  }
}
