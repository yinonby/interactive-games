
import type { AppDispatch } from '@ig/app-engine-ui';
import type { WebsocketMessagePayloadT } from '@ig/client-utils';
import {
  handleChatUpdateWebSocketMessage
} from '../domains/chat/controller/ws-actions/ChatUpdateWebSocketController';

export type ChatWebsocketUpdatesConfigT = {
  chatUpdateNotificationName: string,
  conversationIdFieldName: string,
}

export const createWebsocketChatUpdatesMessageHandler = (config: ChatWebsocketUpdatesConfigT) => (
  msgKind: string,
  payload: WebsocketMessagePayloadT | undefined,
  dispatch: AppDispatch,
): boolean => {
  if (msgKind === config.chatUpdateNotificationName) {
    handleChatUpdateWebSocketMessage(config.conversationIdFieldName, payload, dispatch);
    return true;
  }
  return false;
}
