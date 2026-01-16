
import type { GameInstanceChatMessageT, GameInstanceExposedInfoT, PlayerExposedInfoT } from "@ig/engine-models";
import { act, fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { useGameInstanceController } from "../../../domains/game-instance/controller/user-actions/GameInstanceController";
import { useUserConfigModel } from "../../../domains/user-config/model/rtk/UserConfigModel";
import { ChatView } from "./ChatView";

// Mock hooks modules used in ChatView
jest.mock("../../../domains/user-config/model/rtk/UserConfigModel", () => ({
  useUserConfigModel: jest.fn(),
}));

jest.mock("../../../domains/game-instance/controller/user-actions/GameInstanceController", () => ({
  useGameInstanceController: jest.fn(),
}));

const mockedUseUserConfigModel = useUserConfigModel as unknown as jest.Mock;
const mockedUseGameInstanceController = useGameInstanceController as unknown as jest.Mock;

describe("ChatView", () => {
  const onSendChatMessage = jest.fn().mockResolvedValue(undefined);
  mockedUseGameInstanceController.mockReturnValue({ onSendChatMessage });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    mockedUseUserConfigModel.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
    });

    const props = {
      gameInstanceExposedInfo: { gameInstanceId: "gi1", otherPlayerExposedInfos: [] } as unknown as GameInstanceExposedInfoT,
      gameInstanceChatMessages: [],
    };

    const { queryByTestId } = render(<ChatView {...props} />);
    expect(queryByTestId("activity-indicator-tid")).toBeTruthy();
  });

  it("renders error state", () => {
    mockedUseUserConfigModel.mockReturnValue({
      isLoading: false,
      isError: true,
      data: undefined,
    });

    const props = {
      gameInstanceExposedInfo: { gameInstanceId: "gi1", otherPlayerExposedInfos: [] } as unknown as GameInstanceExposedInfoT,
      gameInstanceChatMessages: [],
    };

    const { getByText } = render(<ChatView {...props} />);
    expect(getByText("Error")).toBeTruthy();
  });

  it("displays chat messages with nicknames, excludes unknown players, and sends new message", async () => {
    // Mock user config (current user)
    mockedUseUserConfigModel.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { userId: "user1", username: "Me" },
    });

    const gameInstanceExposedInfo: GameInstanceExposedInfoT = {
      gameInstanceId: "gi1",
      otherPlayerExposedInfos: [
        { playerUserId: "user2", playerNickname: "Alice" } as PlayerExposedInfoT,
      ],
    } as GameInstanceExposedInfoT;

    const messages: GameInstanceChatMessageT[] = [
      { chatMsgId: "m1", playerUserId: "user1", msgText: "hello me" } as GameInstanceChatMessageT,
      { chatMsgId: "m2", playerUserId: "user2", msgText: "hi" } as GameInstanceChatMessageT,
      { chatMsgId: "m3", playerUserId: "unknown", msgText: "secret" } as GameInstanceChatMessageT,
    ];

    const { getByTestId } = render(
      <ChatView gameInstanceExposedInfo={gameInstanceExposedInfo} gameInstanceChatMessages={messages} />
    );

    const list = getByTestId("chat-msg-list-tid");
    expect(list.props.data.length).toBe(2); // Only 2 messages with known players

    fireEvent(getByTestId('new-msg-input-tid'), 'onChangeText', 'new message');

    const sendBtn = getByTestId("send-msg-btn-tid");
    await act(async () => {
      fireEvent.press(sendBtn);
    });

    expect(onSendChatMessage).toHaveBeenCalledWith("gi1", "user1", "new message");
    const newMsgInput = getByTestId("new-msg-input-tid");
    expect(newMsgInput.props.value).toBe("");
  });
});