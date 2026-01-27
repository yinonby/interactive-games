
export type WebSocketMessageHandlerT<RCV_MSG_KIND, PAYLOAD_T = unknown> =
  (msgType: RCV_MSG_KIND, payload?: PAYLOAD_T) => void;

export interface WebSocketAdapter<RCV_MSG_KIND, SND_MSG_KIND, PAYLOAD_T = unknown> {
  connect(): void;
  disconnect(): void;
  send(msgType: SND_MSG_KIND, payload?: PAYLOAD_T): void;
  subscribe(handler: WebSocketMessageHandlerT<RCV_MSG_KIND, PAYLOAD_T>): () => boolean;
}
