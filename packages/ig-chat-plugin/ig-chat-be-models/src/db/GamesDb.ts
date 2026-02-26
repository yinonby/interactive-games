
import type { ChatConversationIdT, ChatMessageT, ChatMsgIdT } from '@ig/chat-models';

export interface ChatDbAdapter {
  init(): Promise<void>;
  getChatMessagesTableAdapter(): ChatMessagesTableAdapter;
}

export interface ChatMessagesTableAdapter {
  getMostRecentChatMessages(
    conversationId: ChatConversationIdT,
    limit: number,
  ): Promise<ChatMessageT[]>;

  getPreviousChatMessages(
    conversationId: ChatConversationIdT,
    beforePaginationId: number,
    limit: number,
  ): Promise<ChatMessageT[]>;

  getNextChatMessages(
    conversationId: ChatConversationIdT,
    afterPaginationId: number,
    limit: number,
  ): Promise<ChatMessageT[]>;

  createChatMessage(
    conversationId: ChatConversationIdT,
    conversationKind: string,
    senderId: string,
    senderDisplayName: string,
    msgContent: string,
    sentTs: number,
  ): Promise<ChatMsgIdT>;
}
