
import { type EngineApiErrorCodeT } from '@ig/app-engine-models';
import { type GamesApiServerErrorCodeT } from '@ig/games-engine-models';

export type AppApiServerErrorT = {
  status: number;
  apiErrCode?: ApiServerErrorCodeT;
};

export type ApiServerErrorCodeT =
  | EngineApiErrorCodeT
  | GamesApiServerErrorCodeT
  | "apiError:server"
;

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
