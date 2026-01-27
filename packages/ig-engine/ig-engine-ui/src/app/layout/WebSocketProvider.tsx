
import type { WebSocketAdapter, WebSocketMessageHandlerT } from "@ig/client-utils";
import { useEffect, useRef, type ReactNode } from 'react';

export type WebSocketProviderPropsT<MSG_KIND_T, SND_MSG_KIND, PAYLOAD_T> = {
  wsClient: WebSocketAdapter<MSG_KIND_T, SND_MSG_KIND, PAYLOAD_T>,
  msgHandler: WebSocketMessageHandlerT<MSG_KIND_T, PAYLOAD_T>,
  children: ReactNode,
  testID?: string,
};

export function WebSocketProvider<MSG_KIND_T, SND_MSG_KIND, PAYLOAD_T>(
  props: WebSocketProviderPropsT<MSG_KIND_T, SND_MSG_KIND, PAYLOAD_T>
) {
  const { wsClient, msgHandler, children } = props;
  const wsClientRef = useRef<WebSocketAdapter<MSG_KIND_T, SND_MSG_KIND, PAYLOAD_T>>(wsClient);

  useEffect(() => {
    wsClientRef.current.connect();
    return () => wsClientRef.current.disconnect();
  }, []);

  useEffect(() => {
    // subscribe returns an unsubscribe function
    const handlerDestructor = wsClientRef.current.subscribe(msgHandler);
    return () => { handlerDestructor() };
  }, [msgHandler]);

  return children;
}
