
export type WebsocketMessagePayloadT = Record<string, string | object>;
export type WebsocketMessageHandlerT = (msgKind: string, payload?: WebsocketMessagePayloadT) => void;

export interface WebsocketAdapter {
  connect(): void;
  disconnect(): void;
  subscribe(handler: WebsocketMessageHandlerT): () => boolean;
  send(message: object): void;
}
