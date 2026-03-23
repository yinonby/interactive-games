
import type { WebsocketMessagePayloadT } from '@ig/client-utils';
import type { LoggerAdapter } from '@ig/utils';
import { useEffect, type FC, type PropsWithChildren } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../model/reducers/AppReduxStore';
import { useClientLogger } from '../providers/useClientLogger';
import { useAppWsClient } from './AppConfigProvider';

export type AppWebSocketMsgHandlerT = (
  msgKind: string,
  payload: WebsocketMessagePayloadT | undefined,
  dispatch: AppDispatch,
  logger: LoggerAdapter,
) => boolean;

export type AppWebSocketProviderPropsT = {
  appWebSocketMsgHandlers: AppWebSocketMsgHandlerT[],
}

export const AppWebSocketProvider: FC<PropsWithChildren<AppWebSocketProviderPropsT>> = (props) => {
  const { appWebSocketMsgHandlers, children } = props;
  const dispatch = useDispatch<AppDispatch>();
  const logger = useClientLogger();
  const { wsClient } = useAppWsClient();

  const msgHandler = (msgKind: string, payload?: WebsocketMessagePayloadT) => {
    let wasHandled = false;
    for (const appWebSocketMsgHandler of appWebSocketMsgHandlers) {
      if (appWebSocketMsgHandler(msgKind, payload, dispatch, logger)) {
        wasHandled = true;
      }
      // keep trying other handlers - messages are allowed to be handled by more than one handler
    }
    if (!wasHandled) {
      logger.error(`Invalid message type, not handled by any handler, msgKind [${msgKind}]`);
    }
  }

  useEffect(() => {
    // subscribe returns an unsubscribe function
    const handlerDestructor = wsClient.subscribe(msgHandler);

    return () => { handlerDestructor() };
  }, [msgHandler]);

  return children;
}
