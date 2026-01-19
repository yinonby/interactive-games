
import type {
  GameInstanceIdT
} from "../game/GameTypes";

// gamesUserConfigUpdate
export type UserConfigeWebSocketMsgKindT = "gamesUserConfigUpdate";

// gamesGameInstanceUpdate
export type GameInstanceUpdateWebSocketMsgKindT = "gamesGameInstanceUpdate";
export type GameInstanceWebSocketMessagePayloadT = { gameInstanceId: GameInstanceIdT };

// aggregate
export type AppWebSocketRcvMsgKindT = UserConfigeWebSocketMsgKindT | GameInstanceUpdateWebSocketMsgKindT;
export type AppWebSocketMessagePayloadT = GameInstanceWebSocketMessagePayloadT;
