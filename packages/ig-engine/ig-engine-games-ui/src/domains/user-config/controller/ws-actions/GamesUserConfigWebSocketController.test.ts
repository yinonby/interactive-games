
import { handleGamesUserConfigWebSocketMessage } from "./GamesUserConfigWebSocketController";

// 🔹 mock the RTK API util
jest.mock("../../model/rtk/GamesUserConfigRtkApi", () => ({
  gamesUserConfigRtkApiUtil: {
    invalidateTags: jest.fn(),
  },
}));

// 🔹 import mocked util AFTER jest.mock
import type { AppDispatch } from "@ig/engine-app-ui";
import type { UserConfigeWebSocketMsgKindT } from "@ig/engine-models";
import { gamesUserConfigRtkApiUtil } from "../../model/rtk/GamesUserConfigRtkApi";

describe("handleGamesUserConfigWebSocketMessage", () => {
  const dispatch = jest.fn() as unknown as AppDispatch;
  const invalidateTagsSpy = jest.spyOn(gamesUserConfigRtkApiUtil, 'invalidateTags');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("dispatches invalidateTags on gamesUserConfigUpdate", () => {
    const invalidateResult = { type: "TEST_ACTION", payload: [] };

    // make invalidateTags return a fake action
    invalidateTagsSpy.mockReturnValue(
      invalidateResult
    );

    handleGamesUserConfigWebSocketMessage(
      "gamesUserConfigUpdate",
      dispatch
    );

    expect(gamesUserConfigRtkApiUtil.invalidateTags).toHaveBeenCalledTimes(1);
    expect(gamesUserConfigRtkApiUtil.invalidateTags).toHaveBeenCalledWith([
      "GamesUserConfigTag",
    ]);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(invalidateResult);
  });

  it("throws on invalid message kind", () => {
    expect(() =>
      handleGamesUserConfigWebSocketMessage(
        "invalid-message" as UserConfigeWebSocketMsgKindT,
        dispatch
      )
    ).toThrow("Invalid message type");

    expect(gamesUserConfigRtkApiUtil.invalidateTags).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });
});
