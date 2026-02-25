
import { print } from 'graphql';
import { gql } from 'graphql-tag';

const chatMessageGraphqlTypesTypeDefs = gql`
  enum ConversationKind {
    gameInstanceChat
  }

  type ChatMessage {
    conversationId: ID!
    conversationKind: ConversationKind!
    msgId: ID!
    senderId: ID!
    senderDisplayName: String!
    sentTs: Float!
    msgContent: String!
    paginationId: Int!
  }
`;

const chatMessageGraphqlQueryTypeDefs = gql`
  type Query {
    getMostRecentChatMessages(conversationId: ID!, limit: Int!): [ChatMessage!]!
    getPreviousChatMessages(conversationId: ID!, beforePaginationId: Int!, limit: Int!): [ChatMessage!]!
    getNextChatMessages(conversationId: ID!, afterPaginationId: Int!, limit: Int!): [ChatMessage!]!
  }
`;

const chatMessageGraphqlMutationTypeDefs = gql`
  type Mutation {
    createChatMessage(input: CreateChatMessageInput!): CreateChatMessageResult!
  }

  input CreateChatMessageInput {
    conversationId: ID!
    conversationKind: ConversationKind!
    senderId: ID!
    senderDisplayName: String!
    sentTs: Float!
    msgContent: String!
  }

  type CreateChatMessageResult {
    msgId: ID!
  }
`;

const chatMessageGraphqlTypeDefsStr = [
  print(chatMessageGraphqlTypesTypeDefs),
  print(chatMessageGraphqlQueryTypeDefs),
  print(chatMessageGraphqlMutationTypeDefs),
].join('\n');

export const chatMessageGraphqlTypeDefs = gql(chatMessageGraphqlTypeDefsStr);
