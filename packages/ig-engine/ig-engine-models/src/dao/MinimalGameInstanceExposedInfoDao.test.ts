
import { buildTestMinimalGameConfig, buildTestMinimalGameInstanceExposedInfo } from '@test/utils/TestUtils';
import type { MinimalGameInstanceExposedInfoT } from "../types/game/GameTypes";
import { MinimalGameInstanceExposedInfoDao } from "./MinimalGameInstanceExposedInfoDao";

describe('MinimalGameInstanceExposedInfoDao', () => {
  it('should compare by status', () => {
    const mgiiNotStarted: MinimalGameInstanceExposedInfoT = buildTestMinimalGameInstanceExposedInfo({
      minimalGameConfig: buildTestMinimalGameConfig({
        gameName: "AA",
      }),
      gameStatus: 'not-started',
    });
    const mgiiInProcess: MinimalGameInstanceExposedInfoT = buildTestMinimalGameInstanceExposedInfo({
      minimalGameConfig: buildTestMinimalGameConfig({
        gameName: "AA",
      }),
      gameStatus: 'in-process',
    });
    const mgiiEnded: MinimalGameInstanceExposedInfoT = buildTestMinimalGameInstanceExposedInfo({
      minimalGameConfig: buildTestMinimalGameConfig({
        gameName: "AA",
      }),
      gameStatus: 'ended',
    });
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

  it('should compare by name', () => {
    const mgiiAA: MinimalGameInstanceExposedInfoT = buildTestMinimalGameInstanceExposedInfo({
      minimalGameConfig: buildTestMinimalGameConfig({
        gameName: "AA",
      }),
      gameStatus: 'not-started',
    });
    const mgiiBB: MinimalGameInstanceExposedInfoT = buildTestMinimalGameInstanceExposedInfo({
      minimalGameConfig: buildTestMinimalGameConfig({
        gameName: "BB",
      }),
      gameStatus: 'not-started',
    });
    const mgiiAADao = new MinimalGameInstanceExposedInfoDao(mgiiAA);
    const mgiiBBDao = new MinimalGameInstanceExposedInfoDao(mgiiBB);

    expect(mgiiAADao.compare(mgiiAADao)).toEqual(0);
    expect(mgiiAADao.compare(mgiiBBDao)).toEqual(-1);
    expect(mgiiBBDao.compare(mgiiAADao)).toEqual(1);
  });
});
