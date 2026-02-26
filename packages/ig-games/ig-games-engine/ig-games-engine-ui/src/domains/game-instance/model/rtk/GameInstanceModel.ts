
import { extractAppErrorCodeFromUnknownObject, type ModelT } from '@ig/app-engine-ui';
import { type GameInstanceIdT, type PublicGameInstanceT } from '@ig/games-engine-models';
import { useGetGameInstanceQuery } from './GameInstanceRtkApi';

export type GameInstanceModelDataT = {
  publicGameInstance: PublicGameInstanceT,
};

export type GameInstanceModelT = ModelT<GameInstanceModelDataT>;

export const useGameInstanceModel = (gameInstanceId: GameInstanceIdT): GameInstanceModelT => {
  const {
    isLoading: isGameInstanceLoading,
    isError: isGameInstanceError,
    error: gameInstanceError,
    data: gameInstanceResponse
  } = useGetGameInstanceQuery(gameInstanceId);

  if (isGameInstanceLoading) {
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
  } else if (gameInstanceResponse === undefined) {
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
      publicGameInstance: gameInstanceResponse.publicGameInstance,
    }
  }
}
