
import type { ChatConversationIdT } from './ChatTypes';

// CHAT_UPDATE_NOTIFICATION
export type ChatUpdateWebSocketMsgKindT = 'WS_CHAT_UPDATE_NOTIFICATION';
export type ChatUpdateWebSocketMessagePayloadT = { 'WS_CONVERSATION_ID': ChatConversationIdT };

// aggregate
export type ChatWebSocketMsgKindT = ChatUpdateWebSocketMsgKindT;
export type ChatWebSocketMessagePayloadT = ChatUpdateWebSocketMessagePayloadT;
