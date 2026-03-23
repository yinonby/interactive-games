
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import type { ChatDbAdapter } from '@ig/chat-be-models';
import { chatMessageGraphqlTypeDefs } from '@ig/chat-models';
import type { GraphQLSchema } from 'graphql';
import { ChatLogic } from '../../logic/ChatLogic';
import type { ChatUpdateNotificationAdapter } from '../../types/ChatPluginTypes';
import { createChatResolvers } from './ChatResolvers';

export const createChatSchema = (
  chatDbAdapter: ChatDbAdapter,
  chatUpdateNotificationAdapter: ChatUpdateNotificationAdapter,
): GraphQLSchema => {
  const gameConfigLogic: ChatLogic = new ChatLogic(
    chatDbAdapter.getChatMessagesTableAdapter(),
    chatUpdateNotificationAdapter,
  );

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
