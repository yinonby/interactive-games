
import { useWebsocketTopicSubscriptionProvider } from '@ig/app-engine-ui';
import type { ChatConversationIdT } from '@ig/chat-models';
import { useEffect, type FC, type PropsWithChildren } from 'react';
import { useChat } from '../../layout/ChatProvider';

export type ChatSyncProviderPropsT = {
  conversationId: ChatConversationIdT,
}

export const ChatSyncProvider: FC<PropsWithChildren<ChatSyncProviderPropsT>> = (props) => {
  const { conversationId, children } = props;
  const { topicSubscribe, topicUnsubscribe } = useWebsocketTopicSubscriptionProvider();
  const { chatUpdateNotificationTopicPrefix } = useChat();

  useEffect(() => {
    // subscribe to user updates topic
    const chatTopic = chatUpdateNotificationTopicPrefix + conversationId;
    topicSubscribe(chatTopic);

    // Cleanup logic
    // This runs whenever conversationId changes or the component unmounts
    return () => {
      topicUnsubscribe(chatTopic);
    };
  }, [conversationId]);

  return children;
}
