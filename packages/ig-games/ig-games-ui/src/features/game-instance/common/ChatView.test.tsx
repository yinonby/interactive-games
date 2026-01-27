
import { __engineAppUiMocks, type AppConfigContextT } from '@ig/engine-ui';
import {
    type GameInstanceChatMessageT, type GameInstanceExposedInfoT
} from '@ig/games-models';
import { buildTestGameInstanceExposedInfo, buildTestPlayerExposedInfo } from '@ig/games-models/test-utils';
import { act, fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { buildMockedTranslation } from "../../../../test/mocks/EngineAppUiMocks";
import {
    useGameInstanceController
} from "../../../domains/game-instance/controller/user-actions/GameInstanceController";
import { ChatView } from "./ChatView";

// Mock hooks modules used in ChatView
jest.mock("../../../domains/user-config/model/rtk/GamesUserConfigModel", () => ({
  useGamesUserConfigModel: jest.fn(),
}));

jest.mock("../../../domains/game-instance/controller/user-actions/GameInstanceController", () => ({
  useGameInstanceController: jest.fn(),
}));

const mockedUseGameInstanceController = useGameInstanceController as unknown as jest.Mock;

describe("ChatView", () => {
  const onSendChatMessageMock = jest.fn();
  const { useAppConfigMock, onUnknownErrorMock } = __engineAppUiMocks;
  mockedUseGameInstanceController.mockReturnValue({
    onSendChatMessage: onSendChatMessageMock
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays chat messages with nicknames, excludes unknown players", async () => {
    // setup mocks
    onSendChatMessageMock.mockImplementation(async () => {});
    const mockedCurUserId = "mockedId";
    useAppConfigMock.mockReturnValue({
      curUserId: mockedCurUserId,
    } as AppConfigContextT);

    // render
    const gameInstanceExposedInfo: GameInstanceExposedInfoT = buildTestGameInstanceExposedInfo({
      gameInstanceId: "gi1",
      playerExposedInfos: [
        buildTestPlayerExposedInfo({ playerUserId: "user2", playerNickname: "Alice" }),
      ],
    });
    const messages: GameInstanceChatMessageT[] = [
      { chatMsgId: "m1", playerUserId: "user1", msgText: "hello me" } as GameInstanceChatMessageT,
      { chatMsgId: "m2", playerUserId: "user2", msgText: "hi" } as GameInstanceChatMessageT,
      { chatMsgId: "m3", playerUserId: "unknown", msgText: "secret" } as GameInstanceChatMessageT,
    ];
    const { getByTestId, getByText } = render(
      <ChatView gameInstanceExposedInfo={gameInstanceExposedInfo} gameInstanceChatMessages={messages} />
    );

    // verify components
    getByText(buildMockedTranslation("common:chat"));

    const list = getByTestId("FlatList-tid");
    expect(list.props.data.length).toBe(1); // Only 2 messages with known players
  });

  it("sends new message", async () => {
    // setup mocks
    onSendChatMessageMock.mockImplementation(async () => { });
    const mockedCurUserId = "mockedId";
    useAppConfigMock.mockReturnValue({
      curUserId: mockedCurUserId,
    } as AppConfigContextT);

    // render
    const gameInstanceExposedInfo: GameInstanceExposedInfoT = buildTestGameInstanceExposedInfo({
      gameInstanceId: "gi1",
    });
    const { getByTestId } = render(
      <ChatView gameInstanceExposedInfo={gameInstanceExposedInfo} gameInstanceChatMessages={[]} />
    );

    // set new message in text input
    fireEvent(getByTestId('RnuiTextInput-tid'), 'onChangeText', 'new message');

    // simulate press button
    const sendBtn = getByTestId("send-msg-btn-tid");
    await act(async () => {
      fireEvent.press(sendBtn);
    });

    // verify calls
    expect(onSendChatMessageMock).toHaveBeenCalledWith("gi1", mockedCurUserId, "new message");
    expect(onUnknownErrorMock).not.toHaveBeenCalled();

    // verify text input reset
    const newMsgInput = getByTestId("RnuiTextInput-tid");
    expect(newMsgInput.props.value).toBe("");
  });

  it("sends new message, handles error", async () => {
    // setup mocks
    onSendChatMessageMock.mockRejectedValue('ERR');
    const mockedCurUserId = "mockedId";
    useAppConfigMock.mockReturnValue({
      curUserId: mockedCurUserId,
    } as AppConfigContextT);

    // render
    const gameInstanceExposedInfo: GameInstanceExposedInfoT = buildTestGameInstanceExposedInfo({
      gameInstanceId: "gi1",
    });
    const { getByTestId } = render(
      <ChatView gameInstanceExposedInfo={gameInstanceExposedInfo} gameInstanceChatMessages={[]} />
    );

    // set new message in text input
    fireEvent(getByTestId('RnuiTextInput-tid'), 'onChangeText', 'new message');

    // simulate press button
    const sendBtn = getByTestId("send-msg-btn-tid");
    await act(async () => {
      fireEvent.press(sendBtn);
    });

    // verify calls
    expect(onSendChatMessageMock).toHaveBeenCalledWith("gi1", mockedCurUserId, "new message");
    expect(onUnknownErrorMock).toHaveBeenCalledWith('ERR');

    // verify text input reset
    const newMsgInput = getByTestId("RnuiTextInput-tid");
    expect(newMsgInput.props.value).toBe("new message");
  });
});