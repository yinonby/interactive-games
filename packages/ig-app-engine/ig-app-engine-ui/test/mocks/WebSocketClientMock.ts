
import type { WebsocketAdapter, WebsocketMessageHandlerT } from '@ig/client-utils';
import type { LoggerAdapter } from '@ig/utils';

export class WebSocketClientMock implements WebsocketAdapter {
  constructor(private logger: LoggerAdapter) {}

  connect(): void {
  }

  disconnect(): void {
  }

  send(): void {
  }

  subscribe(handler: WebsocketMessageHandlerT): () => boolean {
    // set mocked msg every 10 seconds to refresh user config
    setInterval(() => handler("gamesInstanceUpdate", { gameInstanceId: "gid-1" }), 10000);
    return () => true;
  }
}
