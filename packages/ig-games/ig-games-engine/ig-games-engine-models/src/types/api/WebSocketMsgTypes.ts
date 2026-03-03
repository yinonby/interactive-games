
import type {
  GameInstanceIdT
} from '../game/GameInstanceTypes';

// gamesInstanceUpdate
export type GamesInstanceUpdateWebSocketMsgKindT = "gamesInstanceUpdate";
export type GamesInstanceWebSocketMessagePayloadT = { gameInstanceId: GameInstanceIdT };

// aggregate
export type GamesWebSocketMsgKindT = GamesInstanceUpdateWebSocketMsgKindT;
export type GamesWebSocketMessagePayloadT = GamesInstanceWebSocketMessagePayloadT;

