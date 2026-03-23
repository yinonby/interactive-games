
import type { WebsocketAdapter, WebsocketMessageHandlerT } from '@ig/client-utils';
import type { TestableComponentT } from '@ig/rnui';
import { useEffect, useRef, type PropsWithChildren } from 'react';

export type WebSocketProviderPropsT = TestableComponentT & {
  wsClient: WebsocketAdapter,
  msgHandler: WebsocketMessageHandlerT,
};

export function WebSocketProvider(
  props: PropsWithChildren<WebSocketProviderPropsT>
) {
  const { wsClient, msgHandler, children } = props;
  const wsClientRef = useRef(wsClient);

  useEffect(() => {
    wsClientRef.current.connect();

    return () => {
      wsClientRef.current.disconnect();
    }
  }, []);

  useEffect(() => {
    // subscribe returns an unsubscribe function
    const handlerDestructor = wsClientRef.current.subscribe(msgHandler);
    return () => { handlerDestructor() };
  }, [msgHandler]);

  return children;
}
