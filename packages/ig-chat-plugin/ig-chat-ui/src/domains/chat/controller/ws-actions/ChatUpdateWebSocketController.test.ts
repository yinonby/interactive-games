
import type { AppDispatch } from '@ig/app-engine-ui';
import { handleChatUpdateWebSocketMessage } from './ChatUpdateWebSocketController';

// mock the RTK API util
jest.mock('../../model/rtk/ChatRtkApi', () => ({
  chatRtkApiUtil: {
    invalidateTags: jest.fn(),
  },
}));

// import mocked util AFTER jest.mock
import { chatRtkApiUtil } from '../../model/rtk/ChatRtkApi';

describe('handleChatUpdateWebSocketMessage', () => {
  const dispatch = jest.fn() as unknown as AppDispatch;
  const invalidateTagsSpy = jest.spyOn(chatRtkApiUtil, 'invalidateTags');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not dispatch when payload in undefined', () => {
    handleChatUpdateWebSocketMessage(
      'conversationId',
      undefined,
      dispatch
    );

    expect(chatRtkApiUtil.invalidateTags).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('dispatches invalidateTags on chat update', () => {
    const invalidateResult = { type: 'TEST_ACTION', payload: [] };

    // make invalidateTags return a fake action
    invalidateTagsSpy.mockReturnValue(
      invalidateResult
    );

    handleChatUpdateWebSocketMessage(
      'conversationId',
      { conversationId: 'giid-1' },
      dispatch
    );

    expect(chatRtkApiUtil.invalidateTags).toHaveBeenCalledTimes(1);
    expect(chatRtkApiUtil.invalidateTags).toHaveBeenCalledWith([
      { type: 'ChatTag', id: 'giid-1' }
    ]);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(invalidateResult);
  });
});
