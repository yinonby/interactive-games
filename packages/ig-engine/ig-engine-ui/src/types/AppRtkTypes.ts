
import type { AppApiServerErrorCodeT } from "@ig/engine-models";

export type AppErrorCodeT = AppApiServerErrorCodeT
  | "appError:networkError"
  | "appError:invalidResponse"
  | "appError:unknown"
;

export type AppRtkErrorT = {
  status: number,
  appErrCode: AppErrorCodeT;
  errMsg?: string,
};
