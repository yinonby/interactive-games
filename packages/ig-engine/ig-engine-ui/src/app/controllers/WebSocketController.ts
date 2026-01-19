
import type {
  AppWebSocketMessagePayloadT,
  AppWebSocketRcvMsgKindT,
  GameInstanceWebSocketMessagePayloadT
} from "@ig/engine-models";
import type { LoggerAdapter } from "@ig/lib";
import {
  handleGameInstanceWebSocketMessage
} from "../../domains/game-instance/controller/ws-actions/GameInstanceWebSocketController";
import {
  handleUserConfigWebSocketMessage
} from "../../domains/user-config/controller/ws-actions/UserConfigWebSocketController";
import type { AppDispatch } from "../model/reducers/AppReduxStore";

export const handleWebSocketMessage = (
  msgKind: AppWebSocketRcvMsgKindT,
  payload: AppWebSocketMessagePayloadT | undefined,
  dispatch: AppDispatch,
  logger: LoggerAdapter,
): void => {
  logger.debug(`Received ws message, msgKind [${msgKind}]` +
    (payload === undefined ? ", no payload" : `, payload [${JSON.stringify(payload)}]`));

  if (msgKind === 'gamesUserConfigUpdate') {
    handleUserConfigWebSocketMessage(msgKind, dispatch);
  } else if (msgKind === "gamesGameInstanceUpdate") {
    handleGameInstanceWebSocketMessage(msgKind, payload as GameInstanceWebSocketMessagePayloadT, dispatch);
  } else {
    logger.error(`Invalid message type, msgKind [${msgKind}]`);
  }
}
