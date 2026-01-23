
import type { AppDispatch } from "@ig/engine-app-ui";
import type {
  AppWebSocketMessagePayloadT,
  AppWebSocketRcvMsgKindT,
  GameInstanceWebSocketMessagePayloadT
} from "@ig/engine-models";
import type { LoggerAdapter } from "@ig/lib";
import {
  handleGamesInstanceWebSocketMessage
} from "../domains/game-instance/controller/ws-actions/GameInstanceWebSocketController";
import {
  handleGamesUserConfigWebSocketMessage
} from "../domains/user-config/controller/ws-actions/GamesUserConfigWebSocketController";

export const handleGamesWebSocketMessage = (
  msgKind: AppWebSocketRcvMsgKindT,
  payload: AppWebSocketMessagePayloadT | undefined,
  dispatch: AppDispatch,
  logger: LoggerAdapter,
): boolean => {
  logger.debug(`Received ws message, msgKind [${msgKind}]` +
    (payload === undefined ? ", no payload" : `, payload [${JSON.stringify(payload)}]`));

  if (msgKind === 'gamesUserConfigUpdate') {
    handleGamesUserConfigWebSocketMessage(msgKind, dispatch);
    return true;
  } else if (msgKind === "gamesGameInstanceUpdate") {
    handleGamesInstanceWebSocketMessage(msgKind, payload as GameInstanceWebSocketMessagePayloadT, dispatch);
    return true;
  }
  return false;
}
