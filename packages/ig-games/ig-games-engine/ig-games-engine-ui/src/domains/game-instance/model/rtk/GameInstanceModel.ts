
import { extractAppErrorCodeFromUnknownObject, type ModelT } from '@ig/app-engine-ui';
import { type GameInstanceIdT, type PublicGameInstanceT } from '@ig/games-engine-models';
import { useGetPublicGameInstanceQuery } from './GameInstanceRtkApi';

export type GameInstanceModelDataT = {
  publicGameInstance: PublicGameInstanceT,
};

export type GameInstanceModelT = ModelT<GameInstanceModelDataT>;

export const useGameInstanceModel = (gameInstanceId: GameInstanceIdT): GameInstanceModelT => {
  const {
    isUninitialized,
    isLoading: isGameInstanceLoading,
    isError: isGameInstanceError,
    error: gameInstanceError,
    data: gameInstanceResponse
  } = useGetPublicGameInstanceQuery(gameInstanceId);

  if (isUninitialized) {
    // unexpected, query only returns this when using { skip: true }
    return {
      isLoading: false,
      isError: true,
      appErrCode: "appError:unknown",
    }
  } else if (isGameInstanceLoading) {
    return {
      isLoading: true,
      isError: false,
    }
  } else if (isGameInstanceError) {
    return {
      isLoading: false,
      isError: true,
      appErrCode: extractAppErrorCodeFromUnknownObject(gameInstanceError),
    }
  }

  return {
    isLoading: false,
    isError: false,
    data: {
      publicGameInstance: gameInstanceResponse.publicGameInstance,
    }
  }
}
