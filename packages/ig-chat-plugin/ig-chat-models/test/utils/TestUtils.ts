
import type { ChatMessageT } from '../../src/types/ChatTypes';

if (process.env.NODE_ENV !== 'test') {
  throw new Error('TestUtils should only be used in testing');
}

const chatMessage: ChatMessageT = {
  msgId: 'CM1',
  conversationId: 'C1',
  conversationKind: 'gameChat',
  senderId: 'ACC1',
  senderDisplayName: 'NAME1',
  sentTs: 100,
  msgContent: 'Hello',
  paginationId: 1,
};

export const buildFullTestChatMessage = (overrides?: Partial<ChatMessageT>): ChatMessageT => ({
  ...chatMessage,
  ...overrides,
});
