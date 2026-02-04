
import { __loggerMocks } from '@ig/client-utils';
import { render } from '@testing-library/react-native';
import React from 'react';
import * as wsClientModule from '../providers/useWsClient';
import { AppWebSocketProvider, type AppWebSocketMsgHandlerT } from './AppWebSocketProvider';

// mocks

jest.mock("./WebSocketProvider", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    WebSocketProvider: View,
  }
});

jest.mock("./AppConfigProvider", () => ({
  useAppConfig: jest.fn(() => ({
    gameUiConfig: {
      wssUrl: "ws://test",
      isDevel: true,
    },
  })),
}));

jest.mock("react-redux", () => ({
  useDispatch: () => jest.fn(),
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("handles message with 2nd handler", () => {
    const handleWebSocketMessage1 = jest.fn(() => false) as jest.Mock;
    const handleWebSocketMessage2 = jest.fn(() => true) as jest.Mock;
    const handleWebSocketMessage3 = jest.fn(() => false) as jest.Mock;
    const appWebSocketMsgHandlers: AppWebSocketMsgHandlerT[] = [
      handleWebSocketMessage1, handleWebSocketMessage2, handleWebSocketMessage3
    ];

    const { getByTestId } = render(
      <AppWebSocketProvider appWebSocketMsgHandlers={appWebSocketMsgHandlers}>
        <div>child</div>
      </AppWebSocketProvider>
    );

    expect(useWsClientSpy).toHaveBeenCalled();

    const wsProvider = getByTestId("websocket-provider-tid");
    expect(wsProvider.props.wsClient).toEqual(wsClient);

    const msgHandler = wsProvider.props.msgHandler;
    expect(typeof msgHandler).toBe("function");

    msgHandler("test-msg-kind", { foo: "bar" });

    expect(handleWebSocketMessage1).toHaveBeenCalled();
    expect(handleWebSocketMessage1.mock.calls[0][0]).toEqual("test-msg-kind");
    expect(handleWebSocketMessage1.mock.calls[0][1]).toEqual({ foo: "bar" });

    expect(handleWebSocketMessage2).toHaveBeenCalled();
    expect(handleWebSocketMessage2.mock.calls[0][0]).toEqual("test-msg-kind");
    expect(handleWebSocketMessage2.mock.calls[0][1]).toEqual({ foo: "bar" });

    expect(handleWebSocketMessage3).toHaveBeenCalled();
    expect(handleWebSocketMessage3.mock.calls[0][0]).toEqual("test-msg-kind");
    expect(handleWebSocketMessage3.mock.calls[0][1]).toEqual({ foo: "bar" });
  });

  it("does not handle message", () => {
    const { errorMock } = __loggerMocks;

    const handleWebSocketMessage1 = jest.fn(() => false) as jest.Mock;
    const handleWebSocketMessage2 = jest.fn(() => false) as jest.Mock;
    const appWebSocketMsgHandlers: AppWebSocketMsgHandlerT[] = [handleWebSocketMessage1, handleWebSocketMessage2];

    const { getByTestId } = render(
      <AppWebSocketProvider appWebSocketMsgHandlers={appWebSocketMsgHandlers}>
        <div>child</div>
      </AppWebSocketProvider>
    );

    expect(useWsClientSpy).toHaveBeenCalled();

    const wsProvider = getByTestId("websocket-provider-tid");
    expect(wsProvider.props.wsClient).toEqual(wsClient);

    const msgHandler = wsProvider.props.msgHandler;
    expect(typeof msgHandler).toBe("function");

    msgHandler("test-msg-kind", { foo: "bar" });

    expect(handleWebSocketMessage1).toHaveBeenCalled();
    expect(handleWebSocketMessage1.mock.calls[0][0]).toEqual("test-msg-kind");
    expect(handleWebSocketMessage1.mock.calls[0][1]).toEqual({ foo: "bar" });

    expect(handleWebSocketMessage2).toHaveBeenCalled();
    expect(handleWebSocketMessage2.mock.calls[0][0]).toEqual("test-msg-kind");
    expect(handleWebSocketMessage2.mock.calls[0][1]).toEqual({ foo: "bar" });

    expect(errorMock).toHaveBeenCalled();
  });
});
