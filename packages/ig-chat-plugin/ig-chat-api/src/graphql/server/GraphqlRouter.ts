
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { mergeSchemas } from '@graphql-tools/schema';
import type { ChatDbAdapter } from '@ig/chat-be-models';
import { Router } from 'express';
import type { ChatUpdateNotificationAdapter } from '../../types/ChatPluginTypes';
import { createChatSchema } from '../chat/ChatSchema';

// returns an express router for this graphql endpoint
export async function createGraphqlRouter(
  chatDbAdapter: ChatDbAdapter,
  chatUpdateNotificationAdapter: ChatUpdateNotificationAdapter,
): Promise<Router> {
  const router = Router();
  const chatSchema = createChatSchema(chatDbAdapter, chatUpdateNotificationAdapter);

  // create the combined schema
  const schema = mergeSchemas({
    schemas:[ chatSchema ], // more schemas to come
  });

  // inject directives
  // const directiveTransformers: GraphqlSchemaTransformerT[] = [
  // ]
  //schema = directiveTransformers.reduce((curSchema, transformer) => transformer(curSchema), schema);

  // set up Apollo Server
  const apolloServer = new ApolloServer({
    schema,
  });
  await apolloServer.start();

  // inject the /graphql route
  router.use(
    '/graphql',
    expressMiddleware(apolloServer),
  );

  return router;
}
