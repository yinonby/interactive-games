
import type { ChatLogicAdapter, ChatMessagesTableAdapter } from '@ig/chat-be-models';
import type { ChatConversationIdT, ChatMessageT, ChatMsgIdT, CreateChatMessageInputT } from '@ig/chat-models';
import type { ChatUpdateNotificationAdapter } from '../types/ChatPluginTypes';

export class ChatLogic implements ChatLogicAdapter {
  constructor(
    private chatMessagesTableAdapter: ChatMessagesTableAdapter,
    private chatUpdateNotificationAdapter: ChatUpdateNotificationAdapter,
  ) { }

  public async getMostRecentChatMessages(
    conversationId: ChatConversationIdT,
    limit: number,
  ): Promise<ChatMessageT[]> {
    return await this.chatMessagesTableAdapter.getMostRecentChatMessages(conversationId, limit);
  }

  public async getPreviousChatMessages(
    conversationId: ChatConversationIdT,
    beforePaginationId: number,
    limit: number,
  ): Promise<ChatMessageT[]> {
    return await this.chatMessagesTableAdapter.getPreviousChatMessages(conversationId,
      beforePaginationId, limit);
  }

  public async getNextChatMessages(
    conversationId: ChatConversationIdT,
    afterPaginationId: number,
    limit: number,
  ): Promise<ChatMessageT[]> {
    return await this.chatMessagesTableAdapter.getNextChatMessages(conversationId,
      afterPaginationId, limit);
  }

  public async createChatMessage(
    input: CreateChatMessageInputT,
  ): Promise<ChatMsgIdT> {
    const {
      conversationId,
      conversationKind,
      senderId,
      senderDisplayName,
      msgContent,
      sentTs,
    } = input;
    const chatMsgId: ChatMsgIdT = await this.chatMessagesTableAdapter.createChatMessage(conversationId,
      conversationKind, senderId, senderDisplayName, msgContent, sentTs);

    await this.chatUpdateNotificationAdapter.onChatUpdate(conversationId);

    return chatMsgId;
  }
}
