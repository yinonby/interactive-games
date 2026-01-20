
import type { MinimalGameInstanceExposedInfoT } from "../types/game/GameTypes";
import { MinimalGameInstanceExposedInfoDao } from "./MinimalGameInstanceExposedInfoDao";

describe('MinimalGameInstanceExposedInfoDao', () => {
  it('should compare by status', () => {
    const mgiiNotStarted: MinimalGameInstanceExposedInfoT = {
      gameInstanceId: "gid-1",
      invitationCode: "invt-code-gid-1",
      minimalGameConfig: {
        gameConfigId: "game-1",
        kind: "joint-game",
        gameName: "AA",
        maxDurationMinutes: 30,
        gamePrice: "free",
        maxParticipants: 4,
        imageAssetName: "escape-room-1",
      },
      playerRole: "admin",
      playerStatus: "playing",
      gameStatus: "not-started",
    }
    const mgiiInProcess: MinimalGameInstanceExposedInfoT = {
      gameInstanceId: "gid-2",
      invitationCode: "invt-code-gid-2",
      minimalGameConfig: {
        gameConfigId: "game-2",
        kind: "joint-game",
        gameName: "AA",
        maxDurationMinutes: 30,
        gamePrice: "free",
        maxParticipants: 4,
        imageAssetName: "escape-room-1",
      },
      playerRole: "admin",
      playerStatus: "playing",
      gameStatus: "in-process",
    }
    const mgiiEnded: MinimalGameInstanceExposedInfoT = {
      gameInstanceId: "gid-3",
      invitationCode: "invt-code-gid-3",
      minimalGameConfig: {
        gameConfigId: "game-3",
        kind: "joint-game",
        gameName: "AA",
        maxDurationMinutes: 30,
        gamePrice: "free",
        maxParticipants: 4,
        imageAssetName: "escape-room-1",
      },
      playerRole: "admin",
      playerStatus: "playing",
      gameStatus: "ended",
    }
    const mgiiNotStartedDao = new MinimalGameInstanceExposedInfoDao(mgiiNotStarted);
    const mgiiInProcessDao = new MinimalGameInstanceExposedInfoDao(mgiiInProcess);
    const mgiiEndedDao = new MinimalGameInstanceExposedInfoDao(mgiiEnded);

    expect(mgiiNotStartedDao.compare(mgiiInProcessDao)).toEqual(1);
    expect(mgiiNotStartedDao.compare(mgiiEndedDao)).toEqual(-1);
    expect(mgiiInProcessDao.compare(mgiiNotStartedDao)).toEqual(-1);
    expect(mgiiInProcessDao.compare(mgiiEndedDao)).toEqual(-1);
    expect(mgiiEndedDao.compare(mgiiNotStartedDao)).toEqual(1);
    expect(mgiiEndedDao.compare(mgiiInProcessDao)).toEqual(1);
  });
  it('should compare by role', () => {
    const mgiiAdmin: MinimalGameInstanceExposedInfoT = {
      gameInstanceId: "gid-1",
      invitationCode: "invt-code-gid-1",
      minimalGameConfig: {
        gameConfigId: "game-1",
        kind: "joint-game",
        gameName: "AA",
        maxDurationMinutes: 30,
        gamePrice: "free",
        maxParticipants: 4,
        imageAssetName: "escape-room-1",
      },
      playerRole: "admin",
      playerStatus: "playing",
      gameStatus: "not-started",
    }
    const mgiiPlayer: MinimalGameInstanceExposedInfoT = {
      gameInstanceId: "gid-2",
      invitationCode: "invt-code-gid-2",
      minimalGameConfig: {
        gameConfigId: "game-2",
        kind: "joint-game",
        gameName: "AA",
        maxDurationMinutes: 30,
        gamePrice: "free",
        maxParticipants: 4,
        imageAssetName: "escape-room-1",
      },
      playerRole: "player",
      playerStatus: "playing",
      gameStatus: "not-started",
    }
    const mgiiAdminDao = new MinimalGameInstanceExposedInfoDao(mgiiAdmin);
    const mgiiPlayerDao = new MinimalGameInstanceExposedInfoDao(mgiiPlayer);

    expect(mgiiAdminDao.compare(mgiiPlayerDao)).toEqual(-1);
    expect(mgiiPlayerDao.compare(mgiiAdminDao)).toEqual(1);
  });
  it('should compare by name', () => {
    const mgiiAA: MinimalGameInstanceExposedInfoT = {
      gameInstanceId: "gid-1",
      invitationCode: "invt-code-gid-1",
      minimalGameConfig: {
        gameConfigId: "game-1",
        kind: "joint-game",
        gameName: "AA",
        maxDurationMinutes: 30,
        gamePrice: "free",
        maxParticipants: 4,
        imageAssetName: "escape-room-1",
      },
      playerRole: "admin",
      playerStatus: "playing",
      gameStatus: "not-started",
    }
    const mgiiBB: MinimalGameInstanceExposedInfoT = {
      gameInstanceId: "gid-2",
      invitationCode: "invt-code-gid-2",
      minimalGameConfig: {
        gameConfigId: "game-2",
        kind: "joint-game",
        gameName: "BB",
        maxDurationMinutes: 30,
        gamePrice: "free",
        maxParticipants: 4,
        imageAssetName: "escape-room-1",
      },
      playerRole: "admin",
      playerStatus: "playing",
      gameStatus: "not-started",
    }
    const mgiiAADao = new MinimalGameInstanceExposedInfoDao(mgiiAA);
    const mgiiBBDao = new MinimalGameInstanceExposedInfoDao(mgiiBB);

    expect(mgiiAADao.compare(mgiiAADao)).toEqual(0);
    expect(mgiiAADao.compare(mgiiBBDao)).toEqual(-1);
    expect(mgiiBBDao.compare(mgiiAADao)).toEqual(1);
  });
});
