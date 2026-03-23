
import type { ChatDbAdapter } from '@ig/chat-be-models';
import type { ChatConversationIdT } from '@ig/chat-models';

export type ChatPluginConfigT = {
  chatDbAdapter: ChatDbAdapter,
  chatUpdateNotificationAdapter: ChatUpdateNotificationAdapter,
}

export interface ChatUpdateNotificationAdapter {
  init: () => Promise<void>;
  onChatUpdate: (conversationId: ChatConversationIdT) => Promise<void>;
}
