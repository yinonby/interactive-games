
import type { ChatConversationIdT } from './ChatTypes';

// chatUpdate
export type ChatUpdateWebSocketMsgKindT = "chatUpdate";
export type ChatUpdateWebSocketMessagePayloadT = { conversationId: ChatConversationIdT };

// aggregate
export type ChatWebSocketMsgKindT = ChatUpdateWebSocketMsgKindT;
export type ChatWebSocketMessagePayloadT = ChatUpdateWebSocketMessagePayloadT;
