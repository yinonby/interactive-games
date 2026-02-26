
import { AppError, extractAppErrorCodeFromUnknownObject } from '@ig/app-engine-ui';
import type { ChatConversationIdT, ChatMsgSenderIdT } from '@ig/chat-models';
import {
  usePostChatMessageMutation
} from '../../model/rtk/ChatRtkApi';

export type ChatControllerT = {
  onSendChatMessage: (
    conversationId: ChatConversationIdT,
    conversationKind: string,
    senderId: ChatMsgSenderIdT,
    senderDisplayName: string,
    msgContent: string,
  ) => Promise<void>,
}

export function useChatController(): ChatControllerT {
  const [
    postChatMessage,
  ] = usePostChatMessageMutation();

  const sendChatMessge = async (
    conversationId: ChatConversationIdT,
    conversationKind: string,
    senderId: ChatMsgSenderIdT,
    senderDisplayName: string,
    msgContent: string,
  ): Promise<void> => {
    const { error } = await postChatMessage({
      conversationId: conversationId,
      conversationKind: conversationKind,
      senderId: senderId,
      senderDisplayName: senderDisplayName,
      sentTs: Date.now(),
      msgContent: msgContent,
    });
    if (error !== undefined) {
      throw new AppError(extractAppErrorCodeFromUnknownObject(error));
    }
  };

  return {
    onSendChatMessage: sendChatMessge,
  }
}
