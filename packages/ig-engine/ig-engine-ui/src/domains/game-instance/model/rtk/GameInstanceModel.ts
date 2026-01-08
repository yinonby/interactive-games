
import type { GameInstanceChatMessageT, GameInstanceExposedInfoT, GameInstanceIdT } from "@ig/engine-models";
import { useGetGameInstanceChatQuery, useGetGameInstanceQuery } from "./GameInstanceRtkApi";

type ModelWithoutDataT = {
  isLoading: true | false;
  isError: true | false;
  data?: never;
} & (
  | { isLoading: true; isError: boolean }
  | { isLoading: boolean; isError: true }
);

type ModelWithDataT<T> = {
  isLoading: false;
  isError: false;
  data: T;
};

export type GameInstanceModelT = ModelWithoutDataT | ModelWithDataT<{
  gameInstanceExposedInfo: GameInstanceExposedInfoT,
  gameInstanceChatMessages: GameInstanceChatMessageT[],
}>;

export const useGameInstanceModel = (gameInstanceId: GameInstanceIdT): GameInstanceModelT => {
  const { data: gameInstanceResponse, isLoading, isError } = useGetGameInstanceQuery(gameInstanceId);
  const { data: gameInstanceChatResponse, isLoading: isChatLoading, isError: isChatError } =
    useGetGameInstanceChatQuery(gameInstanceId);

  if (isLoading || isChatLoading) {
    return {
      isLoading: true,
      isError: false,
    }
  } else if (isError || isChatError) {
    return {
      isLoading: false,
      isError: true,
    }
  } else if (gameInstanceResponse === undefined || gameInstanceChatResponse === undefined) {
    return {
      isLoading: false,
      isError: true,
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
