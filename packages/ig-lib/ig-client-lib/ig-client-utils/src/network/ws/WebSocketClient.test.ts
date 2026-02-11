
import type { LoggerAdapter } from '@ig/utils';
import { WebSocketMock } from './__mocks__/WebSocket';
import { WebSocketClient } from './WebSocketClient';

const warnMock = vi.fn();
const loggerMock: LoggerAdapter = {
  trace: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: warnMock,
  error: vi.fn(),
};

describe("WebSocketClient", () => {
  let wsInstance: WebSocketMock;

  beforeAll(() => {
    vi.useFakeTimers();
  });

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).WebSocket = vi.fn((url: string) => {
      wsInstance = new WebSocketMock(url);
      return wsInstance;
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.resetAllMocks();
  });

  it("connects and receives messages", () => {
    type MsgKind = "PING";

    const client = new WebSocketClient<MsgKind, MsgKind>(loggerMock, "ws://test");
    const handler = vi.fn();

    client.subscribe(handler);
    client.connect();
    expect(WebSocket).toHaveBeenCalledTimes(1);

    // does nothing here
    client.connect();
    expect(WebSocket).toHaveBeenCalledTimes(1);

    const message = JSON.stringify({
      msgKind: "PING",
      payload: { foo: "bar" },
    });

    wsInstance.onmessage?.({ data: message });

    expect(handler).toHaveBeenCalledWith("PING", { foo: "bar" });
  });

  it("connects and receives messages: missing msgKind, handler not called", () => {
    type MsgKind = "PING";

    const client = new WebSocketClient<MsgKind, MsgKind>(loggerMock, "ws://test");
    const handler = vi.fn();

    client.subscribe(handler);
    client.connect();

    const message = JSON.stringify({
      payload: { foo: "bar" },
    });

    wsInstance.onmessage?.({ data: message });

    expect(handler).not.toHaveBeenCalledWith();
  });

  it("sends messages when connected", () => {
    type MsgKind = "HELLO";

    const client = new WebSocketClient<never, MsgKind>(loggerMock, "ws://test");
    client.connect();

    client.send("HELLO", { test: 123 });

    expect(wsInstance.send).toHaveBeenCalledWith(
      JSON.stringify({
        msgKind: "HELLO",
        payload: { test: 123 },
      })
    );
  });

  it("does not send when socket is disconnected", () => {
    type MsgKind = "HELLO";

    const client = new WebSocketClient<never, MsgKind>(loggerMock, "ws://test");
    client.connect();
    client.disconnect();

    client.send("HELLO");

    expect(wsInstance.send).not.toHaveBeenCalled();
  });

  it("does not send when socket is not open", () => {
    type MsgKind = "HELLO";

    const client = new WebSocketClient<never, MsgKind>(loggerMock, "ws://test");
    client.connect();

    wsInstance.readyState = wsInstance.CLOSED;

    client.send("HELLO");

    expect(wsInstance.send).not.toHaveBeenCalled();
  });

  it("reconnects automatically after unexpected close", () => {
    const setTimeoutSpy = vi.spyOn(global, "setTimeout");

    const client = new WebSocketClient(loggerMock, "ws://test", 1000);

    // connect
    client.connect();
    expect(WebSocket).toHaveBeenCalledTimes(1);
    expect(setTimeoutSpy).toHaveBeenCalledTimes(1); // WebSocketMock::constructor
    setTimeoutSpy.mockClear();

    expect(WebSocket).toHaveBeenCalledTimes(1);

    // simulate connection close (not manual close)
    wsInstance.onclose?.();
    wsInstance.onclose?.(); // 2nd time should have no effect

    expect(setTimeoutSpy).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1000);

    expect(WebSocket).toHaveBeenCalledTimes(2);
  });

  it("does not reconnect after manual disconnect", () => {
    const setTimeoutSpy = vi.spyOn(global, "setTimeout");
    const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");

    const client = new WebSocketClient(loggerMock, "ws://test", 1000);

    // connect
    client.connect();
    expect(WebSocket).toHaveBeenCalledTimes(1);
    expect(setTimeoutSpy).toHaveBeenCalledTimes(1); // WebSocketMock::constructor
    setTimeoutSpy.mockClear();

    // disconnect
    client.disconnect();
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(0);
    expect(setTimeoutSpy).toHaveBeenCalledTimes(0);

    // shouldn't reconnect because socket was manually closed
    wsInstance.onclose?.();
    expect(setTimeoutSpy).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(1000);

    expect(WebSocket).toHaveBeenCalledTimes(1);
  });

  it("does not reconnect after manual disconnect, with a reconnectTimeout in process", () => {
    const setTimeoutSpy = vi.spyOn(global, "setTimeout");
    const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");

    const client = new WebSocketClient(loggerMock, "ws://test", 1000);

    // connect
    client.connect();
    expect(WebSocket).toHaveBeenCalledTimes(1);
    expect(setTimeoutSpy).toHaveBeenCalledTimes(1); // WebSocketMock::constructor
    setTimeoutSpy.mockClear();

    // onclose sets reconnectTimeout
    wsInstance.onclose?.();
    expect(setTimeoutSpy).toHaveBeenCalledTimes(1);

    // manual disconnect should clear reconnectTimeout
    client.disconnect();
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);

    // shouldn't reconnect because socket was manually closed
    wsInstance.onclose?.();
    expect(setTimeoutSpy).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1000);

    expect(WebSocket).toHaveBeenCalledTimes(1);
  });

  it("unsubscribe removes handler", () => {
    type MsgKind = "PING";
    const client = new WebSocketClient<MsgKind, never>(loggerMock, "ws://test");
    const handler = vi.fn();

    const unsubscribe = client.subscribe(handler);
    client.connect();

    unsubscribe();

    wsInstance.onmessage?.({
      data: JSON.stringify({ msgKind: "PING" }),
    });

    expect(handler).not.toHaveBeenCalled();
  });

  it("calls logger.warn on socket error", () => {
    type MsgKind = "PING";
    const client = new WebSocketClient<MsgKind, never>(loggerMock, "ws://test");

    client.connect();

    // simulate WebSocket error
    wsInstance.onerror?.(new Error("Test error"));

    expect(warnMock).toHaveBeenCalledWith('[WS] error', expect.any(Error));
  });
});
