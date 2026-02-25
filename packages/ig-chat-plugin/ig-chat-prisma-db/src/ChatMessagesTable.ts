
import type { ChatMessagesTableAdapter } from '@ig/chat-be-models';
import type { ChatConversationIdT, ChatMessageT, ChatMsgIdT, ChatMsgSenderIdT } from '@ig/chat-models';
import { generateUuidv4 } from '@ig/utils';
import type { PrismaClient } from '../generated/prisma/client';

export class ChatMessagesTable implements ChatMessagesTableAdapter {
  constructor(
    private prismaClient: PrismaClient,
  ) {}

  public async getMostRecentChatMessages(
    conversationId: ChatConversationIdT,
    limit: number,
  ): Promise<ChatMessageT[]> {
    const chatMessages = await this.prismaClient.chatMessage.findMany({
      where: {
        conversationId,
      },
      orderBy: [
        { paginationId: "desc" },
      ],
      take: limit,
    });

    return chatMessages.reverse(); // from oldest to newest
  }

  public async getPreviousChatMessages(
    conversationId: ChatConversationIdT,
    beforePaginationId: number,
    limit: number,
  ): Promise<ChatMessageT[]> {
    const chatMessages = await this.prismaClient.chatMessage.findMany({
      where: {
        conversationId,
        paginationId: { lt: beforePaginationId },
      },
      orderBy: [
        { paginationId: "desc" },
      ],
      take: limit,
    });

    return chatMessages.reverse(); // from oldest to newest
  }

  public async getNextChatMessages(
    conversationId: ChatConversationIdT,
    afterPaginationId: number,
    limit: number,
  ): Promise<ChatMessageT[]> {
    const chatMessages = await this.prismaClient.chatMessage.findMany({
      where: {
        conversationId,
        paginationId: { gt: afterPaginationId },
      },
      orderBy: [
        { paginationId: "asc" }, // from oldest to newest
      ],
      take: limit,
    });

    return chatMessages;
  }

  public async createChatMessage(
    conversationId: ChatConversationIdT,
    conversationKind: string,
    senderId: ChatMsgSenderIdT,
    senderDisplayName: string,
    msgContent: string,
    sentTs: number,
  ): Promise<ChatMsgIdT> {
    const newChatMsgId = generateUuidv4();
    await this.prismaClient.chatMessage.create({
      data: {
        msgId: newChatMsgId,
        conversationId,
        conversationKind: conversationKind,
        senderId,
        senderDisplayName,
        msgContent,
        sentTs,
      },
    });

    return newChatMsgId;
  }
}
