/* istanbul ignore file -- @preserve */

import type { ExpressPluginContainerT } from '@ig/be-utils';
import { chatApiPlugin, type ChatPluginConfigT } from '@ig/chat-api';
import type { ChatDbAdapter } from '@ig/chat-be-models';

export const useChatPluginContainer = (
  chatDbAdapter: ChatDbAdapter,
): ExpressPluginContainerT<ChatPluginConfigT> => {
  const chatPluginContainer: ExpressPluginContainerT<ChatPluginConfigT> = {
    routeConfig: {
      route: '/api/chat',
      expressPlugin: chatApiPlugin,
      pluginConfig: {
        chatDbAdapter: chatDbAdapter,
      },
    },
  }

  return chatPluginContainer;
}

