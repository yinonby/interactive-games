
import type { AppDispatch } from '@ig/app-engine-ui';
import type {
  GamesWebSocketMessagePayloadT,
  GamesWebSocketMsgKindT
} from '@ig/games-engine-models';
import type { LoggerAdapter } from '@ig/utils';
import {
  handleGamesInstanceWebSocketMessage
} from '../domains/game-instance/controller/ws-actions/GameInstanceWebSocketController';

export const handleGamesWebSocketMessage = (
  msgKind: GamesWebSocketMsgKindT,
  payload: GamesWebSocketMessagePayloadT | undefined,
  dispatch: AppDispatch,
  logger: LoggerAdapter,
): boolean => {
  logger.debug(`Received ws message, msgKind [${msgKind}]` +
    (payload === undefined ? ", no payload" : `, payload [${JSON.stringify(payload)}]`));

  if (msgKind === "gamesInstanceUpdate") {
    handleGamesInstanceWebSocketMessage(msgKind, payload as GamesWebSocketMessagePayloadT, dispatch);
    return true;
  }
  return false;
}
