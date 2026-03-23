
export interface WebsocketTopicSubscriptionProvider {
  topicSubscribe(topic: string): void;
  topicUnsubscribe(topic: string): void;
}
