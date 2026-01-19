
import { useClientLogger, type AppDispatch } from "@ig/engine-app-ui";
import type { AppWebSocketMessagePayloadT, AppWebSocketRcvMsgKindT } from "@ig/engine-models";
import type { LoggerAdapter } from "@ig/lib";
import { handleWebSocketMessage } from "./WebSocketController";

// mocks
jest.mock(
  "../domains/user-config/controller/ws-actions/UserConfigWebSocketController",
  () => ({
    handleUserConfigWebSocketMessage: jest.fn(),
  })
);

jest.mock(
  "../domains/game-instance/controller/ws-actions/GameInstanceWebSocketController",
  () => ({
    handleGameInstanceWebSocketMessage: jest.fn(),
  })
);

// import after mocks
import {
  handleUserConfigWebSocketMessage,
} from "../domains/user-config/controller/ws-actions/UserConfigWebSocketController";

import {
  handleGameInstanceWebSocketMessage,
} from "../domains/game-instance/controller/ws-actions/GameInstanceWebSocketController";

// tests

describe("handleWebSocketMessage", () => {
  const dispatch = jest.fn() as unknown as AppDispatch;
  const logger: LoggerAdapter = useClientLogger();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("handles gamesUserConfigUpdate messages", () => {
    const wassHandled = handleWebSocketMessage(
      "gamesUserConfigUpdate",
      undefined,
      dispatch,
      logger,
    );

    expect(wassHandled).toBe(true);
    expect(handleUserConfigWebSocketMessage).toHaveBeenCalledTimes(1);
    expect(handleUserConfigWebSocketMessage).toHaveBeenCalledWith(
      "gamesUserConfigUpdate",
      dispatch
    );

    expect(handleGameInstanceWebSocketMessage).not.toHaveBeenCalled();
  });

  it("handles gamesGameInstanceUpdate messages", () => {
    const payload: AppWebSocketMessagePayloadT = { gameInstanceId: "123" };

    const wassHandled = handleWebSocketMessage(
      "gamesGameInstanceUpdate",
      payload,
      dispatch,
      logger,
    );

    expect(wassHandled).toBe(true);
    expect(handleGameInstanceWebSocketMessage).toHaveBeenCalledTimes(1);
    expect(handleGameInstanceWebSocketMessage).toHaveBeenCalledWith(
      "gamesGameInstanceUpdate",
      payload,
      dispatch,
    );

    expect(handleUserConfigWebSocketMessage).not.toHaveBeenCalled();
  });

  it("doesn't handle other messages", () => {
    const wassHandled = handleWebSocketMessage(
      "invalid-message" as AppWebSocketRcvMsgKindT,
      undefined,
      dispatch,
      logger,
    );

    expect(wassHandled).toBe(false);
    expect(handleUserConfigWebSocketMessage).not.toHaveBeenCalled();
    expect(handleGameInstanceWebSocketMessage).not.toHaveBeenCalled();
  });
});
