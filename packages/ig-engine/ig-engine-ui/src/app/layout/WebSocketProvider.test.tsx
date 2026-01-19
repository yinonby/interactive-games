
import type { WebSocketAdapter } from "@ig/client-utils";
import type { AppWebSocketMessagePayloadT, AppWebSocketRcvMsgKindT } from "@ig/engine-models";
import { render } from "@testing-library/react-native";
import React from "react";
import { WebSocketProvider } from "./WebSocketProvider";

// mocks

describe("WebSocketProvider", () => {
  const connectMock = jest.fn();
  const disconnectMock = jest.fn();
  const subscribeMock = jest.fn();
  const unsubscribeMock = jest.fn();
  const wsClient: WebSocketAdapter<AppWebSocketRcvMsgKindT, never, AppWebSocketMessagePayloadT> = {
    connect: connectMock,
    disconnect: disconnectMock,
    subscribe: subscribeMock,
    send: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    subscribeMock.mockReturnValue(unsubscribeMock);
  });

  it("connects/subscribes on mount, disconnects/unsubscribes on unmount", () => {
    const { unmount } = render(
      <WebSocketProvider wsClient={wsClient} msgHandler={jest.fn()}>
        <div>child</div>
      </WebSocketProvider>
    );

    expect(connectMock).toHaveBeenCalledTimes(1);
    expect(subscribeMock).toHaveBeenCalledTimes(1);
    expect(subscribeMock).toHaveBeenCalledWith(expect.any(Function));
    expect(disconnectMock).toHaveBeenCalledTimes(0);
    expect(unsubscribeMock).toHaveBeenCalledTimes(0);

    unmount();

    expect(disconnectMock).toHaveBeenCalledTimes(1);
    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
  });

  it("forwards websocket messages to handleWebSocketMessage", () => {
    const msgHandlerMock = jest.fn();

    render(
      <WebSocketProvider wsClient={wsClient} msgHandler={msgHandlerMock}>
        <div>child</div>
      </WebSocketProvider>
    );

    // capture the subscribed handler
    const wsHandler = subscribeMock.mock.calls[0][0];

    const msgKind = "update" as AppWebSocketRcvMsgKindT;
    const payload = { foo: "bar" };

    wsHandler(msgKind, payload);

    expect(msgHandlerMock).toHaveBeenCalledTimes(1);
    expect(msgHandlerMock.mock.calls[0][0]).toEqual(msgKind);
    expect(msgHandlerMock.mock.calls[0][1]).toEqual(payload);
  });
});
