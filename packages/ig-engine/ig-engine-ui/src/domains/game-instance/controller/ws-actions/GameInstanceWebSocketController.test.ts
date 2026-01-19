
import type { AppDispatch } from "../../../../app/model/reducers/AppReduxStore";
import { handleGameInstanceWebSocketMessage } from "./GameInstanceWebSocketController";

// 🔹 mock the RTK API util
jest.mock("../../model/rtk/GameInstanceRtkApi", () => ({
  gameInstanceRtkApiUtil: {
    invalidateTags: jest.fn(),
  },
}));

// 🔹 import mocked util AFTER jest.mock
import type { GameInstanceUpdateWebSocketMsgKindT } from "@ig/engine-models";
import { gameInstanceRtkApiUtil } from "../../model/rtk/GameInstanceRtkApi";

describe("handleGameInstanceWebSocketMessage", () => {
  const dispatch = jest.fn() as unknown as AppDispatch;
  const invalidateTagsSpy = jest.spyOn(gameInstanceRtkApiUtil, 'invalidateTags');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("dispatches invalidateTags on gamesUserConfigUpdate", () => {
    const invalidateResult = { type: "TEST_ACTION", payload: [] };

    // make invalidateTags return a fake action
    invalidateTagsSpy.mockReturnValue(
      invalidateResult
    );

    handleGameInstanceWebSocketMessage(
      "gamesGameInstanceUpdate",
      { gameInstanceId: "giid-1" },
      dispatch
    );

    expect(gameInstanceRtkApiUtil.invalidateTags).toHaveBeenCalledTimes(1);
    expect(gameInstanceRtkApiUtil.invalidateTags).toHaveBeenCalledWith([
      { type: 'GamesInstanceTag', id: "giid-1" }
    ]);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(invalidateResult);
  });

  it("throws on invalid message kind", () => {
    expect(() =>
      handleGameInstanceWebSocketMessage(
        "invalid-message" as GameInstanceUpdateWebSocketMsgKindT,
        { gameInstanceId: "giid-1" },
        dispatch
      )
    ).toThrow("Invalid message type");

    expect(gameInstanceRtkApiUtil.invalidateTags).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });
});
