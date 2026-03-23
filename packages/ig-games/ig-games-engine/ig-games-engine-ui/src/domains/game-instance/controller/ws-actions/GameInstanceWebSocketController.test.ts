
import type { AppDispatch } from '@ig/app-engine-ui';
import {
  createGameInstanceUpdatesWebsocketMessageHandler,
  type GameInstanceWebsocketUpdatesConfigT
} from './GameInstanceWebSocketController';

// mock the RTK API util
jest.mock("../../model/rtk/GameInstanceRtkApi", () => ({
  gameInstanceRtkApiUtil: {
    invalidateTags: jest.fn(),
  },
}));

// import mocked util AFTER jest.mock
import { gameInstanceRtkApiUtil } from '../../model/rtk/GameInstanceRtkApi';

describe("createGameInstanceUpdatesWebsocketMessageHandler(config)", () => {
  const dispatch = jest.fn() as unknown as AppDispatch;
  const invalidateTagsSpy = jest.spyOn(gameInstanceRtkApiUtil, 'invalidateTags');
  const config: GameInstanceWebsocketUpdatesConfigT = {
    gameInstanceUpdateNotificationName: 'gamesInstanceUpdate',
    gameInstanceIdFieldName: 'gameInstanceId',
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not dispatch when payload is undefined", () => {
    createGameInstanceUpdatesWebsocketMessageHandler(config)(
      config.gameInstanceUpdateNotificationName,
      undefined,
      dispatch
    );

    expect(gameInstanceRtkApiUtil.invalidateTags).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it("dispatches invalidateTags on gamesInstanceUpdate", () => {
    const invalidateResult = { type: "TEST_ACTION", payload: [] };

    // make invalidateTags return a fake action
    invalidateTagsSpy.mockReturnValue(
      invalidateResult
    );

    createGameInstanceUpdatesWebsocketMessageHandler(config)(
      config.gameInstanceUpdateNotificationName,
      { gameInstanceId: "giid-1" },
      dispatch
    );

    expect(gameInstanceRtkApiUtil.invalidateTags).toHaveBeenCalledTimes(1);
    expect(gameInstanceRtkApiUtil.invalidateTags).toHaveBeenCalledWith([
      { type: 'GameInstanceTag', id: "giid-1" }
    ]);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(invalidateResult);
  });

  it("does not dispatch when message kind is invalid", () => {
    createGameInstanceUpdatesWebsocketMessageHandler(config)(
      "invalid-message",
      { gameInstanceId: "giid-1" },
      dispatch
    );

    expect(gameInstanceRtkApiUtil.invalidateTags).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });
});
