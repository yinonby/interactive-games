
import { extractAppErrorCodeFromUnknownObject, type ModelT } from '@ig/app-engine-ui';
import {
  type ChatConversationIdT, type ChatMessageT
} from '@ig/chat-models';
import { useGetChatQuery } from './ChatRtkApi';

export const MAX_INITIAL_CHAT_MESSAGES = 100;

export type GameInstanceModelDataT = {
  chatMessages: ChatMessageT[],
};

export type GameInstanceModelT = ModelT<GameInstanceModelDataT>;

export const useChatModel = (conversationId: ChatConversationIdT): GameInstanceModelT => {
  const {
    isLoading: isChatLoading,
    isError: isChatError,
    error: chatError,
    data: chatResponse
  } = useGetChatQuery({ conversationId, limit: MAX_INITIAL_CHAT_MESSAGES });

  if (isChatLoading) {
    return {
      isLoading: true,
      isError: false,
    }
  } else if (isChatError) {
    return {
      isLoading: false,
      isError: true,
      appErrCode: extractAppErrorCodeFromUnknownObject(chatError),
    }
  } else if (chatResponse === undefined) {
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
      chatMessages: chatResponse.mostRecentChatMessages,
    }
  }
}
