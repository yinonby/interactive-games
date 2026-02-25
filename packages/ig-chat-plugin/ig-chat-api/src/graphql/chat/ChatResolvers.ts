
import type { ChatLogicAdapter } from '@ig/chat-be-models';
import type {
  ChatConversationIdT,
  ChatMessageT,
  CreateChatMessageInputT,
  CreateChatMessageResultT
} from '@ig/chat-models';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createChatResolvers = (chatLogicAdapter: ChatLogicAdapter): any => ({
  Query: {
    getMostRecentChatMessages: async (
      _: unknown,
      args: { conversationId: ChatConversationIdT, limit: number },
    ): Promise<ChatMessageT[]> => {
      const { conversationId, limit } = args;
      return await chatLogicAdapter.getMostRecentChatMessages(conversationId, limit);
    },

    getPreviousChatMessages: async (
      _: unknown,
      args: { conversationId: ChatConversationIdT, beforePaginationId: number, limit: number },
    ): Promise<ChatMessageT[]> => {
      const { conversationId, beforePaginationId, limit } = args;
      return await chatLogicAdapter.getPreviousChatMessages(conversationId, beforePaginationId, limit);
    },

    getNextChatMessages: async (
      _: unknown,
      args: { conversationId: ChatConversationIdT, afterPaginationId: number, limit: number },
    ): Promise<ChatMessageT[]> => {
      const { conversationId, afterPaginationId, limit } = args;
      return await chatLogicAdapter.getNextChatMessages(conversationId, afterPaginationId, limit);
    },
  },

  Mutation: {
    createChatMessage: async (
      _: unknown,
      args: { input: CreateChatMessageInputT },
    ): Promise<CreateChatMessageResultT> => {
      const { input } = args;
      const msgId = await chatLogicAdapter.createChatMessage(input);

      return {
        msgId,
      }
    },
  }
});
