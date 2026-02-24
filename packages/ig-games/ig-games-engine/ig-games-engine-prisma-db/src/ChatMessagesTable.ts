
import type { AccountIdT } from '@ig/app-engine-models';
import type { GamesChatMessagesTableAdapter } from '@ig/games-engine-be-models';
import type { ChatMessageT, ChatMsgIdT, ConversationIdT } from '@ig/games-engine-models';
import { generateUuidv4 } from '@ig/utils';
import type { PrismaClient } from '../generated/prisma/client';

export class ChatMessagesTable implements GamesChatMessagesTableAdapter {
  constructor(
    private prismaClient: PrismaClient,
  ) {}

  public async createMessage(
    conversationKind: 'gameInstanceChat',
    conversationId: ConversationIdT,
    senderAccountId: AccountIdT,
    msgText: string,
    sentTs: number,
  ): Promise<ChatMsgIdT> {
    const newChatMsgId = generateUuidv4();
    await this.prismaClient.gameChatMessage.create({
      data: {
        conversationKind: conversationKind,
        conversationId,
        chatMsgId: newChatMsgId,
        senderAccountId,
        msgText,
        sentTs,
      },
    });

    return newChatMsgId;
  }

  public async getMostRecentMessagesForGameInstance(
    conversationId: ConversationIdT,
    limit: number,
  ): Promise<ChatMessageT[]> {
    const gameChatMessages = await this.prismaClient.gameChatMessage.findMany({
      where: {
        conversationId,
      },
      orderBy: [
        { paginationId: "desc" },
      ],
      take: limit,
    });

    return gameChatMessages.reverse(); // from oldest to newest
  }

  public async getPriorMessagesForGameInstance(
    conversationId: ConversationIdT,
    beforePaginationId: number,
    limit: number,
  ): Promise<ChatMessageT[]> {
    const gameChatMessages = await this.prismaClient.gameChatMessage.findMany({
      where: {
        conversationId,
        paginationId: { lt: beforePaginationId },
      },
      orderBy: [
        { paginationId: "desc" },
      ],
      take: limit,
    });

    return gameChatMessages.reverse(); // from oldest to newest
  }

  public async getNewerMessagesForGameInstance(
    conversationId: ConversationIdT,
    afterPaginationId: number,
    limit: number,
  ): Promise<ChatMessageT[]> {
    const gameChatMessages = await this.prismaClient.gameChatMessage.findMany({
      where: {
        conversationId,
        paginationId: { gt: afterPaginationId },
      },
      orderBy: [
        { paginationId: "asc" }, // from oldest to newest
      ],
      take: limit,
    });

    return gameChatMessages;
  }
}
