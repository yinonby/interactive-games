
import type { LoggerAdapter } from '@ig/utils';
import type { WebSocketAdapter, WebSocketMessageHandlerT } from '../../types/WebSocketTypes';

type WsRcvMessageT<RCV_MSG_KIND, PAYLOAD_T = unknown> = {
  msgKind: RCV_MSG_KIND,
  payload?: PAYLOAD_T,
}

type WsSndMessageT<SND_MSG_KIND, PAYLOAD_T = unknown> = {
  msgKind: SND_MSG_KIND,
  payload?: PAYLOAD_T,
}

export class WebSocketClient<RCV_MSG_KIND, SND_MSG_KIND, PAYLOAD_T = unknown> implements
  WebSocketAdapter<RCV_MSG_KIND, SND_MSG_KIND, PAYLOAD_T>
{
  private socket?: WebSocket;
  private handlers = new Set<WebSocketMessageHandlerT<RCV_MSG_KIND, PAYLOAD_T>>();
  private reconnectTimeout?: ReturnType<typeof setTimeout>;
  private isAwaitingReconnect = false;
  private manuallyClosed = false;

  constructor(
    private logger: LoggerAdapter,
    private readonly url: string,
    private readonly reconnectDelayMs = 3000
  ) {}

  public connect(): void {
    if (this.socket) return;

    this.manuallyClosed = false;
    this.socket = new WebSocket(this.url);

    this.socket.onopen = (): void => {
      this.logger.info('[WS] connected');
    };

    this.socket.onmessage = (event): void => {
      try {
        const wsMessage: WsRcvMessageT<RCV_MSG_KIND, PAYLOAD_T> = JSON.parse(event.data) as WsRcvMessageT<RCV_MSG_KIND, PAYLOAD_T>;
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

  public send(msgKind: SND_MSG_KIND, payload?: PAYLOAD_T): void {
    if (!this.socket) {
      this.logger.warn('[WS] not connected');
      return;
    } else if (this.socket.readyState !== this.socket.OPEN) {
      this.logger.warn('[WS] not ready');
      return;
    }

    const wsSendMessage: WsSndMessageT<SND_MSG_KIND, PAYLOAD_T> = {
      msgKind: msgKind,
      payload: payload,
    }

    this.socket.send(JSON.stringify(wsSendMessage));
  }

  public subscribe(handler: WebSocketMessageHandlerT<RCV_MSG_KIND, PAYLOAD_T>): () => boolean {
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
