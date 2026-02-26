
import type { AppDispatch } from '@ig/app-engine-ui';
import type {
  ChatWebSocketMessagePayloadT,
  ChatWebSocketMsgKindT
} from '@ig/chat-models';
import type { LoggerAdapter } from '@ig/utils';
import {
  handleChatUpdateWebSocketMessage
} from '../domains/chat/controller/ws-actions/ChatUpdateWebSocketController';

export const handleChatWebSocketMessage = (
  msgKind: ChatWebSocketMsgKindT,
  payload: ChatWebSocketMessagePayloadT | undefined,
  dispatch: AppDispatch,
  logger: LoggerAdapter,
): boolean => {
  logger.debug(`Received ws message, msgKind [${msgKind}]` +
    (payload === undefined ? ", no payload" : `, payload [${JSON.stringify(payload)}]`));

  if (msgKind === 'chatUpdate') {
    handleChatUpdateWebSocketMessage(payload as ChatWebSocketMessagePayloadT, dispatch);
    return true;
  }
  return false;
}
