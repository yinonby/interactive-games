
export type AppApiServerErrorT = {
  status: number;
  apiErrCode?: AppApiServerErrorCodeT;
};

export type AppApiServerErrorCodeT =
  | "apiError:server"
;
