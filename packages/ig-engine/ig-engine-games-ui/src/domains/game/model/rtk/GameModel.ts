
import { extractAppErrorCodeFromUnknownObject, type ModelT } from "@ig/engine-app-ui";
import type { GameConfigIdT, GameInstanceIdT } from "@ig/engine-models";
import { useGetGameInstancesQuery } from "./GameRtkApi";

export type GameModelDataT = {
  gameInstanceIds: GameInstanceIdT[],
};

export type GameModelT = ModelT<GameModelDataT>;

export const useGameModel = (gameConfigId: GameConfigIdT): GameModelT => {
  const {
    isLoading,
    isError,
    error,
    data: getGameInstancesResponse
  } = useGetGameInstancesQuery(gameConfigId);

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
  } else if (getGameInstancesResponse === undefined) {
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
      gameInstanceIds: getGameInstancesResponse.gameInstanceIds,
    }
  }
}
