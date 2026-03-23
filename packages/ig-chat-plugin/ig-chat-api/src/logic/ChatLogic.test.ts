import type { ChatUpdateNotificationAdapter } from '@/types/ChatPluginTypes';
import type { ChatMessagesTableAdapter } from '@ig/chat-be-models';
import type { ChatMessageT, CreateChatMessageInputT } from '@ig/chat-models';
import { buildFullTestChatMessage } from '@ig/chat-models/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ChatLogic } from './ChatLogic';

describe('ChatLogic', () => {
  const mock_getMostRecentChatMessages = vi.fn();
  const mock_getPreviousChatMessages = vi.fn();
  const mock_getNextChatMessages = vi.fn();
  const mock_createChatMessage = vi.fn();
  const mock_ChatMessagesTableAdapter: ChatMessagesTableAdapter = {
    getMostRecentChatMessages: mock_getMostRecentChatMessages,
    getPreviousChatMessages: mock_getPreviousChatMessages,
    getNextChatMessages: mock_getNextChatMessages,
    createChatMessage: mock_createChatMessage,
  };
  const mock_chatUpdateNotificationAdapter = {
    onChatUpdate: vi.fn(),
  } as unknown as ChatUpdateNotificationAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMostRecentChatMessages', () => {
    it('should call getMostRecentChatMessages with destructured input properties', async () => {
      const chatMessages: ChatMessageT[] = [
        buildFullTestChatMessage(),
        buildFullTestChatMessage(),
      ]

      mock_getMostRecentChatMessages.mockResolvedValue(chatMessages);

      const chatLogic = new ChatLogic(mock_ChatMessagesTableAdapter, mock_chatUpdateNotificationAdapter);
      const result = await chatLogic.getMostRecentChatMessages('123', 5);

      expect(mock_getMostRecentChatMessages).toHaveBeenCalledWith('123', 5);
      expect(result).toBe(chatMessages);
    });
  });

  describe('getPreviousChatMessages', () => {
    it('should call getPreviousChatMessages with destructured input properties', async () => {
      const chatMessages: ChatMessageT[] = [
        buildFullTestChatMessage(),
        buildFullTestChatMessage(),
      ]

      mock_getPreviousChatMessages.mockResolvedValue(chatMessages);

      const chatLogic = new ChatLogic(mock_ChatMessagesTableAdapter, mock_chatUpdateNotificationAdapter);
      const result = await chatLogic.getPreviousChatMessages('123', 3, 5);

      expect(mock_getPreviousChatMessages).toHaveBeenCalledWith('123', 3, 5);
      expect(result).toBe(chatMessages);
    });
  });

  describe('getNextChatMessages', () => {
    it('should call getNextChatMessages with destructured input properties', async () => {
      const chatMessages: ChatMessageT[] = [
        buildFullTestChatMessage(),
        buildFullTestChatMessage(),
      ]

      mock_getNextChatMessages.mockResolvedValue(chatMessages);

      const chatLogic = new ChatLogic(mock_ChatMessagesTableAdapter, mock_chatUpdateNotificationAdapter);
      const result = await chatLogic.getNextChatMessages('123', 3, 5);

      expect(mock_getNextChatMessages).toHaveBeenCalledWith('123', 3, 5);
      expect(result).toBe(chatMessages);
    });
  });

  describe('createChatMessage', () => {
    it('should call createChatMessage with destructured input properties', async () => {
      const input: CreateChatMessageInputT = {
        conversationId: '123',
        conversationKind: 'direct',
        senderId: 'user-1',
        senderDisplayName: 'John Doe',
        msgContent: 'Hello',
        sentTs: 1234567890,
      };

      const expectedMessageId = 'msg-1';
      mock_createChatMessage.mockResolvedValue(expectedMessageId);

      const chatLogic = new ChatLogic(mock_ChatMessagesTableAdapter, mock_chatUpdateNotificationAdapter);
      const result = await chatLogic.createChatMessage(input);

      expect(mock_createChatMessage).toHaveBeenCalledWith(
        '123',
        'direct',
        'user-1',
        'John Doe',
        'Hello',
        1234567890,
      );
      expect(mock_chatUpdateNotificationAdapter.onChatUpdate).toHaveBeenCalledWith('123');
      expect(result).toBe(expectedMessageId);
    });

    it('should propagate adapter errors', async () => {
      const input: CreateChatMessageInputT = {
        conversationId: '789',
        conversationKind: 'direct',
        senderId: 'user-3',
        senderDisplayName: 'Bob',
        msgContent: 'Error test',
        sentTs: 1234567892,
      };

      const error = new Error('Database error');
      mock_createChatMessage.mockRejectedValue(error);

      const chatLogic = new ChatLogic(mock_ChatMessagesTableAdapter, mock_chatUpdateNotificationAdapter);
      await expect(chatLogic.createChatMessage(input)).rejects.toThrow('Database error');
    });
  });
});