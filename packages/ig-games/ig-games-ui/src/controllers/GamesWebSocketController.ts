
import type { AppDispatch } from "@ig/engine-app-ui";
import type {
  GamesWebSocketMessagePayloadT,
  GamesWebSocketMsgKindT
} from '@ig/games-models';
import type { LoggerAdapter } from "@ig/lib";
import {
  handleGamesInstanceWebSocketMessage
} from "../domains/game-instance/controller/ws-actions/GameInstanceWebSocketController";
import {
  handleGamesUserConfigWebSocketMessage
} from "../domains/user-config/controller/ws-actions/GamesUserConfigWebSocketController";

export const handleGamesWebSocketMessage = (
  msgKind: GamesWebSocketMsgKindT,
  payload: GamesWebSocketMessagePayloadT | undefined,
  dispatch: AppDispatch,
  logger: LoggerAdapter,
): boolean => {
  logger.debug(`Received ws message, msgKind [${msgKind}]` +
    (payload === undefined ? ", no payload" : `, payload [${JSON.stringify(payload)}]`));

  if (msgKind === 'gamesUserConfigUpdate') {
    handleGamesUserConfigWebSocketMessage(msgKind, dispatch);
    return true;
  } else if (msgKind === "gamesInstanceUpdate") {
    handleGamesInstanceWebSocketMessage(msgKind, payload as GamesWebSocketMessagePayloadT, dispatch);
    return true;
  }
  return false;
}
