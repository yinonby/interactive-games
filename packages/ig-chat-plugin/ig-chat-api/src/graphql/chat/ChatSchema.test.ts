
import { ApolloServer } from '@apollo/server';
import type { ChatDbAdapter, ChatMessagesTableAdapter } from '@ig/chat-be-models';
import { buildFullTestChatMessage } from '@ig/chat-models/test-utils';
import { createChatSchema } from './ChatSchema';

describe('createChatSchema', () => {
  it('creates a working schema and resolves getMostRecentChatMessages', async () => {
    // --- mock table adapter ---
    const mock_GamesChatMessagesTableAdapter: Partial<ChatMessagesTableAdapter> = {
      getMostRecentChatMessages: vi.fn().mockResolvedValue([
        buildFullTestChatMessage({
          conversationId: 'C1',
          msgId: 'CM1',
        })
      ]),
    };

    // --- mock db adapter ---
    const mock_ChatDbAdapter: ChatDbAdapter = {
      getChatMessagesTableAdapter: () => mock_GamesChatMessagesTableAdapter,
    } as ChatDbAdapter;

    // --- create schema ---
    const schema = createChatSchema(mock_ChatDbAdapter);

    // --- create Apollo server ---
    const server = new ApolloServer({ schema });
    await server.start();

    type GetChatMessagesResult = {
      getMostRecentChatMessages: {
        conversationId: string;
        msgId: string;
      }[];
    };

    // --- execute query ---
    const result = await server.executeOperation<GetChatMessagesResult>({
      query: `
        query GetMostRecent($conversationId: ID!, $limit: Int!) {
          getMostRecentChatMessages(
            conversationId: $conversationId
            limit: $limit
          ) {
            conversationId
            msgId
          }
        }
      `,
      variables: {
        conversationId: 'C1',
        limit: 10,
      },
    });

    // --- extract result ---
    assert(result.body.kind === 'single');
    const { data, errors } = result.body.singleResult;

    // --- assertions ---
    expect(errors).toBeUndefined();
    assert(data !== undefined);
    assert(data !== null);
    expect(data.getMostRecentChatMessages).toHaveLength(1);
    expect(data.getMostRecentChatMessages[0]).toEqual(expect.objectContaining({
      msgId: 'CM1',
      conversationId: 'C1',
    }));

    // --- ensure logic path was called ---
    expect(mock_GamesChatMessagesTableAdapter.getMostRecentChatMessages).toHaveBeenCalledOnce();
  });
});
