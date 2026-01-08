
import type { LoggerAdapter } from "@ig/lib";
import type { AppWebSocketMessagePayloadT, AppWebSocketRcvMsgKindT } from "../../types/ApiRequestTypes";
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

import {
  handleGameInstanceWebSocketMessage,
} from "../../domains/game-instance/controller/ws-actions/GameInstanceWebSocketController";

describe("handleWebSocketMessage", () => {
  const dispatch = jest.fn() as unknown as AppDispatch;
  const logger: LoggerAdapter = useClientLogger();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("handles user-config-update messages", () => {
    handleWebSocketMessage(
      "user-config-update",
      undefined,
      dispatch,
      logger,
    );

    expect(handleUserConfigWebSocketMessage).toHaveBeenCalledTimes(1);
    expect(handleUserConfigWebSocketMessage).toHaveBeenCalledWith(
      "user-config-update",
      dispatch
    );

    expect(handleGameInstanceWebSocketMessage).not.toHaveBeenCalled();
  });

  it("handles game-instance-update messages", () => {
    const payload: AppWebSocketMessagePayloadT = { gameInstanceId: "123" };

    handleWebSocketMessage(
      "game-instance-update",
      payload,
      dispatch,
      logger,
    );

    expect(handleGameInstanceWebSocketMessage).toHaveBeenCalledTimes(1);
    expect(handleGameInstanceWebSocketMessage).toHaveBeenCalledWith(
      "game-instance-update",
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
