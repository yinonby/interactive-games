
import type {
  GameInstanceIdT
} from "../game/GameTypes";

// user-config-update
export type UserConfigeWebSocketMsgKindT = "user-config-update";

// game-instance-update
export type GameInstanceUpdateWebSocketMsgKindT = "game-instance-update";
export type GameInstanceWebSocketMessagePayloadT = { gameInstanceId: GameInstanceIdT };

// aggregate
export type AppWebSocketRcvMsgKindT = UserConfigeWebSocketMsgKindT | GameInstanceUpdateWebSocketMsgKindT;
export type AppWebSocketMessagePayloadT = GameInstanceWebSocketMessagePayloadT;
