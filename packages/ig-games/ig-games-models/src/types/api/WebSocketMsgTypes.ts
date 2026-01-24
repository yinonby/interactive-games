
import type {
  GameInstanceIdT
} from "../game/GameTypes";

// gamesUserConfigUpdate
export type GamesUserConfigeWebSocketMsgKindT = "gamesUserConfigUpdate";

// gamesInstanceUpdate
export type GamesInstanceUpdateWebSocketMsgKindT = "gamesInstanceUpdate";
export type GamesInstanceWebSocketMessagePayloadT = { gameInstanceId: GameInstanceIdT };

// aggregate
export type GamesWebSocketMsgKindT = GamesUserConfigeWebSocketMsgKindT | GamesInstanceUpdateWebSocketMsgKindT;
export type GamesWebSocketMessagePayloadT = GamesInstanceWebSocketMessagePayloadT;

