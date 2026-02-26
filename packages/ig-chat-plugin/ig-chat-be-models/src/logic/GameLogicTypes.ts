
import type {
  ChatConversationIdT,
  ChatMessageT,
  ChatMsgIdT,
  CreateChatMessageInputT
} from '@ig/chat-models';

export interface ChatLogicAdapter {
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
    input: CreateChatMessageInputT,
  ): Promise<ChatMsgIdT>;
}
