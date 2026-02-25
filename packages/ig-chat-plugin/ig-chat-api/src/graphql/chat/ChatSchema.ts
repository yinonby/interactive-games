
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import type { ChatDbAdapter } from '@ig/chat-be-models';
import { chatMessageGraphqlTypeDefs } from '@ig/chat-models';
import type { GraphQLSchema } from 'graphql';
import { ChatLogic } from '../../logic/ChatLogic';
import { createChatResolvers } from './ChatResolvers';

export const createChatSchema = (chatDbAdapter: ChatDbAdapter): GraphQLSchema => {
  const gameConfigLogic: ChatLogic = new ChatLogic(chatDbAdapter.getChatMessagesTableAdapter());

  // create the combined schema
  return makeExecutableSchema({
    typeDefs: mergeTypeDefs([
      chatMessageGraphqlTypeDefs,
    ]),
    resolvers: mergeResolvers([
      createChatResolvers(gameConfigLogic),
    ]),
  });
};
