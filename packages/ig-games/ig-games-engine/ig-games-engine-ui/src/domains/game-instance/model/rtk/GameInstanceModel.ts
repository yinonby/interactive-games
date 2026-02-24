
import { extractAppErrorCodeFromUnknownObject, type ModelT } from '@ig/app-engine-ui';
import { getGameInstanceConversationId, type ChatMessageT, type ConversationIdT, type GameInstanceExposedInfoT, type GameInstanceIdT } from '@ig/games-engine-models';
import { useGetChatQuery, useGetGameInstanceQuery } from './GameInstanceRtkApi';

export type GameInstanceModelDataT = {
  gameInstanceExposedInfo: GameInstanceExposedInfoT,
  chatMessages: ChatMessageT[],
};

export type GameInstanceModelT = ModelT<GameInstanceModelDataT>;

export const useGameInstanceModel = (gameInstanceId: GameInstanceIdT): GameInstanceModelT => {
  const conversationId: ConversationIdT = getGameInstanceConversationId(gameInstanceId);

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
  } = useGetChatQuery(conversationId);

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
      chatMessages: gameInstanceChatResponse.chatMessages,
    }
  }
}
