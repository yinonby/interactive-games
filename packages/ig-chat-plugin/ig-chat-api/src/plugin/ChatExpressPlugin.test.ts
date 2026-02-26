
import type { ExpressAppInfoT } from '@ig/be-utils';
import type { ChatDbAdapter } from '@ig/chat-be-models';
import type { Router } from 'express';
import * as graphqlModule from '../graphql/server/GraphqlRouter';
import type { ChatPluginConfigT } from '../types/ChatPluginTypes';
import { chatApiPlugin } from './ChatExpressPlugin';

describe('chatApiPlugin', () => {
  let mockRouter: Router;

  beforeEach(() => {
    // Mock an Express router
    mockRouter = {} as Router;

    // Spy on createGraphqlRouter and force it to return the mocked router
    vi.spyOn(graphqlModule, 'createGraphqlRouter').mockResolvedValue(mockRouter);
  });

  it('initRouter calls createGraphqlRouter and returns a Router', async () => {
    const appInfoMock = {} as ExpressAppInfoT;
    const pluginConfigMock: ChatPluginConfigT = {
      chatDbAdapter: {
        init: vi.fn(),
      } as unknown as ChatDbAdapter,
    } as ChatPluginConfigT;

    const router = await chatApiPlugin.initRouter(appInfoMock, pluginConfigMock);

    expect(graphqlModule.createGraphqlRouter).toHaveBeenCalledWith(pluginConfigMock.chatDbAdapter);
    expect(router).toBe(mockRouter);
  });
});
