
import type { AppDispatch } from "../../../../app/model/reducers/AppReduxStore";
import { handleUserConfigWebSocketMessage } from "./UserConfigWebSocketController";

// 🔹 mock the RTK API util
jest.mock("../../model/rtk/UserConfigRtkApi", () => ({
  userConfigRtkApiUtil: {
    invalidateTags: jest.fn(),
  },
}));

// 🔹 import mocked util AFTER jest.mock
import type { UserConfigeWebSocketMsgKindT } from "@ig/engine-models";
import { userConfigRtkApiUtil } from "../../model/rtk/UserConfigRtkApi";

describe("handleUserConfigWebSocketMessage", () => {
  const dispatch = jest.fn() as unknown as AppDispatch;
  const invalidateTagsSpy = jest.spyOn(userConfigRtkApiUtil, 'invalidateTags');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("dispatches invalidateTags on user-config-update", () => {
    const invalidateResult = { type: "TEST_ACTION", payload: [] };

    // make invalidateTags return a fake action
    invalidateTagsSpy.mockReturnValue(
      invalidateResult
    );

    handleUserConfigWebSocketMessage(
      "user-config-update",
      dispatch
    );

    expect(userConfigRtkApiUtil.invalidateTags).toHaveBeenCalledTimes(1);
    expect(userConfigRtkApiUtil.invalidateTags).toHaveBeenCalledWith([
      "UserConfigTag",
    ]);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(invalidateResult);
  });

  it("throws on invalid message kind", () => {
    expect(() =>
      handleUserConfigWebSocketMessage(
        "invalid-message" as UserConfigeWebSocketMsgKindT,
        dispatch
      )
    ).toThrow("Invalid message type");

    expect(userConfigRtkApiUtil.invalidateTags).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });
});
