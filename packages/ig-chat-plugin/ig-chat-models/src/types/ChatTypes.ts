

export type ChatConversationIdT = string;
export type ChatMsgIdT = string;
export type ChatMsgSenderIdT = string;

export type ChatMessageT = {
  msgId: ChatMsgIdT, // unique
  conversationId: ChatConversationIdT,
  conversationKind: string,
  senderId: ChatMsgSenderIdT,
  senderDisplayName: string,
  msgContent: string,
  sentTs: number,
  paginationId: number,
}
