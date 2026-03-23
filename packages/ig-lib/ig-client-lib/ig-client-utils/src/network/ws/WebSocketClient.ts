
import type { LoggerAdapter } from '@ig/utils';
import type { WebsocketAdapter, WebsocketMessageHandlerT, WebsocketMessagePayloadT } from '../../types/WebSocketTypes';

type WsRcvMessageT = {
  msgKind: string, // must match IG_ENV__WS__NOTIFICATION_KIND_FIELD_NAME
  payload?: WebsocketMessagePayloadT, // must match IG_ENV__WS__NOTIFICATION_PAYLOAD_FIELD_NAME
}

export class WebSocketClient implements WebsocketAdapter {
  private socket?: WebSocket;
  private handlers = new Set<WebsocketMessageHandlerT>();
  private reconnectTimeout?: ReturnType<typeof setTimeout>;
  private isAwaitingReconnect = false;
  private manuallyClosed = false;
  private queuedSendMessages: object[] = []; // queue for down time

  constructor(
    private logger: LoggerAdapter,
    private readonly url: string,
    private readonly reconnectDelayMs = 3000
  ) {}

  public connect(): void {
    if (this.socket) return;

    this.manuallyClosed = false;

    this.logger.info('[WS] connecting...');
    this.socket = new WebSocket(this.url);

    this.socket.onopen = (): void => {
      this.logger.info('[WS] connected');
      this.sendMessagesInQueue(); // send any messages queued in down time
    };

    this.socket.onmessage = (event): void => {
      try {
        const wsMessage: WsRcvMessageT = JSON.parse(event.data) as WsRcvMessageT;
        if (wsMessage.msgKind === undefined) {
          this.logger.warn('[WS] Missing msgKind', event.data);
          throw new Error("Missing msgKind");
        }
        this.handlers.forEach(h => h(wsMessage.msgKind, wsMessage.payload));
      } catch {
        this.logger.warn('[WS] invalid wsMessage', event.data);
      }
    };

    this.socket.onclose = (): void => {
      this.logger.info('[WS] closed');
      this.socket = undefined;

      if (!this.manuallyClosed) {
        this.scheduleReconnect();
      }
    };

    this.socket.onerror = (err): void => {
      this.logger.warn('[WS] error', err);
    };
  }

  public disconnect(): void {
    this.manuallyClosed = true;
    if (this.isAwaitingReconnect) {
      clearTimeout(this.reconnectTimeout);
    }
    this.socket?.close();
    this.socket = undefined;
  }

  public send(message: object): void {
    if (!this.socket) {
      this.logger.warn('[WS] not connected');
      return;
    }

    if (this.socket.readyState !== this.socket.OPEN) {
      this.logger.warn('[WS] not ready, queueing message');
      this.queuedSendMessages.push(message);
    } else {
      this.socket.send(JSON.stringify(message));
    }
  }

  private sendMessagesInQueue(): void {
    if (!this.socket) {
      this.logger.warn('[WS] not connected');
      return;
    }

    this.logger.info('[WS] sending messages from queue');
    for (const wsSendMessage of this.queuedSendMessages) {
      this.socket.send(JSON.stringify(wsSendMessage));
    }
  }

  public subscribe(handler: WebsocketMessageHandlerT): () => boolean {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  private scheduleReconnect(): void {
    if (this.isAwaitingReconnect) return;

    this.reconnectTimeout = setTimeout(() => {
      this.logger.info("[WS] reconnectTimeout elapsed, reconnecting...")
      this.isAwaitingReconnect = false;
      this.reconnectTimeout = undefined;
      this.connect();
    }, this.reconnectDelayMs);
    this.isAwaitingReconnect = true;
  }
}
