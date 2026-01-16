
import { render } from "@testing-library/react-native";
import React from "react";
import * as WebSocketController from "../controllers/WebSocketController";
import * as wsClientModule from "../providers/useWsClient";
import { AppWebSocketProvider } from "./AppWebSocketProvider";

// mocks

jest.mock("./WebSocketProvider", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    WebSocketProvider: View,
  }
});

jest.mock("./GameContextProvider", () => ({
  useGameContext: jest.fn(() => ({
    gameUiConfig: {
      wssUrl: "ws://test",
      isDevel: true,
    },
  })),
}));

jest.mock("react-redux", () => ({
  useDispatch: () => jest.fn(),
}));

jest.mock("../controllers/WebSocketController", () => ({
  handleWebSocketMessage: jest.fn(),
}));

jest.mock("../providers/useClientLogger", () => ({
  useClientLogger: jest.fn(),
}));

describe("AppWebSocketProvider", () => {
  const connectMock = jest.fn();
  const disconnectMock = jest.fn();
  const subscribeMock = jest.fn();
  const wsClient = {
    connect: connectMock,
    disconnect: disconnectMock,
    subscribe: subscribeMock,
    send: jest.fn(),
  }
  const useWsClientSpy = jest.spyOn(wsClientModule, "useWsClient").mockReturnValue(wsClient);
  const handleWebSocketMessageSpy = jest.spyOn(WebSocketController, "handleWebSocketMessage");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("connects/subscribes on mount, disconnects/unsubscribes on unmount", () => {
    const { getByTestId } = render(
      <AppWebSocketProvider>
        <div>child</div>
      </AppWebSocketProvider>
    );

    expect(useWsClientSpy).toHaveBeenCalledTimes(1);

    const wsProvider = getByTestId("websocket-provider-tid");
    expect(wsProvider.props.wsClient).toEqual(wsClient);

    const msgHandler = wsProvider.props.msgHandler;
    expect(typeof msgHandler).toBe("function");

    msgHandler("test-msg-kind", { foo: "bar" });
    expect(handleWebSocketMessageSpy).toHaveBeenCalledTimes(1);
    expect(handleWebSocketMessageSpy.mock.calls[0][0]).toBe("test-msg-kind");
    expect(handleWebSocketMessageSpy.mock.calls[0][1]).toEqual({ foo: "bar" });
  });
});
