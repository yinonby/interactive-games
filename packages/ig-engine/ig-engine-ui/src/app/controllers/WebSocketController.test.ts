
import type { LoggerAdapter } from "@ig/lib";
import type { AppDispatch } from "../model/reducers/AppReduxStore";
import { useClientLogger } from "../providers/useClientLogger";
import { handleWebSocketMessage } from "./WebSocketController";

// 🔹 mock the imported handlers
jest.mock(
  "../../domains/user-config/controller/ws-actions/UserConfigWebSocketController",
  () => ({
    handleUserConfigWebSocketMessage: jest.fn(),
  })
);

jest.mock(
  "../../domains/game-instance/controller/ws-actions/GameInstanceWebSocketController",
  () => ({
    handleGameInstanceWebSocketMessage: jest.fn(),
  })
);

// 🔹 import the mocked functions AFTER jest.mock
import {
  handleUserConfigWebSocketMessage,
} from "../../domains/user-config/controller/ws-actions/UserConfigWebSocketController";

import type { AppWebSocketMessagePayloadT, AppWebSocketRcvMsgKindT } from "@ig/engine-models";
import {
  handleGameInstanceWebSocketMessage,
} from "../../domains/game-instance/controller/ws-actions/GameInstanceWebSocketController";

describe("handleWebSocketMessage", () => {
  const dispatch = jest.fn() as unknown as AppDispatch;
  const logger: LoggerAdapter = useClientLogger();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("handles gamesUserConfigUpdate messages", () => {
    handleWebSocketMessage(
      "gamesUserConfigUpdate",
      undefined,
      dispatch,
      logger,
    );

    expect(handleUserConfigWebSocketMessage).toHaveBeenCalledTimes(1);
    expect(handleUserConfigWebSocketMessage).toHaveBeenCalledWith(
      "gamesUserConfigUpdate",
      dispatch
    );

    expect(handleGameInstanceWebSocketMessage).not.toHaveBeenCalled();
  });

  it("handles gamesGameInstanceUpdate messages", () => {
    const payload: AppWebSocketMessagePayloadT = { gameInstanceId: "123" };

    handleWebSocketMessage(
      "gamesGameInstanceUpdate",
      payload,
      dispatch,
      logger,
    );

    expect(handleGameInstanceWebSocketMessage).toHaveBeenCalledTimes(1);
    expect(handleGameInstanceWebSocketMessage).toHaveBeenCalledWith(
      "gamesGameInstanceUpdate",
      payload,
      dispatch,
    );

    expect(handleUserConfigWebSocketMessage).not.toHaveBeenCalled();
  });

  it("throws on invalid message kind", () => {
    const errorSpy = jest.spyOn(logger, 'error');

    handleWebSocketMessage(
      "invalid-message" as AppWebSocketRcvMsgKindT,
      undefined,
      dispatch,
      logger,
    );

    expect(handleUserConfigWebSocketMessage).not.toHaveBeenCalled();
    expect(handleGameInstanceWebSocketMessage).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalled();
  });
});
