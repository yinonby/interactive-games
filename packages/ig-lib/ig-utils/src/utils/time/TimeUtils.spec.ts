
import * as TimeUtils from './TimeUtils';

// chai.use(chaiAsPromised)

describe("TimeUtils Tests", () => {
  it("should sleep", async () => {
    await TimeUtils.sleep(1);
  });
  it("should getCurTs", () => {
    assert(TimeUtils.getCurTs() > 0);
  });
  it("should getCurDate", () => {
    assert(TimeUtils.getCurDate().getTime() > 0);
  });
  it("should isElapsed: elapsed", () => {
    const ts = 10;
    const expiryMs = 20;
    const nowTs = 30;
    assert(TimeUtils.isElapsed(ts, expiryMs, nowTs) === true);
  });
  it("should isElapsed: not elapsed", () => {
    const ts = 10;
    const expiryMs = 20;
    const nowTs = 29;
    assert(TimeUtils.isElapsed(ts, expiryMs, nowTs) === false);
  });
  it("should getCurYear", () => {
    assert(TimeUtils.getCurYear() > 2024);
  });
  it("should msToStr: days", () => {
    assert(TimeUtils.msToStr(TimeUtils.DAYS_TO_MS(2)) === "2 days");
  });
  it("should msToStr: days+", () => {
    assert(TimeUtils.msToStr(TimeUtils.DAYS_TO_MS(1) + TimeUtils.SEC_TO_MS(1)) === "1 day, 1 second");
  });
  it("should msToStr: hours", () => {
    assert(TimeUtils.msToStr(TimeUtils.HOURS_TO_MS(2)) === "2 hours");
  });
  it("should msToStr: hours+", () => {
    assert(TimeUtils.msToStr(TimeUtils.HOURS_TO_MS(1) + TimeUtils.SEC_TO_MS(1)) === "1 hour, 1 second");
  });
  it("should msToStr: minutes", () => {
    assert(TimeUtils.msToStr(TimeUtils.MIN_TO_MS(2)) === "2 minutes");
  });
  it("should msToStr: minutes+", () => {
    assert(TimeUtils.msToStr(TimeUtils.MIN_TO_MS(1) + TimeUtils.SEC_TO_MS(1)) === "1 minute, 1 second");
  });
  it("should msToStr: milliseconds", () => {
    assert(TimeUtils.msToStr(TimeUtils.SEC_TO_MS(2)) === "2 seconds");
  });
  it("should msToStr: seconds", () => {
    assert(TimeUtils.msToStr(2) === "2 milliseconds");
  });
  it("should SEC_TO_MS", () => {
    assert(TimeUtils.SEC_TO_MS(1) === 1000);
  });
  it("should MS_TO_SEC", () => {
    assert(TimeUtils.MS_TO_SEC(1000) === 1);
  });
  it("should MIN_TO_MS", () => {
    assert(TimeUtils.MIN_TO_MS(1) === 1000 * 60);
  });
  it("should MS_TO_MIN", () => {
    assert(TimeUtils.MS_TO_MIN(1000 * 60) === 1);
  });
  it("should HOURS_TO_MS", () => {
    assert(TimeUtils.HOURS_TO_MS(1) === 1000 * 60 * 60);
  });
  it("should MS_TO_HOURS", () => {
    assert(TimeUtils.MS_TO_HOURS(1000 * 60 * 60) === 1);
  });
  it("should DAYS_TO_MS", () => {
    assert(TimeUtils.DAYS_TO_MS(1) === 1000 * 60 * 60 * 24);
  });
  it("should MS_TO_DAYS", () => {
    assert(TimeUtils.MS_TO_DAYS(1000 * 60 * 60 * 24) === 1);
  });
});
