
import { __engineAppUiMocks } from '@ig/app-engine-ui';
import {
  type ChatMessageT
} from '@ig/chat-models';
import { buildFullTestChatMessage } from '@ig/chat-models/test-utils';
import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import * as ChatControllerModule from '../../domains/chat/controller/user-actions/ChatController';
import * as ChatModelModule from '../../domains/chat/model/rtk/ChatModel';
import { ChatView } from './ChatView';

describe('ChatView', () => {
  const spy_useChatModel = jest.spyOn(ChatModelModule, 'useChatModel');
  const spy_useChatController = jest.spyOn(ChatControllerModule, 'useChatController');

  const mock_onSendChatMessage = jest.fn();
  const { onUnknownErrorMock, onAppErrorMock } = __engineAppUiMocks;

  spy_useChatController.mockReturnValue({
    onSendChatMessage: mock_onSendChatMessage
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays activity indicator when loading', async () => {
    // setup mocks
    spy_useChatModel.mockReturnValue({
      isLoading: true,
      isError: false,
    })
    mock_onSendChatMessage.mockImplementation(async () => { });

    // render
    const conversationId = 'C1';
    const senderId = 'SENDER1';
    const senderDisplayName = 'NAME1';
    const { getByTestId } = render(
      <ChatView conversationId={conversationId} senderId={senderId} senderDisplayName={senderDisplayName} />
    );

    // verify components
    getByTestId('RnuiActivityIndicator-tid');
  });

  it('displays nothing when error and calls onAppError()', async () => {
    // setup mocks
    spy_useChatModel.mockReturnValue({
      isLoading: false,
      isError: true,
      appErrCode: 'appError:unknown',
    })
    mock_onSendChatMessage.mockImplementation(async () => { });

    // render
    const conversationId = 'C1';
    const senderId = 'SENDER1';
    const senderDisplayName = 'NAME1';
    render(
      <ChatView conversationId={conversationId} senderId={senderId} senderDisplayName={senderDisplayName} />
    );

    // verify components
    expect(onAppErrorMock).toHaveBeenCalledWith('appError:unknown');
  });

  it('displays chat messages with nicknames', async () => {
    // setup mocks
    const chatMessages: ChatMessageT[] = [
      buildFullTestChatMessage({ msgId: 'm1' }),
      buildFullTestChatMessage({ msgId: 'm2' }),
      buildFullTestChatMessage({ msgId: 'm3' }),
    ];
    spy_useChatModel.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { chatMessages: chatMessages },
    })

    // render
    const conversationId = 'C1';
    const senderId = 'SENDER1';
    const senderDisplayName = 'NAME1';
    const { getByTestId } = render(
      <ChatView conversationId={conversationId} senderId={senderId} senderDisplayName={senderDisplayName} />
    );

    // verify components
    const list = getByTestId('FlatList-tid');
    expect(list.props.data.length).toBe(chatMessages.length);
  });

  it('sends new message', async () => {
    // setup mocks
    spy_useChatModel.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { chatMessages: [] },
    })
    mock_onSendChatMessage.mockImplementation(async () => { });

    // render
    const conversationId = 'C1';
    const senderId = 'SENDER1';
    const senderDisplayName = 'NAME1';
    const { getByTestId } = render(
      <ChatView conversationId={conversationId} senderId={senderId} senderDisplayName={senderDisplayName} />
    );

    // set new message in text input
    fireEvent(getByTestId('RnuiTextInput-tid'), 'onChangeText', 'new message');

    // simulate press button
    const sendBtn = getByTestId('send-msg-btn-tid');
    await act(async () => {
      fireEvent.press(sendBtn);
    });

    // verify calls
    expect(mock_onSendChatMessage).toHaveBeenCalledWith(conversationId, 'gameInstanceChat',
      senderId, senderDisplayName, 'new message');
    expect(onUnknownErrorMock).not.toHaveBeenCalled();

    // verify text input reset
    const newMsgInput = getByTestId('RnuiTextInput-tid');
    expect(newMsgInput.props.value).toBe('');
  });

  it('sends new message, handles error', async () => {
    // setup mocks
    mock_onSendChatMessage.mockRejectedValue('ERR');

    // render
    const conversationId = 'C1';
    const senderId = 'SENDER1';
    const senderDisplayName = 'NAME1';
    const { getByTestId } = render(
      <ChatView conversationId={conversationId} senderId={senderId} senderDisplayName={senderDisplayName} />
    );

    // set new message in text input
    fireEvent(getByTestId('RnuiTextInput-tid'), 'onChangeText', 'new message');

    // simulate press button
    const sendBtn = getByTestId('send-msg-btn-tid');
    await act(async () => {
      fireEvent.press(sendBtn);
    });

    // verify calls
    expect(mock_onSendChatMessage).toHaveBeenCalledWith(conversationId, 'gameInstanceChat',
      senderId, senderDisplayName, 'new message');
    expect(onUnknownErrorMock).toHaveBeenCalledWith('ERR');

    // verify text input reset
    const newMsgInput = getByTestId('RnuiTextInput-tid');
    expect(newMsgInput.props.value).toBe('new message');
  });
});