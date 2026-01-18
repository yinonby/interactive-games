
import type { WebSocketAdapter, WebSocketMessageHandlerT } from "@ig/client-utils";
import type { AppWebSocketMessagePayloadT, AppWebSocketRcvMsgKindT } from "@ig/engine-models";
import type { LoggerAdapter } from "@ig/lib";

export class WebSocketClientMock
  implements WebSocketAdapter<AppWebSocketRcvMsgKindT, never, AppWebSocketMessagePayloadT>
{
  constructor(private logger: LoggerAdapter) {}

  connect(): void {
  }

  disconnect(): void {
  }

  send(): void {
  }

  subscribe(handler: WebSocketMessageHandlerT<AppWebSocketRcvMsgKindT, AppWebSocketMessagePayloadT>): () => boolean {
    // set mocked msg every 10 seconds to refresh user config
    setInterval(() => handler("user-config-update"), 10000);
    setInterval(() => handler("game-instance-update", { gameInstanceId: "gid-1" }), 10000);
    return () => true;
  }
}
