
import { __engineAppUiMocks } from '@ig/app-engine-ui';
import { __authUiMocks } from '@ig/auth-ui';
import {
  getGameInstanceConversationId,
  type ChatMessageT, type ConversationIdT, type GameInstanceExposedInfoT
} from '@ig/games-engine-models';
import { buildTestGameInstanceExposedInfo, buildTestPlayerExposedInfo } from '@ig/games-engine-models/test-utils';
import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { buildMockedTranslation } from '../../../../test/mocks/EngineAppUiMocks';
import {
  useGameInstanceController
} from '../../../domains/game-instance/controller/user-actions/GameInstanceController';
import { ChatView } from './ChatView';

// Mock hooks modules used in ChatView
jest.mock('../../../domains/user-config/model/rtk/GamesUserConfigModel', () => ({
  useGamesUserConfigModel: jest.fn(),
}));

jest.mock('../../../domains/game-instance/controller/user-actions/GameInstanceController', () => ({
  useGameInstanceController: jest.fn(),
}));

const mockedUseGameInstanceController = useGameInstanceController as unknown as jest.Mock;
const gameInstanceId1 = 'gi1';

describe('ChatView', () => {
  const onSendChatMessageMock = jest.fn();
  const { onUnknownErrorMock } = __engineAppUiMocks;
  const { useAuthMock } = __authUiMocks;

  mockedUseGameInstanceController.mockReturnValue({
    onSendChatMessage: onSendChatMessageMock
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays chat messages with nicknames, excludes unknown players', async () => {
    // setup mocks
    onSendChatMessageMock.mockImplementation(async () => {});
    const mockedCurUserId = 'mockedId';
    useAuthMock.mockReturnValue({
      curAccountId: mockedCurUserId,
    });

    // render
    const gameInstanceExposedInfo: GameInstanceExposedInfoT = buildTestGameInstanceExposedInfo({
      gameInstanceId: gameInstanceId1,
      playerExposedInfos: [
        buildTestPlayerExposedInfo({ playerAccountId: 'user2', playerNickname: 'Alice' }),
      ],
    });
    const messages: ChatMessageT[] = [
      { chatMsgId: 'm1', senderAccountId: 'user1', msgText: 'hello me' } as ChatMessageT,
      { chatMsgId: 'm2', senderAccountId: 'user2', msgText: 'hi' } as ChatMessageT,
      { chatMsgId: 'm3', senderAccountId: 'unknown', msgText: 'secret' } as ChatMessageT,
    ];
    const { getByTestId, getByText } = render(
      <ChatView gameInstanceExposedInfo={gameInstanceExposedInfo} chatMessages={messages} />
    );

    // verify components
    getByText(buildMockedTranslation('common:chat'));

    const list = getByTestId('FlatList-tid');
    expect(list.props.data.length).toBe(1); // Only 2 messages with known players
  });

  it('sends new message', async () => {
    // setup mocks
    onSendChatMessageMock.mockImplementation(async () => { });
    const mockedCurUserId = 'mockedId';
    useAuthMock.mockReturnValue({
      curAccountId: mockedCurUserId,
    });

    // render
    const gameInstanceExposedInfo: GameInstanceExposedInfoT = buildTestGameInstanceExposedInfo({
      gameInstanceId: gameInstanceId1,
    });
    const { getByTestId } = render(
      <ChatView gameInstanceExposedInfo={gameInstanceExposedInfo} chatMessages={[]} />
    );

    // set new message in text input
    fireEvent(getByTestId('RnuiTextInput-tid'), 'onChangeText', 'new message');

    // simulate press button
    const sendBtn = getByTestId('send-msg-btn-tid');
    await act(async () => {
      fireEvent.press(sendBtn);
    });

    // verify calls
    const expectedConversationId: ConversationIdT = getGameInstanceConversationId(gameInstanceId1);
    expect(onSendChatMessageMock).toHaveBeenCalledWith('gameInstanceChat', expectedConversationId,
      mockedCurUserId, 'new message');
    expect(onUnknownErrorMock).not.toHaveBeenCalled();

    // verify text input reset
    const newMsgInput = getByTestId('RnuiTextInput-tid');
    expect(newMsgInput.props.value).toBe('');
  });

  it('sends new message, handles error', async () => {
    // setup mocks
    onSendChatMessageMock.mockRejectedValue('ERR');
    const mockedCurUserId = 'mockedId';
    useAuthMock.mockReturnValue({
      curAccountId: mockedCurUserId,
    });

    // render
    const gameInstanceExposedInfo: GameInstanceExposedInfoT = buildTestGameInstanceExposedInfo({
      gameInstanceId: gameInstanceId1,
    });
    const { getByTestId } = render(
      <ChatView gameInstanceExposedInfo={gameInstanceExposedInfo} chatMessages={[]} />
    );

    // set new message in text input
    fireEvent(getByTestId('RnuiTextInput-tid'), 'onChangeText', 'new message');

    // simulate press button
    const sendBtn = getByTestId('send-msg-btn-tid');
    await act(async () => {
      fireEvent.press(sendBtn);
    });

    // verify calls
    const expectedConversationId: ConversationIdT = getGameInstanceConversationId(gameInstanceId1);
    expect(onSendChatMessageMock).toHaveBeenCalledWith('gameInstanceChat', expectedConversationId,
      mockedCurUserId, 'new message');
    expect(onUnknownErrorMock).toHaveBeenCalledWith('ERR');

    // verify text input reset
    const newMsgInput = getByTestId('RnuiTextInput-tid');
    expect(newMsgInput.props.value).toBe('new message');
  });
});