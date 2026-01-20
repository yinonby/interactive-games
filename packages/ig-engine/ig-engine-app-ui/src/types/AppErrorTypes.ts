
import type { ApiServerErrorCodeT } from "@ig/engine-models";

export type AppErrorCodeT =
  | ApiServerErrorCodeT
  | "appError:networkError"
  | "appError:invalidResponse"
  | "appError:unknown"
;

export class AppError extends Error {
  constructor(public appErrCode: AppErrorCodeT) {
    super("AppError");
  }
}
