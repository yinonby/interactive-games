/* istanbul ignore file -- @preserve */

import type { ExpressPluginContainerT, RedisClientAdapter } from '@ig/be-utils';
import { RedisClient } from '@ig/be-utils';
import { chatApiPlugin, type ChatPluginConfigT, type ChatUpdateNotificationAdapter } from '@ig/chat-api';
import type { ChatDbAdapter } from '@ig/chat-be-models';
import type { ChatConversationIdT } from '@ig/chat-models';
import type { ApiEnvVarsT } from '../../../ig-env/src/Env';

type ChatRedisMessageT = Record<string, string>;

export const useChatPluginContainer = (
  redisUrl: string,
  chatDbAdapter: ChatDbAdapter,
  redisEnvVars: ApiEnvVarsT['redis'],
): ExpressPluginContainerT<ChatPluginConfigT> => {
  const chatUpdateNotificationAdapter = useChatUpdateNotificationAdapter(redisUrl, redisEnvVars);

  const chatPluginContainer: ExpressPluginContainerT<ChatPluginConfigT> = {
    routeConfig: {
      route: '/api/chat',
      expressPlugin: chatApiPlugin,
      publicPluginConfig: {
        chatDbAdapter: chatDbAdapter,
        chatUpdateNotificationAdapter: chatUpdateNotificationAdapter,
      },
    },
  }

  return chatPluginContainer;
}

const useChatUpdateNotificationAdapter = (
  redisUrl: string,
  redisEnvVars: ApiEnvVarsT['redis'],
): ChatUpdateNotificationAdapter => {
  const redisClientAdapter = useRedisClientAdapter(redisUrl);

  return {
    init: async (): Promise<void> => {
      await redisClientAdapter.connect();
    },

    onChatUpdate: async (conversationId: ChatConversationIdT): Promise<void> => {
      await redisClientAdapter.publish(redisEnvVars.redisChatUpdateNotificationChannelName, {
        [redisEnvVars.redisMsgKindFieldName]: redisEnvVars.redisChatUpdateMsgKind,
        [redisEnvVars.redisConversationIdFieldName]: conversationId,
      });
    },
  }
}

const useRedisClientAdapter = (redisUrl: string): RedisClientAdapter<ChatRedisMessageT> => {
  const redisClient = new RedisClient<ChatRedisMessageT>(redisUrl);
  return redisClient;
}
