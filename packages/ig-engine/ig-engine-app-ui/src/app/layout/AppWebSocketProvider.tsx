
import type { AppWebSocketMessagePayloadT, AppWebSocketRcvMsgKindT } from "@ig/engine-models";
import type { LoggerAdapter } from "@ig/lib";
import { type FC, type PropsWithChildren } from 'react';
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../model/reducers/AppReduxStore";
import { useClientLogger } from "../providers/useClientLogger";
import { useWsClient } from "../providers/useWsClient";
import { useAppConfig } from "./AppConfigProvider";
import { WebSocketProvider } from "./WebSocketProvider";

export type AppWebSocketMsgHandlerT = (msgKind: AppWebSocketRcvMsgKindT,
  payload: AppWebSocketMessagePayloadT | undefined, dispatch: AppDispatch, logger: LoggerAdapter) => boolean;

export type AppWebSocketProviderPropsT = {
  appWebSocketMsgHandlers: AppWebSocketMsgHandlerT[],
}

export const AppWebSocketProvider: FC<PropsWithChildren<AppWebSocketProviderPropsT>> = (props) => {
  const { appWebSocketMsgHandlers, children } = props;
  const { gameUiConfig } = useAppConfig();
  const dispatch = useDispatch<AppDispatch>();
  const logger = useClientLogger();

  const msgHandler = (msgKind: AppWebSocketRcvMsgKindT, payload?: AppWebSocketMessagePayloadT) => {
    let wassHandled = false;
    for (const appWebSocketMsgHandler of appWebSocketMsgHandlers) {
      if (appWebSocketMsgHandler(msgKind, payload, dispatch, logger)) {
        wassHandled = true;
      }
      // keep trying other handlers - messages are allowed to be handled by more than one handler
    }
    if (!wassHandled) {
      logger.error(`Invalid message type, not handled by any handler, msgKind [${msgKind}]`);
    }
  }

  return (
    <WebSocketProvider<AppWebSocketRcvMsgKindT, never, AppWebSocketMessagePayloadT>
      testID="websocket-provider-tid"
      wsClient={useWsClient(gameUiConfig.wssUrl, gameUiConfig.isDevel)}
      msgHandler={msgHandler}
    >
      {children}
    </WebSocketProvider>
  );
}
