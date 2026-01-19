
import type { AppDispatch } from "@ig/engine-app-ui";
import type {
  AppWebSocketMessagePayloadT,
  AppWebSocketRcvMsgKindT,
  GameInstanceWebSocketMessagePayloadT
} from "@ig/engine-models";
import type { LoggerAdapter } from "@ig/lib";
import {
  handleGameInstanceWebSocketMessage
} from "../domains/game-instance/controller/ws-actions/GameInstanceWebSocketController";
import {
  handleUserConfigWebSocketMessage
} from "../domains/user-config/controller/ws-actions/UserConfigWebSocketController";

export const handleWebSocketMessage = (
  msgKind: AppWebSocketRcvMsgKindT,
  payload: AppWebSocketMessagePayloadT | undefined,
  dispatch: AppDispatch,
  logger: LoggerAdapter,
): boolean => {
  logger.debug(`Received ws message, msgKind [${msgKind}]` +
    (payload === undefined ? ", no payload" : `, payload [${JSON.stringify(payload)}]`));

  if (msgKind === 'gamesUserConfigUpdate') {
    handleUserConfigWebSocketMessage(msgKind, dispatch);
    return true;
  } else if (msgKind === "gamesGameInstanceUpdate") {
    handleGameInstanceWebSocketMessage(msgKind, payload as GameInstanceWebSocketMessagePayloadT, dispatch);
    return true;
  }
  return false;
}
