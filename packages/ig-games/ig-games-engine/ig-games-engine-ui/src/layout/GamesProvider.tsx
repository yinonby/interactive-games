
import { useWebsocketTopicSubscriptionProvider } from '@ig/app-engine-ui';
import { useAuth } from '@ig/auth-ui';
import { useEffect, type FC, type PropsWithChildren } from 'react';

export type GamesProviderPropsT = {
  gameInstanceUpdateNotificationTopicPrefix: string,
}

export const GamesProvider: FC<PropsWithChildren<GamesProviderPropsT>> = (props) => {
  const { gameInstanceUpdateNotificationTopicPrefix, children } = props;
  const { topicSubscribe, topicUnsubscribe } = useWebsocketTopicSubscriptionProvider();
  const { curAuthId } = useAuth();

  useEffect(() => {
    // subscribe to user updates topic
    const gameInstanceTopic = gameInstanceUpdateNotificationTopicPrefix + curAuthId;
    topicSubscribe(gameInstanceTopic);

    // Cleanup logic
    // This runs whenever curAuthId changes or the component unmounts
    return () => {
      topicUnsubscribe(gameInstanceTopic);
    };
  }, [curAuthId]);

  return children;
}
