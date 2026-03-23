
import type { AppDispatch } from '@ig/app-engine-ui';
import { createWebsocketChatUpdatesMessageHandler, type ChatWebsocketUpdatesConfigT } from '@ig/chat-ui';
import type { WebsocketMessagePayloadT } from '@ig/client-utils';
import type { LoggerAdapter } from '@ig/utils';
import {
  createGameInstanceUpdatesWebsocketMessageHandler,
  type GameInstanceWebsocketUpdatesConfigT,
} from '../domains/game-instance/controller/ws-actions/GameInstanceWebSocketController';

export type WebsocketUpdatesConfigT = {
  gameInstanceWebsocketUpdatesConfig: GameInstanceWebsocketUpdatesConfigT,
  chatWebsocketUpdatesConfig: ChatWebsocketUpdatesConfigT,
}

export const createWebsocketMessageHandler = (websocketConfig: WebsocketUpdatesConfigT) => (
  msgKind: string,
  payload: WebsocketMessagePayloadT | undefined,
  dispatch: AppDispatch,
  logger: LoggerAdapter,
): boolean => {
  logger.debug(`Received ws message, msgKind [${msgKind}]` +
    (payload === undefined ? ', no payload' : `, payload [${JSON.stringify(payload)}]`));

  if (msgKind === websocketConfig.gameInstanceWebsocketUpdatesConfig.gameInstanceUpdateNotificationName) {
    const handler =
      createGameInstanceUpdatesWebsocketMessageHandler(websocketConfig.gameInstanceWebsocketUpdatesConfig);
    handler(msgKind, payload, dispatch);
    return true;
  } else if (msgKind === websocketConfig.chatWebsocketUpdatesConfig.chatUpdateNotificationName) {
    const handler = createWebsocketChatUpdatesMessageHandler(websocketConfig.chatWebsocketUpdatesConfig);
    handler(msgKind, payload, dispatch);
    return true;
  } else {
    return false;
  }
}
