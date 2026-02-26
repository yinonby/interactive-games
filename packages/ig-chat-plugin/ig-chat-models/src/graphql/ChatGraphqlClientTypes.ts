
import type { ChatConversationIdT, ChatMessageT, ChatMsgIdT, ChatMsgSenderIdT } from '../types/ChatTypes';

// query

export type GetMostRecentChatMessagesParamsT = {
  conversationId: ChatConversationIdT,
  limit: number,
}

export type GetMostRecentChatMessagesResultT = {
  mostRecentChatMessages: ChatMessageT[],
}

export type GetMostRecentChatMessagesResponseT = {
  data: GetMostRecentChatMessagesResultT,
}

export const getMostRecentChatMessagesQuery = `
  query GetMostRecentChatMessages($conversationId: ID!, $limit: Int!) {
    mostRecentChatMessages: getMostRecentChatMessages(
      conversationId: $conversationId
      limit: $limit
    ) {
      conversationId
      conversationKind
      msgId
      senderId
      senderDisplayName
      sentTs
      msgContent
      paginationId
    }
  }
`;

// previous chat messages

export type GetPreviousChatMessagesResultT = {
  previousChatMessages: ChatMessageT[],
}

export type GetPreviousChatMessagesResponseT = {
  data: GetPreviousChatMessagesResultT,
}

export const getPreviousChatMessagesQuery = `
  query GetMostRecentChatMessages($conversationId: ID!, $beforePaginationId: Int!, $limit: Int!) {
    previousChatMessages: getPreviousChatMessages(
      conversationId: $conversationId
      beforePaginationId: $beforePaginationId
      limit: $limit
    ) {
      conversationId
      conversationKind
      msgId
      senderId
      senderDisplayName
      sentTs
      msgContent
      paginationId
    }
  }
`;

// next chat messages

export type GetNextChatMessagesResultT = {
  nextChatMessages: ChatMessageT[],
}

export type GetNextChatMessagesResponseT = {
  data: GetNextChatMessagesResultT,
}

export const getNextChatMessagesQuery = `
  query GetNextChatMessages($conversationId: ID!, $afterPaginationId: Int!, $limit: Int!) {
    nextChatMessages: getNextChatMessages(
      conversationId: $conversationId
      afterPaginationId: $afterPaginationId
      limit: $limit
    ) {
      conversationId
      conversationKind
      msgId
      senderId
      senderDisplayName
      sentTs
      msgContent
      paginationId
    }
  }
`;

// mutation

export type CreateChatMessageInputT = {
  conversationId: ChatConversationIdT,
  conversationKind: string,
  senderId: ChatMsgSenderIdT,
  senderDisplayName: string,
  sentTs: number,
  msgContent: string,
}

export type CreateChatMessageResultT = {
  msgId: ChatMsgIdT,
};

export type CreateChatMessageResponseT = {
  data: {
    createChatMessageResult: CreateChatMessageResultT,
  }
};

export const createChatMessageMutation = `
  mutation CreateChatMessage($input: CreateChatMessageInput!) {
    createChatMessageResult: createChatMessage(input: $input) {
      msgId
    }
  }
`;
