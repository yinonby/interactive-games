
import { type ReactNode } from 'react';
import { useDispatch } from "react-redux";
import type { AppWebSocketMessagePayloadT, AppWebSocketRcvMsgKindT } from "../../types/ApiRequestTypes";
import { handleWebSocketMessage } from "../controllers/WebSocketController";
import type { AppDispatch } from "../model/reducers/AppReduxStore";
import { useClientLogger } from "../providers/useClientLogger";
import { useWsClient } from "../providers/useWsClient";
import { useGameContext } from "./GameContextProvider";
import { WebSocketProvider } from "./WebSocketProvider";

export function AppWebSocketProvider({ children }: { children: ReactNode }) {
  const { gameUiConfig } = useGameContext();
  const dispatch = useDispatch<AppDispatch>();
  const msgHandler = (msgKind: AppWebSocketRcvMsgKindT, payload?: AppWebSocketMessagePayloadT) => {
    handleWebSocketMessage(msgKind, payload, dispatch, useClientLogger());
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
