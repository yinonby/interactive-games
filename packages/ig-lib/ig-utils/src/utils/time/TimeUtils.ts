
export const SEC_TO_MS = (sec: number): number => sec * 1000;
export const MS_TO_SEC = (ms: number): number => ms / 1000;
export const MIN_TO_MS = (min: number): number => SEC_TO_MS(min * 60);
export const MS_TO_MIN = (ms: number): number => MS_TO_SEC(ms) / 60;
export const HOURS_TO_MS = (hours: number): number => MIN_TO_MS(hours * 60);
export const MS_TO_HOURS = (ms: number): number => MS_TO_MIN(ms) / 60;
export const DAYS_TO_MS = (days: number): number => HOURS_TO_MS(days * 24);
export const MS_TO_DAYS = (ms: number): number => MS_TO_HOURS(ms) / 24;

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getCurTs(): number {
  return Date.now();
}

export function getCurDate(): Date {
  return new Date(getCurTs());
}

export function isElapsed(ts: number, expiryMs: number, nowTs: number): boolean {
  return (ts + expiryMs <= nowTs);
}

export function getCurYear(): number {
  const nowDate = getCurDate();
  return nowDate.getFullYear();
}

export function msToStr(ms: number): string {
  if (ms >= DAYS_TO_MS(1)) {
    const units: number = MS_TO_DAYS(ms);
    const unitsFloored: number = Math.floor(units);
    const unitsStr = unitsFloored > 1 ? "days" : "day";

    if (units === unitsFloored) {
      return `${unitsFloored} ${unitsStr}`
    } else {
      return `${unitsFloored} ${unitsStr}, ${msToStr(ms - DAYS_TO_MS(unitsFloored))}`
    }
  } else if (ms >= HOURS_TO_MS(1)) {
    const units: number = MS_TO_HOURS(ms);
    const unitsFloored: number = Math.floor(units);
    const unitsStr = unitsFloored > 1 ? "hours" : "hour";

    if (units === unitsFloored) {
      return `${unitsFloored} ${unitsStr}`
    } else {
      return `${unitsFloored} ${unitsStr}, ${msToStr(ms - HOURS_TO_MS(unitsFloored))}`
    }
  } else if (ms >= MIN_TO_MS(1)) {
    const units: number = MS_TO_MIN(ms);
    const unitsFloored: number = Math.floor(units);
    const unitsStr = unitsFloored > 1 ? "minutes" : "minute";

    if (units === unitsFloored) {
      return `${unitsFloored} ${unitsStr}`
    } else {
      return `${unitsFloored} ${unitsStr}, ${msToStr(ms - MIN_TO_MS(unitsFloored))}`
    }
  } else if (ms >= SEC_TO_MS(1)) {
    const seconds: number = Math.floor(MS_TO_SEC(ms));
    return `${seconds} ${seconds > 1 ? "seconds" : "second"}`
  } else {
    return `${ms} milliseconds`
  }
}
