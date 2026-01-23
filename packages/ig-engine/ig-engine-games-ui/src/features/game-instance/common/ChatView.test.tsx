
import { __engineAppUiMocks, type AppConfigContextT } from '@ig/engine-app-ui';
import {
  type GameInstanceChatMessageT, type GameInstanceExposedInfoT
} from "@ig/engine-models";
import { buildTestGameInstanceExposedInfo, buildTestPlayerExposedInfo } from '@ig/engine-models/test-utils';
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
  const onSendChatMessage = jest.fn().mockResolvedValue(undefined);
  mockedUseGameInstanceController.mockReturnValue({ onSendChatMessage });
  const { useAppConfigMock } = __engineAppUiMocks;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays chat messages with nicknames, excludes unknown players, and sends new message", async () => {
    const mockedCurUserId = "mockedId";
    useAppConfigMock.mockReturnValue({
      curUserId: mockedCurUserId,
    } as AppConfigContextT);

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

    getByText(buildMockedTranslation("common:chat"));

    const list = getByTestId("chat-msg-list-tid");
    expect(list.props.data.length).toBe(1); // Only 2 messages with known players

    fireEvent(getByTestId('new-msg-input-tid'), 'onChangeText', 'new message');

    const sendBtn = getByTestId("send-msg-btn-tid");
    await act(async () => {
      fireEvent.press(sendBtn);
    });

    expect(onSendChatMessage).toHaveBeenCalledWith("gi1", mockedCurUserId, "new message");
    const newMsgInput = getByTestId("new-msg-input-tid");
    expect(newMsgInput.props.value).toBe("");
  });
});