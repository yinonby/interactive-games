
import { extractAppErrorCodeFromUnknownObject, type ModelT } from "@ig/engine-app-ui";
import type { GameInstanceChatMessageT, GameInstanceExposedInfoT, GameInstanceIdT } from "@ig/engine-models";
import { useGetGameInstanceChatQuery, useGetGameInstanceQuery } from "./GameInstanceRtkApi";

export type GameInstanceModelDataT = {
  gameInstanceExposedInfo: GameInstanceExposedInfoT,
  gameInstanceChatMessages: GameInstanceChatMessageT[],
};

export type GameInstanceModelT = ModelT<GameInstanceModelDataT>;

export const useGameInstanceModel = (gameInstanceId: GameInstanceIdT): GameInstanceModelT => {
  const {
    isLoading: isGameInstanceLoading,
    isError: isGameInstanceError,
    error: gameInstanceError,
    data: gameInstanceResponse
  } = useGetGameInstanceQuery(gameInstanceId);
  const {
    isLoading: isChatLoading,
    isError: isChatError,
    error: chatError,
    data: gameInstanceChatResponse
  } = useGetGameInstanceChatQuery(gameInstanceId);

  if (isGameInstanceLoading || isChatLoading) {
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
  } else if (isChatError) {
    return {
      isLoading: false,
      isError: true,
      appErrCode: extractAppErrorCodeFromUnknownObject(chatError),
    }
  } else if (gameInstanceResponse === undefined || gameInstanceChatResponse === undefined) {
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
      gameInstanceExposedInfo: gameInstanceResponse.gameInstanceExposedInfo,
      gameInstanceChatMessages: gameInstanceChatResponse.chatMessages,
    }
  }
}
