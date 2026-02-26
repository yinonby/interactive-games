
import type { AppDispatch } from '@ig/app-engine-ui';
import type { ChatUpdateWebSocketMessagePayloadT } from '@ig/chat-models';
import { chatRtkApiUtil } from '../../model/rtk/ChatRtkApi';

export const handleChatUpdateWebSocketMessage = (
  payload: ChatUpdateWebSocketMessagePayloadT,
  dispatch: AppDispatch,
): void => {
  dispatch(
    chatRtkApiUtil.invalidateTags([{ type: 'ChatTag', id: payload.conversationId }])
  );
}
