
import type { AppDispatch } from '@ig/app-engine-ui';
import type { WebsocketMessagePayloadT } from '@ig/client-utils';
import { chatRtkApiUtil } from '../../model/rtk/ChatRtkApi';

export const handleChatUpdateWebSocketMessage = (
  conversationIdFieldName: string,
  payload: WebsocketMessagePayloadT | undefined,
  dispatch: AppDispatch,
): void => {
  if (payload === undefined) {
    return;
  }

  dispatch(
    chatRtkApiUtil.invalidateTags([{ type: 'ChatTag', id: payload[conversationIdFieldName] as string }])
  );
}
