
import type { GamesApiServerErrorCodeT } from './GamesErrorTypes';

export type AppApiServerErrorT = {
  status: number;
  apiErrCode?: ApiServerErrorCodeT;
};

export type ApiServerErrorCodeT =
  | GamesApiServerErrorCodeT
  | "apiError:server"
;
