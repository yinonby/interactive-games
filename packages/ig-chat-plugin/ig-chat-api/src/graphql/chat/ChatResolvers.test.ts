
import type { ChatLogicAdapter } from '@ig/chat-be-models';
import type { ChatMessageT, CreateChatMessageInputT } from '@ig/chat-models';
import { buildFullTestChatMessage } from '@ig/chat-models/test-utils';
import { createChatResolvers } from './ChatResolvers';

describe('ChatMessageResolvers', () => {
  it('getMostRecentChatMessages calls adapter and returns data', async () => {
    // Arrange: mock the adapter
    const mock_mockChatMessages: ChatMessageT[] = [buildFullTestChatMessage()];

    const mock_GamesChatMessageLogicAdapter: Partial<ChatLogicAdapter> = {
      getMostRecentChatMessages: vi.fn().mockResolvedValue(mock_mockChatMessages),
    };

    const resolvers = createChatResolvers(mock_GamesChatMessageLogicAdapter as ChatLogicAdapter);

    // Act
    const conversationId = 'C1';
    const limit = 4;
    const result = await resolvers.Query.getMostRecentChatMessages({}, { conversationId, limit });

    // Assert
    expect(mock_GamesChatMessageLogicAdapter.getMostRecentChatMessages).toHaveBeenCalledWith(conversationId, limit);
    expect(result).toEqual(mock_mockChatMessages);
  });

  it('getPreviousChatMessages calls adapter and returns data', async () => {
    // Arrange: mock the adapter
    const mock_mockChatMessages: ChatMessageT[] = [buildFullTestChatMessage()];

    const mock_GamesChatMessageLogicAdapter: Partial<ChatLogicAdapter> = {
      getPreviousChatMessages: vi.fn().mockResolvedValue(mock_mockChatMessages),
    };

    const resolvers = createChatResolvers(mock_GamesChatMessageLogicAdapter as ChatLogicAdapter);

    // Act
    const conversationId = 'C1';
    const beforePaginationId = 1;
    const limit = 4;
    const result = await resolvers.Query.getPreviousChatMessages({}, { conversationId, beforePaginationId, limit });

    // Assert
    expect(mock_GamesChatMessageLogicAdapter.getPreviousChatMessages).toHaveBeenCalledWith(conversationId,
      beforePaginationId, limit);
    expect(result).toEqual(mock_mockChatMessages);
  });

  it('getNextChatMessages calls adapter and returns data', async () => {
    // Arrange: mock the adapter
    const mock_mockChatMessages: ChatMessageT[] = [buildFullTestChatMessage()];

    const mock_GamesChatMessageLogicAdapter: Partial<ChatLogicAdapter> = {
      getNextChatMessages: vi.fn().mockResolvedValue(mock_mockChatMessages),
    };

    const resolvers = createChatResolvers(mock_GamesChatMessageLogicAdapter as ChatLogicAdapter);

    // Act
    const conversationId = 'C1';
    const afterPaginationId = 1;
    const limit = 4;
    const result = await resolvers.Query.getNextChatMessages({}, { conversationId, afterPaginationId, limit });

    // Assert
    expect(mock_GamesChatMessageLogicAdapter.getNextChatMessages).toHaveBeenCalledWith(conversationId,
      afterPaginationId, limit);
    expect(result).toEqual(mock_mockChatMessages);
  });

  it('createChatMessage calls adapter and returns data', async () => {
    // Arrange: mock the adapter
    const newChatMsgId = 'CM1';

    const mock_GamesChatMessageLogicAdapter: Partial<ChatLogicAdapter> = {
      createChatMessage: vi.fn().mockResolvedValue(newChatMsgId),
    };

    const resolvers = createChatResolvers(mock_GamesChatMessageLogicAdapter as ChatLogicAdapter);

    // Act
    const input: CreateChatMessageInputT = {
      conversationId: 'C1',
      conversationKind: 'chat',
      senderId: 'S1',
      senderDisplayName: 'NAME1',
      msgContent: 'HELLO',
      sentTs: 100,
    } as CreateChatMessageInputT;
    const result = await resolvers.Mutation.createChatMessage({}, { input });

    // Assert
    expect(mock_GamesChatMessageLogicAdapter.createChatMessage).toHaveBeenCalledWith(input);
    expect(result).toEqual({ msgId: newChatMsgId });
  });
});
